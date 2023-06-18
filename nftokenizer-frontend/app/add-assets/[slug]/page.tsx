'use client'
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import { MintingCompletedModal } from "../../../components/modal";
import PixelBaseCard from "../../../components/pixel-base-card";
import { PixelMintButton, PixelMintCompletedButton } from "../../../components/pixel-button";
import { PixelDepositCard, PixelMintCard, PixelMintInnerCard } from "../../../components/pixel-card";
import "../../styles/add-asset.css";
import { useParams } from "next/navigation";
import {useLoadingContext} from "../../../components/loading-context";
import {getNftSlot, mintNftFromSlot, waitForSlotToBeReady} from "../../../chain-stuff/chain-service";
import {depositPlasticCredit, getPlasticCreditBalance} from "../../../chain-stuff/empower";
import {useChainContext} from "../../../chain-stuff/chain-context";

export default function AddAsset() {
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
      <div className="flex add-asset justify-center m-auto">

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
          </PixelDepositCard>
        </div>

        <div className="right-side-card">
          <div className="relative">
            <Image src="/images/nft-slot-created.svg" width={246} height={83} alt="slot created" className="absolute -right-8 -top-10 z-10" />
          </div>
          <PixelMintCard>
            <div style={{ padding: '70px 70px 48px' }}>
              <img src="/images/empower-coin.png" alt="empower coin" style={{ width: 187 }} />
              <img src="/images/empower-logo.png" alt="empower logo" style={{ width: 188 }} />
            </div>
            <p style={{ padding: '20px 20px', width: 300, overflow: 'auto', fontSize: '0.75em'}}>{icaAddress ? icaAddress : 'Slot still creating' }</p>
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