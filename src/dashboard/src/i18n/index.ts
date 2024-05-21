import en_US from './en-US';
import zh_CN from './zh-CN';

export type Locale = 'en-US' | 'zh-CN';

const messages: Record<Locale, Record<string, string>> = {
  'en-US': en_US,
  'zh-CN': zh_CN,
};

export function getMessages(locale: Locale): Record<string, string> {
  return messages[locale] || messages['en-US'];
}

export function getLocale(): Locale {
  const saved = localStorage.getItem('baas-admin-locale') as Locale | null;
  if (saved && messages[saved]) return saved;
  return navigator.language.startsWith('zh') ? 'zh-CN' : 'en-US';
}

export function setLocale(locale: Locale): void {
  localStorage.setItem('baas-admin-locale', locale);
}
