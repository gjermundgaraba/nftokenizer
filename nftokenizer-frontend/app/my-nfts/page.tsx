'use client'
import Image from "next/image"
import { useState } from "react"
import { PixelActionButton } from "../../components/pixel-button"
import { PixelDropdown, PixelGreenBorderCard } from "../../components/pixel-card"
import { NftAsset } from "../../models/nft"
import { WalletConnectedHeader } from "../wallet/page"

export default function WalletConnected() {
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
      <PixelGreenBorderCard>
        <WalletConnectedHeader />
        <div className="mt-12">
          {nftAssetList.map((nftAsset) => {
            return (
              <div key={nftAsset.assetId} className="flex mb-10 items-center">
                <div className="flex justify-between flex-1 list-element-wrapper px-2.5">
                  <div className="flex">
                    <div className="circle"></div>
                    <div className="flex items-center ml-2.5 inter-text asset-currency">
                      {nftAsset.name}
                    </div>
                  </div>
                  <div className="inter-text asset-currency price">{nftAsset.numberOfAvailable}</div>
                  <div className="flex items-center bg-white rounded-xl p-3">
                    <div className="inter-text mr-9 address-text break-all">{nftAsset.address}</div>
                    <Image src="images/copy-address.svg"
                      alt="copy-btn"
                      width={19}
                      height={22} />
                  </div>
                </div>
                <div className="ml-11 mb-1.5">
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
            )
          })}
        </div>
      </PixelGreenBorderCard>
    </div>
  )
}