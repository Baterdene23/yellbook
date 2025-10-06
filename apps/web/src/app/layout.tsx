import './global.css';

import { Crimson_Text, Playfair_Display } from 'next/font/google';

import Providers from './providers';

export const metadata = {
  title: 'Yellow pages',
  description: 'Find the best businesses in your area',
};

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const crimsonText = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-crimson',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-serif ${playfairDisplay.variable} ${crimsonText.variable}`}>
        <Providers>
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(139,69,19,0.08) 1px, transparent 0),
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(160,82,45,0.02) 2px, rgba(160,82,45,0.02) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(160,82,45,0.02) 2px, rgba(160,82,45,0.02) 4px)
          `,
              backgroundSize: '8px 8px, 32px 32px, 32px 32px',
            }}
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
