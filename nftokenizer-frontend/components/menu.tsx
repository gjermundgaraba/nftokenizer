'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import "../app/styles/menu.css";
import { PixelRouteButton } from './pixel-button';


export default function Menu({ open, close }: { open: boolean, close: () => void }) {
  const router = useRouter()

  const changeRoute = (route: string) => {
    close();
    router.push(route)
  }

  if (!open) {
    return null;
  }
  return (
    <div className="menu-wrapper">
      <div className='flex justify-between flex-col items-center h-full'>
        <Image
          src="images/nftokenizer-logo.svg"
          alt="nftokenizer"
          width={307}
          height={28}
          priority
        />

        <div>
          <div className='flex mb-11'>
            <button onClick={() => changeRoute("/wallet")}>
              <PixelRouteButton>Home</PixelRouteButton>
            </button>
          </div>
          <div className='flex ' style={{ marginBottom: 85 }}>
            <button onClick={() => changeRoute("/my-nfts")}>
              <PixelRouteButton>My NFTs</PixelRouteButton>
            </button>
          </div>
          <div className='flex'>
            <Link href="/my-nfts">
              <PixelRouteButton>Logout</PixelRouteButton>
            </Link>
          </div>
        </div>
        <button onClick={close} className="back-button menu">Go back</button>
      </div>
    </div>
  )
}