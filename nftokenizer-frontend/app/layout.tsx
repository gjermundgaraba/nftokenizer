'use client';
import { Inter } from 'next/font/google';
import { ChainContextProvider } from "../chain-stuff/chain-context";
import Header from '../components/header';
import { ScreenResolutionContextProvider } from '../components/screen-resolution-context';
import { dogica, dogicaPixel } from '../public/fonts/dogica-font';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const metadata = {
  title: 'NFTokenizer',
  description: 'Make your NFT using Plastic Credits ',
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${dogica.variable} ${dogicaPixel.variable} ${inter.variable}`}>
        <div className='wrapper'>
          <ScreenResolutionContextProvider>
            <Header />
            <div className='root'>
              <ChainContextProvider>
                {children}
              </ChainContextProvider>
            </div>
          </ScreenResolutionContextProvider>
        </div>
      </body>
    </html>
  )
}
