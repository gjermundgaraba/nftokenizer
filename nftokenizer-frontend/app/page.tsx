'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useContext, useEffect } from "react";
import { useChainContext } from "../chain-stuff/chain-context";
import { createNftSlot, getTokenizedNfts } from "../chain-stuff/chain-service";
import { PixelGreenBorderCard } from "../components/pixel-card";
import { ScreenResolutionContext } from "../components/screen-resolution-context";


export default function Home() {
  const chainContext = useChainContext();
  const router = useRouter();
  const isMobile = useContext(ScreenResolutionContext).isMobileResolution;

  useEffect(() => {
    if (chainContext.connected) {
      getTokenizedNfts(chainContext.address).catch((e) => {
        console.log(e);
      });

      createNftSlot(chainContext.address, chainContext.signer!).then((res) => {
        console.log("createNftSlot res", res);
      }).catch((e) => {
        console.log(e);
      });
    }
  });

  const onClickConnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    if (!chainContext.isKeplrInstalled()) {
      alert("Keplr is required, please install it first");
      return;
    }

    await chainContext.connectWallet();
    console.log("address after connect", chainContext.address);
    console.log(chainContext.connected);
    router.push('/wallet')
    // TODO: We are connected, so can go to next screen
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
      <div className="mt-20">
        Example, remove later<br />
        {chainContext.connected ? (
          <>
            connected
            <br />
            {chainContext.address}
          </>
        ) : "not connected"}
      </div>

    </main >
  )
}