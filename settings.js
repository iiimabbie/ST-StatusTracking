import { saveSettingsDebounced } from '../../../../script.js';
import { extension_settings } from '../../../../scripts/extensions.js';
import { DEFAULT_PROMPT_ZH_TW } from './prompt.js';

export function uuid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 3) | 8).toString(16);
  });
}

export function defaultFields() {
  return [
    { id: uuid(), enabled: true, name: '好感度', description: '<char>目前對<user>的好感度, 0-100%, 每次±不可超過0.5', order: 0, type: 'number' },
    { id: uuid(), enabled: true, name: '內心話', description: "<char>當前'正文'劇情內心第一人稱想法, 100字內", order: 1, type: 'text' },
  ];
}

const stored = extension_settings.status_tracking;
export const settings = Object.assign({
  button_selected: false, panel_enabled: false, panel_position: 'right', panel_collapsed: false,
  fields: defaultFields(), language: 'zh-TW', progress_color_low: '#d8b4a0', progress_color_high: '#a0b4d8',
  debug_mode: false, fixed_fields_enabled: { time: true, place: true, weather: true, news: true, notes: true },
  custom_css: '', presets: [],
}, stored || {});
if (!stored) settings.custom_prompt = { ...DEFAULT_PROMPT_ZH_TW };
for (const field of [...settings.fields, ...settings.presets.flatMap(p => p.data.fields)]) if (field.type === undefined) field.type = 'number';
settings.fixed_fields_enabled = Object.assign({ time: true, place: true, weather: true, news: true, notes: true }, settings.fixed_fields_enabled);
extension_settings.status_tracking = settings;

export function saveSettings() { saveSettingsDebounced(); }
export function buildPresetData(s = settings) {
  return {
    fields: s.fields.map(({ id, enabled, name, description, order, type }) => ({ id, enabled, name, description, order, type })), customPrompt: s.custom_prompt ? { ...s.custom_prompt } : undefined,
    fixedFieldsEnabled: { ...s.fixed_fields_enabled }, customCSS: s.custom_css,
    progressColorLow: s.progress_color_low, progressColorHigh: s.progress_color_high,
  };
}
export function presetDataToSettings(data) {
  return { fields: data.fields.map(field => ({ ...field })), custom_prompt: data.customPrompt && { ...data.customPrompt },
    fixed_fields_enabled: { ...data.fixedFieldsEnabled }, custom_css: data.customCSS,
    progress_color_low: data.progressColorLow, progress_color_high: data.progressColorHigh };
}
export function createPreset(name) {
  return { id: uuid(), name, createdAt: Date.now(), data: buildPresetData() };
}
