import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'sv-se'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeCookie: false
});
