/**
 * Translations
 * @flow
 * @format
 */

import i18n from 'i18next';
import {initReactI18next, withTranslation, useTranslation} from 'react-i18next';

import dayjs from 'dayjs';
// dayjs locales
import 'dayjs/locale/en';
import 'dayjs/locale/ru';
import 'dayjs/locale/es';

import {getDeviceLanguage} from '@app/utils';
import defaultTranslations from './translations.json';

/*
 * Mapping translations in i18next resources syntax
 * Ex: { en: { translation: {...} }, ru: { translation: {...} } }
 */
function mapTranslations(translations) {
  return translations.reduce((acc, translation) => {
    if (translation.language?.IsActive) {
      acc[translation.language.language_key] = {translation};
    }
    return acc;
  }, {});
}

const initTranslation = (translations: Array<Object>) => {
  const resources = mapTranslations(translations);

  return i18n.use(initReactI18next).init({
    resources,
    lng: getDeviceLanguage(),
    fallbackLng: ['en'],
    whitelist: Object.keys(resources),
    interpolation: {
      escapeValue: false,
      format: function (value, format, language, options) {
        if (format === 'date') {
          return dayjs(value, options.inputFormat)
            .locale(language)
            .format(options.format);
        }
        return value;
      },
    },
    cleanCode: true,
  });
};

/*
 * Init translation with default translations
 * we can still init translation again with
 * latest translations which we will fetch from
 * backend but in case of not able to fetch
 * it will use default translations as source
 */
initTranslation(defaultTranslations);

const getLanguage = () => {
  return i18n.languages[0];
};

const setLanguage = (language: string) => {
  i18n.changeLanguage(language);
};

export {withTranslation, useTranslation, i18n, getLanguage, setLanguage};
