import { settings } from './settings.js';
import { changed, currentStatus, t } from './index.js';
import { openFieldSettings, openPanelSettings } from './dialogs.js';

export function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

let drawer;
let panel;
export function initUI() {
  drawer = document.createElement('div');
  drawer.id = 'status_tracking';
  drawer.innerHTML = `<div class="status-tracking-settings"><div class="inline-drawer">
    <div class="inline-drawer-toggle inline-drawer-header"><b>${t('狀態追蹤')}</b><div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div>
    <div class="inline-drawer-content"><div class="toggles-container">
    <div class="toggle-item"><input id="status-tracking_enabled" type="checkbox" ${settings.panel_enabled ? 'checked' : ''}><label for="status-tracking_enabled">${t('啟用狀態面板')}</label></div>
    <div class="toggle-item"><input id="status-tracking_debug" type="checkbox" ${settings.debug_mode ? 'checked' : ''}><label for="status-tracking_debug">${t('Debug 模式')}</label></div></div><hr class="sysHR">
    <div class="links-container"><a href="https://github.com/iiimabbie" target="_blank" rel="noopener" class="menu_button link-button"><i class="fa-brands fa-github"></i> GitHub</a>
    <a href="https://discord.gg/pWynG3aCgs" target="_blank" rel="noopener" class="menu_button link-button"><i class="fa-brands fa-discord"></i> Discord</a></div></div></div></div>`;
  drawer.querySelector('#status-tracking_enabled').onchange = e => { settings.panel_enabled = e.target.checked; changed(); };
  drawer.querySelector('#status-tracking_debug').onchange = e => { settings.debug_mode = e.target.checked; changed(); };
  document.querySelector('#extensions_settings2').append(drawer);
  panel = document.createElement('div');
  panel.id = 'status-tracking-panel';
  document.body.append(panel);
  renderUI();
}

export function renderUI() {
  if (!panel) return;
  drawer.querySelector('.inline-drawer-header b').textContent = t('狀態追蹤');
  drawer.querySelector('label[for="status-tracking_enabled"]').textContent = t('啟用狀態面板');
  drawer.querySelector('label[for="status-tracking_debug"]').textContent = t('Debug 模式');
  panel.innerHTML = '';
  if (!settings.panel_enabled) return;
  const data = currentStatus();
  const enabled = settings.fixed_fields_enabled;
  const fields = settings.fields.filter(f => f.enabled && data && data.customFields[f.id] != null && data.customFields[f.id] !== '')
    .sort((a, b) => a.order - b.order);
  const news = data && enabled.news && (data.news.type || data.news.title || data.news.content);
  const info = data && ((enabled.time && data.date) || (enabled.place && data.location) || (enabled.weather && data.weather) || news);
  const hasStatus = info || fields.length || (data && enabled.notes && data.notes);
  const position = settings.panel_position;
  const collapsed = settings.panel_collapsed;
  const icon = (position === 'right') === collapsed ? 'left' : 'right';
  const fieldHTML = fields.map(field => {
    const value = data.customFields[field.id];
    const number = Number(typeof value === 'object' ? value.value : value);
    const display = typeof value === 'object' && 'display' in value ? value.display : value;
    const content = field.type === 'number'
      ? `<div class="progress-bar-container" style="--progress-low-color:${escapeHTML(settings.progress_color_low)};--progress-high-color:${escapeHTML(settings.progress_color_high)}"><div class="progress-bar-fill" style="width:${isNaN(number) ? 0 : Math.max(0, Math.min(100, number))}%"></div><span class="progress-text">${escapeHTML(display)}</span></div>`
      : `<span class="value-text">${escapeHTML(value)}</span>`;
    return `<div class="status-item"><span class="status-name">${escapeHTML(field.name)}</span><div class="status-value">${content}</div></div>`;
  }).join('');
  panel.innerHTML = `<div class="status-panel drawer-content ${position} ${position === 'left' ? 'fillLeft' : 'fillRight'} ${collapsed ? 'collapsed' : ''}">
    <div class="collapse-toggle ${position} ${collapsed ? 'collapsed' : ''}"><i class="fa-solid fa-chevron-${icon}"></i></div>
    <div class="panel-content"><div class="panel-header"><h3>${t('狀態追蹤')}</h3></div>
    ${!hasStatus ? `<div class="no-status-hint">${t('還沒有狀態能追蹤哦(oﾟvﾟ)ノ')}<br>${t('給AI發送一條消息叭！')}</div>` : ''}
    ${info ? `<div class="fixed-info-section"><div class="info-item">
      ${[['time', 'date', '📅'], ['place', 'location', '📍'], ['weather', 'weather', '🌤️']].map(([key, prop, emoji]) => enabled[key] && data[prop] ? `<div><span class="info-icon">${emoji}</span><span class="info-text">${escapeHTML(data[prop])}</span></div>` : '').join('')}</div>
      ${news ? `<div class="news-section"><div class="news-section2"><div class="news-header">${escapeHTML(data.news.type)}</div><div class="news-no-header"><div class="news-divider"></div><div class="news-title">${escapeHTML(data.news.title)}</div><div class="news-content">${escapeHTML(data.news.content)}</div></div></div></div>` : ''}</div>` : ''}
    ${fields.length ? `<div class="custom-fields-section"><div class="status-list">${fieldHTML}</div></div>` : ''}
    ${data && enabled.notes && data.notes ? `<div class="notes-section"><div class="notes-content"><div class="notes-header">${t('備忘錄')}</div><div class="news-divider"></div><div class="notes-text">${escapeHTML(data.notes)}</div></div></div>` : ''}
    <div class="panel-actions"><button class="menu_button field-settings"><i class="fa-solid fa-list"></i> ${t('欄位設定')}</button><button class="menu_button panel-settings"><i class="fa-solid fa-cog"></i> ${t('擴充設定')}</button></div></div></div>`;
  panel.querySelector('.collapse-toggle').onclick = () => { settings.panel_collapsed = !settings.panel_collapsed; changed(); };
  panel.querySelector('.field-settings').onclick = openFieldSettings;
  panel.querySelector('.panel-settings').onclick = openPanelSettings;
}
