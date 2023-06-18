'use client'
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useChainContext } from "../../../chain-stuff/chain-context";
import { getNftSlot, mintNftFromSlot, waitForSlotToBeReady } from "../../../chain-stuff/chain-service";
import { depositPlasticCredit, getPlasticCreditBalance } from "../../../chain-stuff/empower";
import { useLoadingContext } from "../../../components/loading-context";
import { MintingCompletedModal } from "../../../components/modal";
import PixelBaseCard from "../../../components/pixel-base-card";
import { PixelMintButton, PixelMintCompletedButton } from "../../../components/pixel-button";
import { PixelDepositCard, PixelMintCard, PixelMintInnerCard } from "../../../components/pixel-card";
import { ScreenResolutionContext } from "../../../components/screen-resolution-context";
import "../../styles/add-asset.css";

export default function AddAsset() {
  const isMobile = useContext(ScreenResolutionContext).isResolutionMobile;
  const isMediumSizeScreen = useContext(ScreenResolutionContext).isResolutionMedium;

  const params = useParams()
  const loadingContext = useLoadingContext();
  const chainContext = useChainContext();

  const [assetQuantity, setQuantity] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [depositValue, setDeposit] = useState(0);
  const [open, setOpen] = useState(false);
  const [assetName, setAssetName] = useState('');
  const [assetChain, setAssetChain] = useState('');
  const [assetType, setAssetType] = useState('');
  const [openForMint, setOpenForMint] = useState(false);
  const [icaAddress, setIcaAddress] = useState('');

  const slotId = params.slug;

  const loadItAll = async (empowerAddress: string) => {
    getNftSlot(slotId).then((nftSlot) => {
      loadingContext.setLoading(false);
      setOpenForMint(!nftSlot.minted);
      setAssetChain(nftSlot.assetChain);
      setAssetType(nftSlot.assetType);
      setAssetName(nftSlot.assetName);

      waitForSlotToBeReady(slotId).then((icaAddress) => {
        setIcaAddress(icaAddress);

        getPlasticCreditBalance(icaAddress, nftSlot.assetName).then((balance) => {
          setDeposit(balance);
        });
      });

      getPlasticCreditBalance(empowerAddress, nftSlot.assetName).then((balance) => {
        setAvailableBalance(balance);
      });
    });
  }

  useEffect(() => {
    loadingContext.setLoading(true);
    if (chainContext.connected) {
      loadItAll(chainContext.empowerAddress).catch((error) => {
        console.log(error);
        alert(error);
        loadingContext.setLoading(false);
      });
    } else {
      chainContext.connectWallet().then(walletInfo => {
        loadItAll(walletInfo.empowerAddress).catch((error) => {
          console.log(error);
          alert(error);
          loadingContext.setLoading(false);
        });
      });
    }

  }, []);

  const handleIncrement = () => {
    const newQuantity = assetQuantity + 1;
    if (newQuantity > availableBalance) {
      return;
    }

    setQuantity(newQuantity)
  }

  const handleDecrement = () => {
    const newQuantity = assetQuantity - 1;
    if (newQuantity < 0) {
      return;
    }

    setQuantity(newQuantity)
  }

  const handleDepositValue = () => {
    //setDeposit(assetQuantity);
    loadingContext.setLoading(true);
    depositPlasticCredit(chainContext.empowerAddress, chainContext.empowerSigner!, icaAddress, assetName, assetQuantity).then((result) => {
      setQuantity(0);

      const promises: Promise<any>[] = [];
      promises.push(getPlasticCreditBalance(chainContext.empowerAddress, assetName).then((balance) => {
        setAvailableBalance(balance);
      }));

      promises.push(getPlasticCreditBalance(icaAddress, assetName).then((balance) => {
        setDeposit(balance);
      }));

      return Promise.all(promises);
    }).finally(() => {
      loadingContext.setLoading(false);
    });
  }

  const handleMint = () => {
    if (!openForMint) {
      alert("Not open for mint!")
      return;
    }
    loadingContext.setLoading(true);
    mintNftFromSlot(chainContext.neutronAddress, chainContext.neutronSigner!, slotId).then(() => {
      loadingContext.setLoading(false);
      setOpen(true);
    }).catch((error) => {
      console.log(error);
      loadingContext.setLoading(false);
      alert(error);
    });
  }

  const handleOpenModal = () => {
    setOpen(true);
  }

  const handleCloseModal = () => {
    setOpen(false);
  }

  return (
    <main className="pb-8 w-full">
      <div className="add-asset m-auto">
        <div className="flex max-[1234px]:flex-col">

          <div className="pr-10 deposit-card max-[1234px]:pr-0">
            <PixelDepositCard innerPadding={isMediumSizeScreen ? "10px" : "40px 40px 25px"}>
              <div>
                <div className="max-[1234px]:flex max-[1234px]:items-baseline">
                  {!isMediumSizeScreen &&
                    <button className="flex ml-auto">
                      <p className="font-bold logout-text">LOGOUT</p>
                    </button>}

                  <p className="description-text text-center">
                    Add assets into your NFT slot
                  </p>
                  {isMediumSizeScreen &&
                    <button>
                      <p className="font-bold logout-text">LOGOUT</p>
                    </button>}

                </div>
                <div className="change-deposit-wrapper items-end">
                  <button className="change-deposit-button" onClick={handleDecrement}>
                    <PixelBaseCard border={false} button={true} cardSize={"small"} backgroundColor={"transparent"}>
                      <p className="minus change-value-button-text">-</p>
                    </PixelBaseCard>
                  </button>
                  <div className="mx-11 text-center max-[1234px]:mx-2.5">
                    <p className="currency deposit">
                      {assetName}
                    </p>
                    <p className="value deposit">
                      {assetQuantity} / {availableBalance}
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
              </div>
            </PixelDepositCard>
          </div>

          <div className="right-side-card max-[1234px]:mt-10">
            <div className="relative">
              <Image
                src="/images/nft-slot-created.svg"
                width={246}
                height={83}
                alt="slot created"
                className="absolute -right-8 max-[740px]:-right-2.5 -top-10 max-[1234px]:-top-2.5 z-10" />
            </div>
            <PixelMintCard>
              <div className="max-[1234px]:flex images-wrapper">
                <img src="/images/empower-coin.png" alt="empower coin" className="empower-coin-image" />
                <img src="/images/empower-logo.png" alt="empower logo" className="empower-logo" />
              </div>
              <p className="ica-address" >{icaAddress ? icaAddress : 'Slot still creating'}</p>
              <div className="lower-pixel-card">
                <PixelMintInnerCard>
                  <div className="orange-card-inner">
                    <p className="currency">{assetName}</p>
                    <p className="value">{depositValue}</p>
                  </div>
                </PixelMintInnerCard>
              </div>
            </PixelMintCard>
            <div className="flex">
              <button className="mint-button" onClick={handleMint}>
                <PixelMintButton>
                  <p className="button-text">MINT</p>
                </PixelMintButton>
              </button>
            </div>
          </div>

        </div>
        {!isMediumSizeScreen &&
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
        }
      </div>


      <MintingCompletedModal
        open={open}
        close={handleCloseModal}>
        <div className="flex justify-center">
          <Image src="/images/metal-hand.svg" alt="hand" width={isMobile ? 100 : 142} height={isMobile ? 214 : 305} />
        </div>
        <div className="flex justify-between mt-20 max-[740px]:flex-col max-[740px]:items-center max-[740px]:mt-8">
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