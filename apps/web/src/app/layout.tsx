import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Truewell', template: '%s | Truewell' },
  description: 'Appointments, telehealth, prescriptions and results in one secure place.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="tw-sr-only">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
