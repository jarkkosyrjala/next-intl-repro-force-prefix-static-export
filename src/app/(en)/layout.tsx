import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export default function EnLayout({children}: {children: React.ReactNode}) {
  setRequestLocale('en');

  return (
    <html lang="en">
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
