'use client'
import Image from "next/image"
import { useContext, useEffect, useState } from "react"
import { useChainContext } from "../../chain-stuff/chain-context"
import { getNftSlot, getTokenizedNfts } from "../../chain-stuff/chain-service"
import { useLoadingContext } from "../../components/loading-context"
import { PixelActionButton } from "../../components/pixel-button"
import { PixelDropdown, PixelGreenBorderCard } from "../../components/pixel-card"
import { ScreenResolutionContext } from "../../components/screen-resolution-context"
import { WalletConnectedHeader } from "../../components/wallet-connected-header"
import { NftAsset } from "../../models/nft"
import {NftSlot} from "../../models/nft-slot";

export default function WalletConnected() {
  const isMobile = useContext(ScreenResolutionContext).isResolutionMobile;

  const loadingContext = useLoadingContext();
  const chainContext = useChainContext();
  const [openIndex, setOpenIndex] = useState(-1);
  const [nftAssets, setNftAssets] = useState<NftAsset[]>([]);

  const handleOpen = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(-1);
      return;
    }

    setOpenIndex(index);
  };

  const loadItAll = async (neutronAddress: string) => {
    const nftIds = await getTokenizedNfts(neutronAddress);
    const nftSlots: NftSlot[] = [];
    for (let i = 0; i < nftIds.length; i++) {
      const nftSlot = await getNftSlot(nftIds[i]);
      nftSlots.push(nftSlot);
    }

    setNftAssets(nftSlots.map(nftSlot => new NftAsset(nftSlot.id, nftSlot.assetName, 0, nftSlot.icaAddress!)));
  }

  useEffect(() => {
    loadingContext.setLoading(true);
    console.log("using effect");
    if (chainContext.connected) {
      loadItAll(chainContext.neutronAddress).catch((error) => {
        console.log(error);
        alert(error);
      }).finally(() => {
        loadingContext.setLoading(false);
      });
    } else {
      chainContext.connectWallet().then(walletInfo => {
        return loadItAll(walletInfo.neutronAddress).catch((error) => {
          console.log(error);
          alert(error);
        });
      }).finally(() => {
        loadingContext.setLoading(false);
      });
    }

  }, []);

  const handleAddressCopyClick = (address: string) => {
    navigator.clipboard.writeText(address).then(() => {
      alert("ICA address copied to clipboard");
    }).catch((error) => {
      alert("Error copying address to clipboard: " + error);
    });
  }

  const handleTransferClick = (nftAsset: NftAsset) => {
    alert("Not implemented yet");
  }
  const handleListClick = (nftAsset: NftAsset) => {
    alert("Not implemented yet");
  }

  const handleRedeemClick = (nftAsset: NftAsset) => {
    alert("Not implemented yet");
  }

  return (
    <div style={{ width: 1150 }}>
      <PixelGreenBorderCard innerPadding={isMobile ? "10px" : "50px"}>
        <WalletConnectedHeader >My NFTs</WalletConnectedHeader>
        <div className="mt-12">
          {nftAssets.map((nftAsset, index) => {
            return (
              <div key={nftAsset.assetId} className="flex mb-10 list-element-wrapper p-2.5">

                <div className="flex justify-between flex-1 items-center max-[740px]:block">
                  <div className="flex items-center justify-between w-full max-[740px]:items-start">
                    <div className="circle flex-none"></div>
                    <div className="flex ml-2.5 max-[740px]:flex-col">
                      <div className="flex items-center inter-text asset-currency">
                        {nftAsset.assetId}
                      </div>
                      <div className="inter-text asset-currency price ml-14 max-[740px]:ml-0">{nftAsset.name}</div>
                    </div>
                    <div className="flex items-center bg-white rounded-xl p-3 ml-6">
                      <div className="inter-text mr-9 address-text break-all" style={{ fontSize: "0.7em" }}>{nftAsset.address}</div>
                      <Image src="images/copy-address.svg"
                        onClick={() => handleAddressCopyClick(nftAsset.address)}
                        alt="copy-btn"
                        width={19}
                        height={22} />
                    </div>
                  </div>
                  <div className="ml-11 mb-1.5 max-[740px]:justify-end max-[740px]:flex max-[740px]:ml-0 max-[740px]:mt-3.5">
                    <button onClick={() => handleOpen(index)}>
                      <PixelActionButton >Action</PixelActionButton>
                    </button>
                    {openIndex === index && (
                      <div className="absolute z-10 text-center" style={{ width: '130px' }}>
                        <PixelDropdown >
                          <ul className="menu">
                            <li className="menu-item py-1.5">
                              <button onClick={() => handleTransferClick(nftAsset)}>Transfer</button>
                            </li>
                            <hr />
                            <li className="menu-item  py-1.5">
                              <button onClick={() => handleListClick(nftAsset)}>List</button>
                            </li>
                            <hr />
                            <li className="menu-item py-1.5">
                              <button onClick={() => handleRedeemClick(nftAsset)}>Redeem</button>
                            </li>
                          </ul>

                        </PixelDropdown>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      </PixelGreenBorderCard>
    </div>
  )
}