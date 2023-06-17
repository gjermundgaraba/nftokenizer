'use client'
import Link from "next/link";
import { ReactNode, useContext, useState } from "react";
import { useChainContext } from "../../chain-stuff/chain-context";
import { CreateNftSlotModal } from "../../components/modal";
import { PixelActionButton, PixelConfirmModalButton } from "../../components/pixel-button";
import { PixelGreenBorderCard } from "../../components/pixel-card";
import { ScreenResolutionContext } from "../../components/screen-resolution-context";
import { WalletAsset } from "../../models/wallet-asset";

export default function WalletConnected() {
  const isMobile = useContext(ScreenResolutionContext).isMobileResolution;

  const [open, setOpen] = useState(false);
  const chainContext = useChainContext();

  const handleOpenModal = () => {
    setOpen(true);
  }

  const handleCloseModal = () => {
    setOpen(false);
  }

  console.log('checking chain context: ', chainContext)
  const walletAssets: WalletAsset[] = [
    { assetId: 1, currency: '$MPWR', assetPrice: 250 },
    { assetId: 2, currency: '$MPWR', assetPrice: 280 },
    { assetId: 3, currency: '$MPWR', assetPrice: 400 }
  ];

  return (
    <div style={{ width: 770 }}>
      <PixelGreenBorderCard innerPadding={isMobile ? "10px" : "50px"}>
        <WalletConnectedHeader >Your wallet connected</WalletConnectedHeader>
        <div className="mt-12">
          {walletAssets.map((walletAsset) => {
            return (
              <div key={walletAsset.assetId} className="flex justify-between mb-10 list-element-wrapper px-2.5">
                <div className="circle flex-none"></div>
                <div className="flex w-full ml-2.5 max-[740px]:flex-col">
                  <div className="flex items-center inter-text asset-currency flex-1">
                    {walletAsset.currency}
                  </div>
                  <div className="inter-text asset-currency price flex-1">{walletAsset.assetPrice}</div>

                </div>
                <div className="mb-1.5">
                  <button onClick={handleOpenModal}>
                    <PixelActionButton >Make NFT</PixelActionButton>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </PixelGreenBorderCard>
      <CreateNftSlotModal
        open={open}
        close={handleCloseModal} >
        <div className="flex flex-col items-center justify-center">
          <img src="/images/empower-coin.png" alt="empower coin" style={{ width: 187, paddingBottom: 50 }} />
          <img src="/images/empower-logo.png" alt="empower logo" style={{ width: 188, paddingBottom: 42 }} />

          <Link className="confirm-button" href='/add-assets'>
            <PixelConfirmModalButton>Confirm</PixelConfirmModalButton>
          </Link>
        </div>
      </CreateNftSlotModal>
    </div>
  )
}

export function WalletConnectedHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-between">
      <p className="font-bold text" >
        {children}
      </p>
      <p className="font-bold text logout">LOGOUT</p>
    </div>
  )
}