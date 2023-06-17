'use client';

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Inter } from 'next/font/google';
import { ChainContextProvider } from "../chain-stuff/chain-context";
import Header from '../components/header';
import { LoadingContextProvider } from "../components/loading-context";
import LoadingOverlay from "../components/loading-overlay";
import { ScreenResolutionContextProvider } from '../components/screen-resolution-context';
import { dogica, dogicaPixel } from '../public/fonts/dogica-font';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const client = new ApolloClient({
  uri: 'https://testnet.empowerchain.io:3000',
  cache: new InMemoryCache(),
});


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
          <LoadingContextProvider>
            <ScreenResolutionContextProvider>

              <Header />
              <div className='root'>
                <ApolloProvider client={client}>
                  <ChainContextProvider>
                    {children}
                  </ChainContextProvider>
                </ApolloProvider>
              </div>
            </ScreenResolutionContextProvider>

            <LoadingOverlay />
          </LoadingContextProvider>
        </div>
      </body>
    </html>
  )
}
