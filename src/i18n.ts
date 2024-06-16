import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';


import translationEN from '../public/locales/en/app.json';
import translationFR from '../public/locales/fr/app.json';

const resources = {
    en: {
        translation: translationEN,
    },
    fr: {
        translation: translationFR,
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;