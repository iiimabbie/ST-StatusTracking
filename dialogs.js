import { Popup, POPUP_RESULT, POPUP_TYPE } from '../../../../scripts/popup.js';
import { settings, defaultFields, createPreset, buildPresetData, presetDataToSettings, uuid } from './settings.js';
import { defaultPromptForLanguage } from './prompt.js';
import { changed, t, hasChatSettings, clearChatSettings, character, saveCharacter } from './index.js';
import { escapeHTML as esc } from './ui.js';

const confirm = async text => (await new Popup(text, POPUP_TYPE.CONFIRM).show()) === POPUP_RESULT.AFFIRMATIVE;
const button = (label, action, icon = '') => `<button type="button" class="menu_button" data-action="${action}">${icon ? `<i class="fa-solid fa-${icon}"></i> ` : ''}${esc(label)}</button>`;
const iconButton = (label, action, icon) => `<button type="button" class="menu_button menu_button_icon" data-action="${action}" title="${esc(label)}" aria-label="${esc(label)}"><i class="fa-solid fa-${icon}"></i></button>`;
const clone = value => JSON.parse(JSON.stringify(value));

export async function openFieldSettings() {
  let fields = clone(settings.fields);
  const enabled = { ...settings.fixed_fields_enabled };
  const defaults = defaultPromptForLanguage(settings.language);
  const prompts = Object.fromEntries(Object.keys(defaults).map(key => [key, settings.custom_prompt?.[key] || defaults[key]]));
  const root = document.createElement('div');
  root.innerHTML = `<h3>${esc(t('欄位設定'))}</h3><div class="field-list-wrapper"><div class="tabs-container"><div class="tab-button active" data-tab="custom">${esc(t('自訂欄位設定'))}</div><div class="tab-button" data-tab="fixed">${esc(t('固定欄位設定'))}</div></div>
    <div data-section="custom"><div class="field-list-container"><div class="field-list sortable-fields"></div><div class="field-actions">${button(t('新增欄位'), 'add', 'plus')}${button(t('恢復預設'), 'reset-fields', 'rotate-left')}</div></div></div>
    <div data-section="fixed" hidden><div class="fixed-fields-settings-container"></div><div class="prompt-actions">${button(t('恢復預設'), 'reset-prompt', 'rotate-left')}</div></div></div>`;
  const list = root.querySelector('.sortable-fields');
  const fixed = root.querySelector('.fixed-fields-settings-container');
  function renderFields() {
    list.innerHTML = [...fields].sort((a, b) => a.order - b.order).map(field => `<div class="field-item" data-id="${esc(field.id)}"><div class="drag-handle"><i class="fa-solid fa-grip-vertical"></i></div>
      <input type="checkbox" data-key="enabled" ${field.enabled ? 'checked' : ''}><input type="text" class="text_pole field_key" data-key="name" value="${esc(field.name)}" placeholder="${esc(t('欄位名稱'))}">
      <input type="text" class="text_pole field_value" data-key="description" value="${esc(field.description)}" placeholder="${esc(t('給AI的欄位說明'))}">
      <label class="field-type"><input type="radio" name="type-${esc(field.id)}" data-key="type" value="number" ${field.type === 'number' ? 'checked' : ''}> ${esc(t('數字'))}</label>
      <label class="field-type"><input type="radio" name="type-${esc(field.id)}" data-key="type" value="text" ${field.type === 'text' ? 'checked' : ''}> ${esc(t('文字'))}</label>
      ${button('', 'delete', 'trash')}</div>`).join('');
  }
  const labels = { time: '時間', place: '地點', weather: '天氣', news: '新鮮事', newsType: '新鮮事類型', newsTitle: '新鮮事標題', newsContent: '新鮮事內文', notes: '備忘錄' };
  function renderFixed() {
    const row = key => `<div class="fixed-field-item ${enabled[key] ? '' : 'disabled'}">
      <div class="${key === 'news' ? 'news-header' : 'field-row'}"><div class="field-left"><input class="field-checkbox" id="fixed-field-${key}" type="checkbox" data-fixed="${key}" ${enabled[key] ? 'checked' : ''}><label class="field-name" for="fixed-field-${key}">${esc(t(labels[key]))}</label></div>
      ${key === 'news' ? '' : `<textarea class="text_pole field-textarea" data-prompt="${key}" ${enabled[key] ? '' : 'disabled'}>${esc(prompts[key])}</textarea>`}</div>
      ${key === 'news' ? ['newsType', 'newsTitle', 'newsContent'].map(child => `<div class="news-child-row"><div class="field-left news-child-label"><label class="field-name">${esc(t(labels[child]))}</label></div><textarea class="text_pole field-textarea" data-prompt="${child}" ${enabled.news ? '' : 'disabled'}>${esc(prompts[child])}</textarea></div>`).join('') : ''}</div>`;
    fixed.innerHTML = `<div class="field-list">${['time', 'place', 'weather', 'news'].map(row).join('')}</div>${row('notes')}`;
  }
  renderFields(); renderFixed();
  root.addEventListener('click', async e => {
    const tab = e.target.closest('[data-tab]');
    if (tab) {
      root.querySelectorAll('[data-tab]').forEach(el => el.classList.toggle('active', el === tab));
      root.querySelectorAll('[data-section]').forEach(el => { el.hidden = el.dataset.section !== tab.dataset.tab; });
      return;
    }
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'add') { fields.push({ id: uuid(), enabled: true, name: '', description: '', order: fields.length, type: 'number' }); renderFields(); }
    if (action === 'delete') { fields = fields.filter(f => f.id !== e.target.closest('[data-id]').dataset.id); fields.forEach((f, i) => { f.order = i; }); renderFields(); }
    if (action === 'reset-fields' && await confirm(esc(t('確定要恢復預設欄位嗎？')))) { fields = defaultFields(settings.language); renderFields(); }
    if (action === 'reset-prompt' && await confirm(esc(t('確定要恢復預設 Prompt 嗎？')))) { Object.assign(prompts, defaults); renderFixed(); }
  });
  root.addEventListener('input', e => {
    if (e.target.dataset.prompt) prompts[e.target.dataset.prompt] = e.target.value;
    const row = e.target.closest('[data-id]');
    if (row && e.target.dataset.key) {
      const field = fields.find(f => f.id === row.dataset.id);
      field[e.target.dataset.key] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    }
  });
  root.addEventListener('change', e => {
    if (e.target.dataset.fixed) { enabled[e.target.dataset.fixed] = e.target.checked; renderFixed(); }
  });
  const popup = new Popup(root, POPUP_TYPE.TEXT, '', { wide: true, okButton: true, cancelButton: true });
  const pending = popup.show();
  $(list).sortable({ handle: '.drag-handle', update() {
    const order = [...list.children].map(row => row.dataset.id);
    fields.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    fields.forEach((field, i) => { field.order = i; });
  } });
  const result = await pending;
  $(list).sortable('destroy');
  if (result !== POPUP_RESULT.AFFIRMATIVE) return;
  const custom = {};
  for (const key of Object.keys(defaults)) if (prompts[key]?.trim() && prompts[key].trim() !== defaults[key]) custom[key] = prompts[key].trim();
  settings.fields = fields;
  settings.fixed_fields_enabled = enabled;
  settings.custom_prompt = Object.keys(custom).length ? custom : undefined;
  changed(true);
}

