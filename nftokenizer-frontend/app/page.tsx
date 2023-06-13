'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useEffect } from "react";
import { useChainContext } from "../chain-stuff/chain-context";
import { createNftSlot, getTokenizedNfts } from "../chain-stuff/chain-service";
import { PixelGreenBorderCard } from "../components/pixel-card";


export default function Home() {
  const chainContext = useChainContext();
  const router = useRouter()

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
    <div>
      <div style={{ marginBottom: 30 }} >
        <button onClick={onClickConnect}>
          <PixelGreenBorderCard>
            <Image src="images/wallet-icon.svg"
              alt="wallet"
              width={130}
              height={130}
              priority className="m-auto" />
            <p className="font-bold text-5xl text-center mt-8">Connect Wallet</p>
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

      </div>
    </div>
  )
}