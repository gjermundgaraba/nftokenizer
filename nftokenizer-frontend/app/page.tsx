'use client';
import Image from "next/image";
import {useRouter} from "next/navigation";
import {MouseEventHandler} from "react";
import {useChainContext} from "../chain-stuff/chain-context";
import {PixelGreenBorderCard} from "../components/pixel-card";
import {useLoadingContext} from "../components/loading-context";


export default function Home() {
  const loadingContext = useLoadingContext();
  const chainContext = useChainContext();
  const router = useRouter()

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
      </div>
    </div>
  )
}