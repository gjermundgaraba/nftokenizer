'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MintingCompletedModal } from "../../components/modal";
import PixelBaseCard from "../../components/pixel-base-card";
import { PixelMintButton, PixelMintCompletedButton } from "../../components/pixel-button";
import { PixelDepositCard, PixelMintCard, PixelMintInnerCard } from "../../components/pixel-card";
import "../styles/add-asset.css";

export default function AddAsset() {
  const [assetQuantity, setQuantity] = useState(175);
  const [depositValue, setDeposit] = useState(assetQuantity);
  const [open, setOpen] = useState(false);

  const handleIncrement = () => {
    setQuantity(assetQuantity + 1)
  }

  const handleDecrement = () => {
    setQuantity(assetQuantity - 1)
  }

  const handleDepositValue = () => {
    setDeposit(assetQuantity);
  }

  const handleOpenModal = () => {
    setOpen(true);
  }

  const handleCloseModal = () => {
    setOpen(false);
  }

  return (
    <main className="pb-8">
      <div className="flex add-asset">

        <div className="pr-10 deposit-card">
          <PixelDepositCard>
            <p className="font-bold text logout">LOGOUT</p>
            <p className="description-text text-center">
              Add assets into your NFT slot
            </p>
            <div className="change-deposit-wrapper items-end">
              <button className="change-deposit-button" onClick={handleDecrement}>
                <PixelBaseCard border={false} button={true} cardSize={"small"} backgroundColor={"transparent"}>
                  <p className="minus change-value-button-text">-</p>
                </PixelBaseCard>
              </button>
              <div className="mx-11 text-center">
                <p className="currency deposit">
                  $MPWR
                </p>
                <p className="value deposit">
                  {assetQuantity}
                </p>
              </div>
              <button className="change-deposit-button" onClick={handleIncrement}>
                <PixelBaseCard border={false} button={true} cardSize={"small"} backgroundColor={"transparent"}>
                  <p className="plus change-value-button-text">+</p>
                </PixelBaseCard>
              </button>
            </div>
            <div className="flex">
              <button className="deposit-button" onClick={handleDepositValue}>
                <PixelMintButton>
                  <p className="button-text">DEPOSIT</p>
                </PixelMintButton>
              </button>
            </div>
          </PixelDepositCard>
        </div>

        <div className="right-side-card">
          <div className="relative">
            <Image src="/images/nft-slot-created.svg" width={246} height={83} alt="slot created" className="absolute -right-8 -top-10 z-10" />
          </div>
          <PixelMintCard>
            <div style={{ padding: '70px 70px 50px' }}>
              <img src="/images/empower-coin.png" alt="empower coin" style={{ width: 187 }} />
              <img src="/images/empower-logo.png" alt="empower logo" style={{ width: 188 }} />
            </div>
            <div className="lower-pixel-card">
              <PixelMintInnerCard>
                <div className="orange-card-inner">
                  <p className="currency">$MPWR</p>
                  <p className="value">{depositValue}</p>
                </div>
              </PixelMintInnerCard>
            </div>
          </PixelMintCard>
          <div className="flex">
            <button className="mint-button" onClick={handleOpenModal}>
              <PixelMintButton>
                <p className="button-text">MINT</p>
              </PixelMintButton>
            </button>
          </div>
        </div>
      </div >
      <div className="back-btn">
        <PixelBaseCard
          border={true}
          button={true}
          borderColor={"#9b9b9b"}
          cardSize={"medium"}
          backgroundColor={"#818181"}>
          <p className="button-text">
            Back
          </p>
        </PixelBaseCard>
      </div>

      <MintingCompletedModal
        open={open}
        close={handleCloseModal}>
        <div className="flex justify-center">
          <Image src="/images/metal-hand.svg" alt="hand" width={142} height={305} />
        </div>
        <div className="flex justify-between mt-20">
          <Link className="modal-btn" href="/wallet">
            <PixelMintCompletedButton>
              Home
            </PixelMintCompletedButton>
          </Link>
          <Link className="modal-btn" href="/my-nfts">
            <PixelMintCompletedButton>
              My NFTs
            </PixelMintCompletedButton>
          </Link>
        </div>
      </MintingCompletedModal>

    </main>
  )
}