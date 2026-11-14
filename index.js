import { eventSource, event_types, extension_prompt_roles, extension_prompt_types, setExtensionPrompt } from '../../../../script.js';
import { writeExtensionField } from '../../../../scripts/extensions.js';
import { Popup, POPUP_RESULT, POPUP_TYPE } from '../../../../scripts/popup.js';
import { settings, saveSettings, buildPresetData, presetDataToSettings, createPreset } from './settings.js';
import { generateStatusPrompt } from './prompt.js';
import { parseLatestMessage } from './status.js';
import { initUI, renderUI, escapeHTML } from './ui.js';

const context = () => SillyTavern.getContext();
const chatKey = 'status_tracking_settings';
let translations = {};
let status = null;
export function t(key) { return translations[settings.language]?.[key] || key; }
export function currentStatus() { return status; }
function log(...args) { if (settings.debug_mode) console.log('[myst]', ...args); }
export function applyCSS() {
  document.getElementById('status-tracking-custom-css')?.remove();
  if (!settings.custom_css?.trim()) return;
  const style = document.createElement('style');
  style.id = 'status-tracking-custom-css';
  style.textContent = settings.custom_css;
  document.head.append(style);
}
export function changed(chat = false) {
  log('Settings changed', { chat });
  saveSettings();
  applyCSS();
  if (!settings.panel_enabled) setExtensionPrompt('status-tracking-prompt', '', extension_prompt_types.IN_CHAT, 0, false);
  if (chat) {
    const ctx = context();
    if (ctx.chatMetadata && ctx.chatId) {
      ctx.chatMetadata[chatKey] = buildPresetData();
      ctx.saveMetadata();
    }
  }
  renderUI();
}
export function hasChatSettings() { return !!context().chatMetadata?.[chatKey]; }
export function clearChatSettings() {
  const ctx = context();
  if (!ctx.chatMetadata) return;
  delete ctx.chatMetadata[chatKey];
  ctx.saveMetadata();
}
export function character() {
  const ctx = context();
  return ctx.characters?.[ctx.characterId];
}
export async function saveCharacter() {
  const ctx = context();
  if (ctx.characterId == null) return false;
  await writeExtensionField(ctx.characterId, 'st_status_tracking', { version: 1, ...buildPresetData(), fields: settings.fields });
  return true;
}
function updateStatus() {
  status = parseLatestMessage(context().chat || [], settings.fields);
  log('Status updated', status);
  renderUI();
}
function hideBlocks(message) {
  $(message).find('.mes_text pre').each(function () {
    if ($(this).find('code.language-myst, code.custom-language-myst').length) $(this).hide();
  });
}
function hideAll() { $('#chat .mes').not('.user_mes').each(function () { hideBlocks(this); }); }
function hideById(id) { hideBlocks($(`#chat .mes[mesid="${id}"]`)); }
async function loadChat() {
  const ctx = context();
  if (ctx.characterId == null) return;
  log('Loading chat settings', ctx.chatId);
  const data = ctx.chatMetadata?.[chatKey];
  if (data) {
    Object.assign(settings, presetDataToSettings(data));
    changed();
    return;
  }
  const name = character()?.name || '角色';
  const displayName = character()?.name || t('角色');
  const cardPreset = settings.presets.find(p => p.id.startsWith('__fromCard_') && p.name === name);
  if (cardPreset) {
    Object.assign(settings, presetDataToSettings(cardPreset.data));
    changed();
    return;
  }
  const card = character()?.data?.extensions?.st_status_tracking;
  if (!card || settings.presets.some(p => p.id === `__declined_${ctx.characterId}`)) return;
  const answer = await new Popup(escapeHTML(t('偵測到角色「{name}」的角色卡中包含狀態追蹤設定。\n是否要載入這些設定？\n（這將覆蓋目前的欄位、Prompt、樣式等設定）')).replace('{name}', escapeHTML(displayName)).replaceAll('\n', '<br>'), POPUP_TYPE.CONFIRM).show();
  if (answer === POPUP_RESULT.AFFIRMATIVE) {
    Object.assign(settings, presetDataToSettings(card));
    const preset = createPreset(name);
    preset.id = `__fromCard_${preset.id}`;
    settings.presets.push(preset);
    toastr.success(t('已載入角色「{name}」的設定').replace('{name}', displayName), t('成功'));
  } else {
    const marker = createPreset(name);
    marker.id = `__declined_${ctx.characterId}`;
    settings.presets.push(marker);
  }
  changed();
}
$(() => {
  Promise.all(['zh-TW', 'zh-CN', 'en'].map(async lang => [lang, await fetch(new URL(`./i18n/${lang}.json`, import.meta.url)).then(r => r.json())]))
    .then(entries => {
      translations = Object.fromEntries(entries);
      initUI();
      applyCSS();
      updateStatus();
      setTimeout(hideAll, 500);
    });
  eventSource.on(event_types.GENERATION_STARTED, () => {
    log('Generation started', { enabled: settings.panel_enabled });
    const prompt = settings.panel_enabled ? generateStatusPrompt(settings.fields, settings.language, settings.fixed_fields_enabled, settings.custom_prompt) : '';
    setExtensionPrompt('status-tracking-prompt', prompt, extension_prompt_types.IN_CHAT, 0, false, extension_prompt_roles.SYSTEM);
  });
  for (const type of [event_types.MESSAGE_RECEIVED, event_types.MESSAGE_SWIPED, event_types.MESSAGE_EDITED, event_types.CHAT_CHANGED, event_types.MESSAGE_DELETED]) eventSource.on(type, updateStatus);
  eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, hideById);
  for (const type of [event_types.MESSAGE_SWIPED, event_types.MESSAGE_EDITED]) eventSource.on(type, id => setTimeout(() => hideById(id), 100));
  eventSource.on(event_types.CHAT_CHANGED, () => { setTimeout(hideAll, 100); setTimeout(loadChat, 500); });
});
