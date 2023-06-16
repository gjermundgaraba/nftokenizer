'use client'
import {useEffect, useState} from "react";
import {useChainContext} from "../../chain-stuff/chain-context";
import {CreateNftSlotModal} from "../../components/modal";
import {PixelActionButton, PixelConfirmModalButton} from "../../components/pixel-button";
import {PixelGreenBorderCard} from "../../components/pixel-card";
import {WalletAsset} from "../../models/wallet-asset";
import {useRouter} from "next/navigation";
import {gql, useQuery} from '@apollo/client';
import {createNftSlot, getOpenNftSlots} from "../../chain-stuff/chain-service";
import {useLoadingContext} from "../../components/loading-context";
import {NftSlot} from "../../models/nft-slot";

export default function WalletConnected() {
  const loadingContext = useLoadingContext();
  const [open, setOpen] = useState(false);
  const [chosenAsset, setChosenAsset] = useState<WalletAsset | undefined>();
  const [nftSlots, setNftSlots] = useState<NftSlot[]>([]);
  const chainContext = useChainContext();
  const router = useRouter()
  const {loading, error, data} = useQuery(gql`{
      query {
      creditBalances(
      filter:{
        wallet:{
          address:{equalTo:"${chainContext.empowerAddress}"}
        }
      }){
        totalCount
        nodes{
        wallet{
            address
          }
          creditCollection{
            denom
            creditType
            creditData{
              nodes{
              mediaFiles{
                nodes{
                  name
                  url
                }
              }
                eventData{
                  nodes{
                    material{
                      nodes{
                        key
                        value
  
                      }
                    }
                  }
                }
              }
            }
          }
          amountActive
          amountRetired
        }
      }
    }
  }`);

  let walletAssets: WalletAsset[] = [];
  if (!loading && !error && data) {
    let id = 0;
    for (const credit of data.query.creditBalances.nodes) {
      walletAssets.push({assetId: id, name: credit.creditCollection.denom, numberOfAvailable: credit.amountActive});
      id++;
    }
  }

  if (!chainContext.connected) {
    router.push('/')
  }

  useEffect(() => {
    getOpenNftSlots(chainContext.neutronAddress).then((slots) => {
      console.log("getOpenNftSlots res", slots);
      setNftSlots(slots);
    });
  }, []);

  const handleOpenModal = (walletAsset: WalletAsset) => {
    setChosenAsset(walletAsset);
    setOpen(true);
  }

  const handleCloseModal = () => {
    setOpen(false);
  }

  const goToAddAssets = (slotId: string) => {
    router.push(`/add-assets/${slotId}`)
  }

  const confirmCreateNftSlot = () => {
    loadingContext.setLoading(true);
    const metadata = `empowerchain_pc:${chosenAsset?.name}`
    createNftSlot(chainContext.neutronAddress, chainContext.neutronSigner!, metadata).then((slotId) => {
      loadingContext.setLoading(false);
      console.log("createNftSlot res", slotId);
      goToAddAssets(slotId);
    }).catch((e) => {
      loadingContext.setLoading(false);
      console.log(e);
      alert(e);
    });
  }

  return (
    <div style={{width: 770}}>
      <PixelGreenBorderCard>
        <WalletConnectedHeader/>
        <div className="mt-12">
          {walletAssets.filter(walletAsset => walletAsset.numberOfAvailable > 0).map((walletAsset) => {
            return (
              <div key={walletAsset.assetId} className="flex justify-between mb-10 list-element-wrapper px-2.5">
                <div className="flex">
                  <div className="circle"></div>
                  <div className="flex items-center ml-2.5 inter-text asset-currency">
                    {walletAsset.name}
                  </div>
                </div>
                <div className="inter-text asset-currency price">{walletAsset.numberOfAvailable}</div>
                <div className="mb-1.5">
                  <button onClick={() => handleOpenModal(walletAsset)}>
                    <PixelActionButton>Make NFT</PixelActionButton>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        <NftSlotsHeader/>
        <div className="mt-12">
          {nftSlots.map((nftSlot) => {
            return (
              <div key={nftSlot.id} className="flex justify-between mb-10 list-element-wrapper px-2.5">
                <div className="flex">
                  <div className="circle"></div>
                  <div className="flex items-center ml-2.5 inter-text asset-currency">
                    {nftSlot.assetName}
                  </div>
                </div>
                <div className="mb-1.5">
                  <button onClick={() => goToAddAssets(nftSlot.id)}>
                    <PixelActionButton>Make NFT</PixelActionButton>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </PixelGreenBorderCard>
      <CreateNftSlotModal
        open={open}
        close={handleCloseModal}>
        <div className="flex flex-col items-center justify-center">
          <img src="/images/empower-coin.png" alt="empower coin" style={{width: 187, paddingBottom: 50}}/>
          <img src="/images/empower-logo.png" alt="empower logo" style={{width: 188, paddingBottom: 42}}/>

          <div className="confirm-button" onClick={confirmCreateNftSlot}>
            <PixelConfirmModalButton>Confirm</PixelConfirmModalButton>
          </div>
        </div>
      </CreateNftSlotModal>
    </div>
  )
}

export function WalletConnectedHeader() {
  return (
    <div className="flex justify-between">
      <p className="font-bold text">
        Your wallet connected
      </p>
      <p className="font-bold text logout">LOGOUT</p>
    </div>
  )
}

export function NftSlotsHeader() {
  return (
    <div className="flex justify-between" style={{marginTop: '50px'}}>
      <p className="font-bold text">
        Your open NFT slots
      </p>
    </div>
  )
}