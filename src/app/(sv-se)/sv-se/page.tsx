import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

export default async function IndexPage() {
  setRequestLocale('sv-se');
  const t = await getTranslations('Index');

  return (
    <main>
      <h1>{t('title')}</h1>
      <p>
        <Link href="/about">{t('about')}</Link>
      </p>
    </main>
  );
}
