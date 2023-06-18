'use client'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import Menu from './menu';
import { PixelRouteButton } from './pixel-button';
import { ScreenResolutionContext } from './screen-resolution-context';

export default function Header() {
  const router = useRouter();
  const route = usePathname();
  const [openMenu, setOpenMenu] = useState(false);
  const isMobile = useContext(ScreenResolutionContext).isResolutionMobile;

  const handleOpenMenu = () => {
    setOpenMenu(true);
  }

  const handleCloseMenu = () => {
    setOpenMenu(false);
  }

  const goHome = () => {
    router.push('/');
  }

  useEffect(() => {
    if (!isMobile && openMenu) {
      setOpenMenu(false);
    }
  }, [isMobile, openMenu])

  return (
    <main>
      <div className='flex flex-col pt-5 pb-12 max-[740px]:pb-10 max-[740px]:pt-3'>
        {!isMobile &&
          <div className='flex'>
            {(route === '/my-nfts' || route === '/add-assets') && (
              <div className='mr-auto flex mb-5'>
                <Link href='/wallet'>
                  <PixelRouteButton>Home</PixelRouteButton>
                </Link>
              </div>
            )}

            {(route === '/wallet' || route === '/add-assets') && (
              <div className='ml-auto flex mb-5'>
                <Link href="/my-nfts">
                  <PixelRouteButton>My NFTs</PixelRouteButton>
                </Link>
              </div>
            )}
          </div>
        }
        <div className='flex flex-col items-center'>

          <div className='flex items-center'>
            {isMobile &&
              <button className='mr-5' onClick={handleOpenMenu}>
                <Image src="/images/hamburger-menu.svg" alt="menu" width={26} height={26} />
              </button>
            }

            <Image
              src="/images/nftokenizer-logo.svg"
              alt="nftokenizer"
              width={isMobile ? 307 : 498}
              height={isMobile ? 28 : 46}
              priority
            />
          </div>
          <p className='break-all header-text'>Make your NFT using<br />
            Plastic Credits, Eco Credits or Smart Contracts</p>
        </div>
      </div>
      <Menu open={openMenu} close={handleCloseMenu} />
    </main>
  )
}