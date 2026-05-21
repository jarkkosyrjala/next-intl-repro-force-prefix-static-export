'use client';

import {useTranslations} from 'next-intl';
import {Link, useRouter, usePathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav aria-label={t('label')}>
      <strong>{t('label')}:</strong>{' '}
      {routing.locales.map((locale) => (
        <span key={locale} style={{marginRight: 8}}>
          {/*
            BUG: With localePrefix: 'as-needed' + output: 'export',
            this <Link> renders <a href="/en/about"> when switching to the
            default locale 'en'. The static export only has /about.html,
            so the link 404s. forcePrefix is hardcoded to true whenever
            `locale` is set, with no userland opt-out.
          */}
          <Link href={pathname} locale={locale}>
            {t(locale)}
          </Link>{' '}
          {/* Same bug via the imperative router: */}
          <button
            type="button"
            onClick={() => router.push(pathname, {locale})}
          >
            push {t(locale)}
          </button>
        </span>
      ))}
    </nav>
  );
}
