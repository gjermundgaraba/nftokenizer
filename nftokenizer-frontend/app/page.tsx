import Image from "next/image";
import PixelBaseCard from "../components/pixel-base-card";
import { PixelGreenBorderCard } from "../components/pixel-card";

export default function Home() {

  return (
    <div>
      <div style={{ marginBottom: 30 }}>
        <PixelGreenBorderCard>
          <Image src="images/wallet-icon.svg"
            alt="wallet"
            width={130}
            height={130}
            priority className="m-auto" />
          <p className="font-bold text-5xl text-center mt-8">Connect Wallet</p>
        </PixelGreenBorderCard>
        <div className="mt-20">
          <PixelBaseCard button={true}
            border={true}
            borderColor={'red'}
            cardSize={'medium'}
            actionButton={false}
            routeButton={true}>
            boo
          </PixelBaseCard>
        </div>
      </div>
    </div>
  )
}