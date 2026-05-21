import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

export default async function AboutPage() {
  setRequestLocale('sv-se');
  const t = await getTranslations('About');

  return (
    <main>
      <h1>{t('title')}</h1>
      <p>
        <Link href="/">{t('home')}</Link>
      </p>
    </main>
  );
}
