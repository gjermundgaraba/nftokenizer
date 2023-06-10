import Image from "next/image";
import PixelCard from "../components/pixel-card";

export default function Home() {

  return (
    <div>
      <div style={{ marginBottom: 30 }}>
        <PixelCard greenBorder={true}>
          <Image src="images/wallet-icon.svg"
            alt="wallet"
            width={130}
            height={130}
            priority className="m-auto" />
          <p className="font-bold text-5xl text-center mt-8">Connect Wallet</p>
        </PixelCard>
      </div>
    </div>
  )
}