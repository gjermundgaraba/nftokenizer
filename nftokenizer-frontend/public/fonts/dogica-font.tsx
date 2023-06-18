import localFont from "@next/font/local";

export const dogica = localFont({
  src: [
    {
      path: '../../public/fonts/dogica.ttf',
      weight: '400'
    },
    {
      path: '../../public/fonts/dogicabold.ttf',
      weight: '700'
    },
    {
      path: '../../public/fonts/dogica.otf',
      weight: '400'
    },
    {
      path: '../../public/fonts/dogicabold.otf',
      weight: '700'
    },
  ],
  variable: '--font-dogica'
})

export const dogicaPixel = localFont({
  src: [
    {
      path: '../../public/fonts/dogicapixel.ttf',
      weight: '400'
    },
    {
      path: '../../public/fonts/dogicapixelbold.ttf',
      weight: '700'
    },
    {
      path: '../../public/fonts/dogicapixel.otf',
      weight: '400'
    },
    {
      path: '../../public/fonts/dogicapixelbold.otf',
      weight: '700'
    },
  ],
  variable: '--font-dogica-pixel'
})


