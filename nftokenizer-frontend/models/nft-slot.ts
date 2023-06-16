
/* Full state:
pub struct NftSlot {
    pub creator: Addr,
    pub connection_id: String,
    pub ica_port_id: String,
    pub ica_address: Option<Addr>,
    pub minted: bool,
    pub metadata: String,
}
 */
export type NftSlot = {
  id: string,
  creator: string,
  minted: boolean,
  assetChain: string,
  assetType: string,
  assetName: string,
}

export const nftSlotFromJson = (json: any): NftSlot => {
  const metadataSplit = json.nft_slot.metadata.split(':');
  const typeSplit = metadataSplit[0].split('_');
  const assetChain = typeSplit[0];
  const assetType = typeSplit[1];
  const assetName = metadataSplit[1];

  return {
    id: json.id,
    creator: json.nft_slot.creator,
    minted: json.nft_slot.minted,
    assetChain,
    assetType,
    assetName,
  }
}