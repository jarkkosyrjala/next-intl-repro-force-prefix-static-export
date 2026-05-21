import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export default function SvSeLayout({children}: {children: React.ReactNode}) {
  setRequestLocale('sv-se');

  return (
    <html lang="sv-se">
      <body>
        <NextIntlClientProvider>
          <LocaleSwitcher />
          <hr />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
