'use client'
import Image from "next/image"
import { useContext, useState } from "react"
import { PixelActionButton } from "../../components/pixel-button"
import { PixelDropdown, PixelGreenBorderCard } from "../../components/pixel-card"
import { ScreenResolutionContext } from "../../components/screen-resolution-context"
import { NftAsset } from "../../models/nft"
import { WalletConnectedHeader } from "../wallet/page"

export default function WalletConnected() {
  const isMobile = useContext(ScreenResolutionContext).isMobileResolution;

  const nftAssetList: NftAsset[] = [
    { assetId: 1, name: '$MPWR', numberOfAvailable: 300, address: '0x2446f1fd773fbb9f080e674b60c6a033c7ed7427b8b9413cf28a2a4a6da9b56c' }
  ];

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  const clickOnMenuItem1 = (item) => {
    console.log('boop')
  }
  const clickOnMenuItem2 = (item) => {
    console.log('boop2')
  }

  return (
    <div style={{ width: 1150 }}>
      <PixelGreenBorderCard innerPadding={isMobile ? "10px" : "50px"}>
        <WalletConnectedHeader >My NFTs</WalletConnectedHeader>
        <div className="mt-12">
          {nftAssetList.map((nftAsset) => {
            return (
              <div key={nftAsset.assetId} className="flex mb-10 list-element-wrapper p-2.5">

                <div className="flex justify-between flex-1 items-center max-[740px]:block">
                  <div className="flex items-center justify-between w-full max-[740px]:items-start">
                    <div className="circle flex-none"></div>
                    <div className="flex ml-2.5 max-[740px]:flex-col">
                      <div className="flex items-center inter-text asset-currency">
                        {nftAsset.name}
                      </div>
                      <div className="inter-text asset-currency price ml-14 max-[740px]:ml-0">{nftAsset.numberOfAvailable}</div>

                    </div>
                    <div className="flex items-center bg-white rounded-xl p-3 ml-6">
                      <div className="inter-text mr-9 address-text break-all">{nftAsset.address}</div>
                      <Image src="images/copy-address.svg"
                        alt="copy-btn"
                        width={19}
                        height={22} />
                    </div>
                  </div>
                  <div className="ml-11 mb-1.5 max-[740px]:justify-end max-[740px]:flex max-[740px]:ml-0 max-[740px]:mt-3.5">
                    <button onClick={handleOpen}>
                      <PixelActionButton >Action</PixelActionButton>
                    </button>
                    {open && (
                      <div className="absolute z-10 text-center" style={{ width: '130px' }}>
                        <PixelDropdown >
                          <ul className="menu">
                            <li className="menu-item py-1.5">
                              <button onClick={clickOnMenuItem1}>Menu 1</button>
                            </li>
                            <hr />
                            <li className="menu-item  py-1.5">
                              <button onClick={clickOnMenuItem2}>Menu 2</button>
                            </li>
                            <hr />
                            <li className="menu-item py-1.5">
                              <button onClick={clickOnMenuItem2}>Menu 3</button>
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