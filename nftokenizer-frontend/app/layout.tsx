'use client';
import { Inter } from 'next/font/google'
import Header from '../components/header'
import { dogica, dogicaPixel } from '../public/fonts/dogica-font'
import './globals.css'
import {ChainContextProvider} from "../chain-stuff/chain-context";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import LoadingOverlay from "../components/loading-overlay";
import {LoadingContextProvider} from "../components/loading-context";

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
            <Header />
            <div className='root'>
                <ApolloProvider client={client}>
                  <ChainContextProvider>
                   {children}
                  </ChainContextProvider>
                </ApolloProvider>
            </div>
            <LoadingOverlay />
          </LoadingContextProvider>
        </div>
      </body>
    </html>
  )
}
