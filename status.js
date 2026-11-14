import { yaml } from '../../../../lib.js';

export function parseMinguCodeBlock(messageText) {
  if (!messageText) return null;
  const match = messageText.match(/```myst\s*\n([\s\S]*?)```/);
  if (!match) return null;
  const content = match[1].trim().replace(/^(\s*)([^:\s]+)\s*:\s*([*:：].*)$/gm,
    (line, indent, key, value) => `${indent}${key}: "${value.trim()}"`);
  try { return yaml.parse(content); } catch { return null; }
}

export function processStatusData(raw, fields) {
  const notes = raw.notes || raw['備忘錄'] || raw['待辦事項'] || '';
  const customFields = {};
  for (const field of fields) {
    if (!field.enabled || !field.name || raw[field.name] === undefined) continue;
    const value = raw[field.name];
    if (field.type === 'number') {
      const display = String(value).trim();
      const number = Number(display.replace(/%$/, ''));
      customFields[field.id] = isNaN(number) ? value : { value: number, display };
    } else customFields[field.id] = String(value);
  }
  return {
    date: raw.time || raw['時間'] || raw.date || '',
    location: raw.place || raw['地點'] || raw.location || '',
    weather: raw.weather || raw['天氣'] || '',
    news: {
      type: raw.news?.type || raw['新鮮事']?.['類型'] || '',
      title: raw.news?.title || raw['新鮮事']?.['標題'] || '',
      content: raw.news?.content || raw['新鮮事']?.['內文'] || '',
    },
    notes: Array.isArray(notes) ? notes.map(item => `- ${String(item).trim()}`).join('\n') : String(notes),
    customFields,
  };
}

export function parseLatestMessage(chat, fields) {
  for (let i = chat.length - 1; i >= 0; i--) {
    const message = chat[i];
    if (message.is_user || message.is_system) continue;
    const raw = parseMinguCodeBlock(message.swipes?.[message.swipe_id] || message.mes);
    if (raw) return processStatusData(raw, fields);
  }
  return null;
}
