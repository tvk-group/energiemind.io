export const locales = [
  "en",
  "tr",
  "de",
  "fr",
  "es",
  "it",
  "pt",
  "nl",
  "ar",
  "ru",
  "zh-cn",
  "zh-tw",
  "ja",
  "ko",
  "hi",
  "ur",
  "pl",
  "ro",
  "el",
  "sv",
  "no",
  "da",
  "fi",
  "he",
  "id",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  it: "Italiano",
  pt: "Português",
  nl: "Nederlands",
  ar: "العربية",
  ru: "Русский",
  "zh-cn": "简体中文",
  "zh-tw": "繁體中文",
  ja: "日本語",
  ko: "한국어",
  hi: "हिन्दी",
  ur: "اردو",
  pl: "Polski",
  ro: "Română",
  el: "Ελληνικά",
  sv: "Svenska",
  no: "Norsk",
  da: "Dansk",
  fi: "Suomi",
  he: "עברית",
  id: "Bahasa Indonesia",
};

export const rtlLocales: Locale[] = ["ar", "ur", "he"];

export const ogLocales: Record<Locale, string> = {
  en: "en_US",
  tr: "tr_TR",
  de: "de_DE",
  fr: "fr_FR",
  es: "es_ES",
  it: "it_IT",
  pt: "pt_PT",
  nl: "nl_NL",
  ar: "ar_SA",
  ru: "ru_RU",
  "zh-cn": "zh_CN",
  "zh-tw": "zh_TW",
  ja: "ja_JP",
  ko: "ko_KR",
  hi: "hi_IN",
  ur: "ur_PK",
  pl: "pl_PL",
  ro: "ro_RO",
  el: "el_GR",
  sv: "sv_SE",
  no: "nb_NO",
  da: "da_DK",
  fi: "fi_FI",
  he: "he_IL",
  id: "id_ID",
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export async function getDictionary(locale: Locale) {
  const dict = await import(`@/messages/${locale}.json`);
  return dict.default;
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
