import './globals.css'
import { dogicaPixel, dogica } from '../../public/fonts/dogica-font'
import Header from './components/header'

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
      <body className={`${dogica.variable} ${dogicaPixel.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  )
}
