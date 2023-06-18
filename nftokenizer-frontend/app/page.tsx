'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useContext } from "react";
import { useChainContext } from "../chain-stuff/chain-context";
import { useLoadingContext } from "../components/loading-context";
import { PixelGreenBorderCard } from "../components/pixel-card";
import { ScreenResolutionContext } from "../components/screen-resolution-context";


export default function Home() {
  const loadingContext = useLoadingContext();
  const chainContext = useChainContext();
  const router = useRouter();
  const isMobile = useContext(ScreenResolutionContext).isResolutionMobile;

  const onClickConnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    if (!chainContext.isKeplrInstalled()) {
      alert("Keplr is required, please install it first");
      return;
    }

    loadingContext.setLoading(true);
    chainContext.connectWallet().then(() => {
      loadingContext.setLoading(false);
      console.log("address after connect", chainContext.neutronAddress);
      console.log(chainContext.connected);
      router.push('/wallet')
    });
  };

  return (
    <main>
      <button className="connect-wallet" onClick={onClickConnect} >
        <PixelGreenBorderCard innerPadding={isMobile ? "63px 21px 69px" : "100px 56px 120px"}>
          <Image src="images/wallet-icon.svg"
            alt="wallet"
            width={isMobile ? 77 : 130}
            height={isMobile ? 61 : 130}
            priority className="m-auto" />
          <p className="font-bold text-5xl max-[740px]:text-2xl text-center mt-8 connect-wallet-text">
            Connect Wallet
          </p>
        </PixelGreenBorderCard>
      </button>

    </main >
  )
}