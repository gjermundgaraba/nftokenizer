'use client'
import Image from 'next/image';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import { PixelRouteButton } from './pixel-button';
import {CSSProperties} from "react";

export default function Header() {
  const router = useRouter();
  const route = usePathname();
  console.log(route);
  const descriptionText: CSSProperties = {
    fontWeight: '700',
    fontSize: '17px',
    lineHeight: '29px',
    textAlign: 'center',
    width: '100%',
    marginTop: '23px'
  }

  const goHome = () => {
    router.push('/');
  }

  return (
    <div className='flex flex-col' style={{ paddingTop: '20px', paddingBottom: '50px' }}>
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
      <div className='flex flex-col items-center' style={{cursor: 'pointer'}} onClick={goHome}>
        <Image
          src="/images/nftokenizer-logo.svg"
          alt="nftokenizer"
          width={498}
          height={46}
          priority
        />
        <p style={descriptionText} className='break-all'>Make your NFT using<br />
          Plastic Credits, Eco Credits or Smart Contracts</p>
      </div>
    </div>
  )
}