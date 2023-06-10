import { Inter } from 'next/font/google'
import Header from '../components/header'
import { dogica, dogicaPixel } from '../public/fonts/dogica-font'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
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
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${dogica.variable} ${dogicaPixel.variable} ${inter.variable}`}>
        <div className='wrapper'>
          <Header />
          <div className='root'>
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