let selectedPresetId = '';
function download(content, type, name) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url; link.download = name; document.body.append(link); link.click(); link.remove(); URL.revokeObjectURL(url);
}
function chooseFile(accept) {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = accept;
    input.onchange = () => resolve(input.files[0] || null);
    input.oncancel = () => resolve(null);
    input.click();
  });
}
const backupKeys = { fields: 'fields', customPrompt: 'custom_prompt', fixedFieldsEnabled: 'fixed_fields_enabled', customCSS: 'custom_css', progressColorLow: 'progress_color_low', progressColorHigh: 'progress_color_high', language: 'language' };

export async function openPanelSettings() {
  const temp = {
    panel_position: settings.panel_position, language: settings.language,
    progress_color_low: settings.progress_color_low, progress_color_high: settings.progress_color_high,
    custom_css: settings.custom_css,
  };
  const root = document.createElement('div');
  root.className = 'panel-settings-container';
  root.innerHTML = `<h3 class="settings-title">${esc(t('擴充設定'))}</h3>
    <div class="setting-item gal-settings"><label class="setting-label">${esc(t('側邊欄位置'))}</label><select class="setting-select" data-temp="panel_position"><option value="left">${esc(t('左側'))}</option><option value="right">${esc(t('右側'))}</option></select></div>
    <div class="setting-item gal-settings"><label class="setting-label">${esc(t('語言'))}</label><select class="setting-select" data-temp="language"><option value="zh-TW">${esc(t('繁體中文'))}</option><option value="zh-CN">${esc(t('簡體中文'))}</option><option value="en">${esc(t('English'))}</option></select></div>
    <details class="setting-item"><summary class="progress-color-header"><span class="setting-label">${esc(t('進度條顏色'))}</span><i class="fa-solid fa-chevron-down"></i></summary><div class="progress-color-content"><div class="color-picker-group">
    ${[['progress_color_low', '低值顏色'], ['progress_color_high', '高值顏色']].map(([key, title]) => `<div class="color-picker-item"><label>${esc(t(title))}</label><input class="color-input" type="color" data-temp="${key}"><span data-color="${key}" class="color-value"></span></div>`).join('')}</div>
    <div class="progress-preview"><span class="preview-label">${esc(t('預覽'))}</span><div class="preview-bar-container"><div class="preview-bar-fill" style="width:75%"></div><span class="preview-bar-text">75</span></div></div></div></details>
    <details class="setting-item"><summary class="css-editor-header"><span class="setting-label">${esc(t('自訂 CSS'))}</span><i class="fa-solid fa-chevron-down"></i></summary><div class="css-editor-content"><div class="css-editor-actions">${iconButton(t('載入範例模板'), 'template', 'lightbulb')}${iconButton(t('匯入 CSS'), 'import-css', 'file-import')}${iconButton(t('匯出 CSS'), 'export-css', 'file-export')}</div><textarea class="css-textarea" data-temp="custom_css" placeholder="${esc(t('在此輸入自訂 CSS...'))}" spellcheck="false"></textarea><div class="css-editor-tips">${esc(t('提示：編輯完成後點擊彈窗下方的「確定」按鈕即可套用樣式'))}</div></div></details>
    <div class="setting-item gal-settings"><label class="setting-label">${esc(t('切換配置'))}</label><div class="preset-select-wrapper"><select id="preset-select" class="setting-select"></select>${iconButton(t('刪除配置'), 'delete-preset', 'trash')}</div></div>
    <div class="setting-item gal-settings chat-setting" ${hasChatSettings() ? '' : 'hidden'}><label class="setting-label">${esc(t('聊天窗設定'))}</label><div class="preset-select-wrapper"><span class="bound-preset-name">${esc(t('此聊天窗有自訂設定'))}</span>${iconButton(t('重置為角色卡配置'), 'reset-card', 'rotate-left')}</div></div>
    <div class="setting-item gal-settings"><label class="setting-label">${esc(t('配置管理'))}</label><div class="preset-select-wrapper"><input class="setting-select text_pole" data-preset-name placeholder="${esc(t('輸入配置名稱...'))}">${iconButton(t('儲存'), 'save-preset', 'save')}${iconButton(t('儲存為新配置'), 'new-preset', 'plus')}</div></div>
    <div class="setting-item backup-settings"><div class="backup-header"><label class="setting-label">${esc(t('備份還原與儲存'))}</label><div class="backup-actions">${button(t('匯入所有設定'), 'import', 'file-import')}${button(t('匯出所有設定'), 'export', 'file-export')}${button(t('儲存到角色卡'), 'save-card', 'id-card')}</div></div><div class="backup-description">${esc(t('匯出所有設定（包含固定欄位、自訂欄位、Prompt、樣式等）'))}</div></div>`;
  const select = root.querySelector('#preset-select');
  function renderSelect() {
    const card = settings.presets.filter(p => p.id.startsWith('__fromCard_'));
    const manual = settings.presets.filter(p => !p.id.startsWith('__fromCard_') && !p.id.startsWith('__declined_'));
    if (!settings.presets.some(p => p.id === selectedPresetId)) selectedPresetId = '';
    const group = (name, list) => list.length ? `<optgroup label="${esc(t(name))}">${list.map(p => `<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('')}</optgroup>` : '';
    select.innerHTML = `<option value="">${esc(t('選擇配置...'))}</option>${group('角色卡配置', card)}${group('已儲存配置', manual)}`;
    select.value = selectedPresetId;
    root.querySelector('[data-action="delete-preset"]').disabled = !selectedPresetId;
  }
  function syncTemp() {
    root.querySelectorAll('[data-temp]').forEach(el => { el.value = temp[el.dataset.temp]; });
    for (const key of ['progress_color_low', 'progress_color_high']) root.querySelector(`[data-color="${key}"]`).textContent = temp[key];
    const preview = root.querySelector('.preview-bar-container');
    preview.style.setProperty('--progress-low-color', temp.progress_color_low);
    preview.style.setProperty('--progress-high-color', temp.progress_color_high);
  }
  function syncFromSettings() {
    for (const key of Object.keys(temp)) temp[key] = settings[key];
    syncTemp();
  }
  function presetSnapshot() { return buildPresetData({ ...settings, ...temp }); }
  renderSelect(); syncTemp();
  root.addEventListener('input', e => {
    if (!e.target.dataset.temp) return;
    temp[e.target.dataset.temp] = e.target.value;
    if (e.target.type === 'color') {
      root.querySelector(`[data-color="${e.target.dataset.temp}"]`).textContent = e.target.value;
      root.querySelector('.preview-bar-container').style.setProperty(e.target.dataset.temp === 'progress_color_low' ? '--progress-low-color' : '--progress-high-color', e.target.value);
    }
  });
  root.addEventListener('change', async e => {
    if (e.target.dataset.temp) temp[e.target.dataset.temp] = e.target.value;
    if (e.target !== select) return;
    const previous = selectedPresetId;
    const preset = settings.presets.find(p => p.id === select.value);
    if (!preset) { selectedPresetId = ''; renderSelect(); return; }
    if (!await confirm(`${esc(t('確定要切換到配置'))}「${esc(preset.name)}」${esc(t('嗎？'))}<br>${esc(t('這將覆蓋目前的欄位、Prompt、樣式等設定。'))}`)) { select.value = previous; return; }
    selectedPresetId = preset.id;
    Object.assign(settings, presetDataToSettings(preset.data));
    syncFromSettings(); changed(true); renderSelect();
    toastr.success(`${t('已切換到配置')}「${preset.name}」`, t('成功'));
  });
  root.addEventListener('click', async e => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    const current = settings.presets.find(p => p.id === selectedPresetId);
    const input = root.querySelector('[data-preset-name]');
    if (action === 'save-preset' || action === 'new-preset') {
      if (action === 'save-preset' && current) {
        if (!await confirm(`${esc(t('確定要覆寫此配置嗎？'))}<br>「${esc(current.name)}」`)) return;
        current.data = presetSnapshot();
      } else {
        const name = input.value.trim();
        if (!name) return;
        const preset = createPreset(name);
        preset.data = presetSnapshot();
        settings.presets.push(preset); selectedPresetId = preset.id; input.value = '';
      }
      changed(); renderSelect(); toastr.success(t('配置已儲存'), t('成功'));
    }
    if (action === 'delete-preset' && current && await confirm(`${esc(t('確定要刪除配置'))}「${esc(current.name)}」${esc(t('嗎？'))}`)) {
      settings.presets.splice(settings.presets.indexOf(current), 1); selectedPresetId = ''; changed(); renderSelect(); toastr.success(t('已刪除配置'), t('成功'));
    }
    if (action === 'reset-card') {
      const name = character()?.name || '角色';
      const displayName = character()?.name || t('角色');
      const card = settings.presets.find(p => p.id.startsWith('__fromCard_') && p.name === name);
      if (!card) { toastr.warning(t('找不到角色卡配置'), t('提示')); return; }
      if (!await confirm(`${esc(t('確定要重置為角色卡配置'))}「${esc(displayName)}」${esc(t('嗎？'))}<br>${esc(t('這將清除此聊天窗的自訂設定。'))}`)) return;
      clearChatSettings(); Object.assign(settings, presetDataToSettings(card.data)); selectedPresetId = card.id;
      syncFromSettings(); changed(); renderSelect(); root.querySelector('.chat-setting').hidden = true;
      toastr.success(t('已重置為角色卡配置'), t('成功'));
    }
    if (action === 'template' && await confirm(esc(t('載入範例模板將覆蓋當前的 CSS 內容，確定要繼續嗎？')))) {
      const { cssTemplate } = await import('./css-template.js'); temp.custom_css = cssTemplate; syncTemp(); toastr.success(t('範例模板已載入'), t('成功'));
    }
    if (action === 'export-css') {
      download(`/* Status Tracking 自訂主題 */\n/* 匯出時間: ${new Date().toLocaleString()} */\n\n${temp.custom_css}`, 'text/css', `status-tracking-theme-${new Date().toISOString().slice(0, 10)}.css`);
      toastr.success(t('CSS 已匯出'), t('成功'));
    }
    if (action === 'import-css') {
      try {
        const file = await chooseFile('.css,text/css');
        if (file) { temp.custom_css = await file.text(); syncTemp(); toastr.success(t('CSS 已匯入，請點擊「儲存」套用'), t('成功')); }
      } catch (error) { toastr.error(error.message, t('匯入失敗')); }
    }
    if (action === 'export') {
      const data = { version: '0.3.2', timestamp: Date.now(), ...buildPresetData(), fields: settings.fields, language: settings.language };
      download(JSON.stringify(data, null, 2), 'application/json', `status-tracking-backup-${new Date().toISOString().slice(0, 10)}.json`);
      toastr.success(t('備份已匯出'), t('成功'));
    }
    if (action === 'import') {
      try {
        const file = await chooseFile('.json'); if (!file) return;
        const data = JSON.parse(await file.text());
        if (!data || typeof data !== 'object') throw new Error(t('資料格式錯誤'));
        if (!await confirm(esc(t('確定要匯入此備份嗎？\n這將覆蓋目前的所有設定（欄位、Prompt、樣式等）。')).replace('\n', '<br>'))) return;
        for (const [key, target] of Object.entries(backupKeys)) if (data[key] !== undefined) settings[target] = data[key];
        syncFromSettings(); changed(true); toastr.success(t('備份已還原'), t('成功'));
      } catch (error) { toastr.error(error.message, t('匯入失敗')); }
    }
    if (action === 'save-card') {
      if (SillyTavern.getContext().characterId == null) { toastr.warning(t('請先選擇一個角色'), t('提示')); return; }
      const name = character()?.name || t('角色');
      if (!await confirm(`${esc(t('確定要將目前的設定儲存到角色卡'))}「${esc(name)}」${esc(t('嗎？'))}<br><br>${esc(t('這將把欄位、Prompt、樣式等設定寫入角色卡的擴充資料中。'))}<br>${esc(t('匯出角色卡時會一併帶走這些設定。'))}`)) return;
      try { await saveCharacter(); toastr.success(`${t('設定已儲存到角色卡')}「${name}」`, t('成功')); }
      catch (error) { console.error('[myst] save character failed', error); toastr.error(t('儲存失敗'), t('錯誤')); }
    }
  });
  const popup = new Popup(root, POPUP_TYPE.TEXT, '', { wide: true, okButton: true, cancelButton: true });
  if (await popup.show() !== POPUP_RESULT.AFFIRMATIVE) return;
  const changedChat = temp.progress_color_low !== settings.progress_color_low || temp.progress_color_high !== settings.progress_color_high || temp.custom_css !== settings.custom_css;
  Object.assign(settings, temp);
  changed(changedChat);
}
