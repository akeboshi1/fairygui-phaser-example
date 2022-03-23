import i18next, { Callback, InitOptions } from "i18next";
import i18nextXHRBackend from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";

export function initLocales(path: string, options?: InitOptions): Promise<any> {
  return i18next
    .use(i18nextXHRBackend)
    .use(LanguageDetector)
    .init(Object.assign({
      fallbackLng: {
        "en-US": ["en"],
        "zh": ["zh-CN"],
        "default": ["en"]
      },
      load: "currentOnly",
      backend: {
        loadPath: path,
        crossDomain: true
      },
    }, options));
}

export function translate(str: string, options?: any, namespaces?: string) {
  if (!i18n.exists(str)) return str
  if (namespaces) str += `${namespaces}:`;
  return i18n.t(str, options);
}

export function isZh() {
  const lng = i18n.languages[0];
  return lng.includes("zh");
}

export const i18n = i18next;
