use cosmwasm_schema::cw_serde;
use cosmwasm_std::Addr;
use cw_storage_plus::{Item, Map};

#[cw_serde]
pub struct NftSlot {
    pub creator: Addr,
    pub connection_id: String,
    pub ica_port_id: String,
    pub ica_address: Option<Addr>,
    pub minted: bool,
    pub metadata: String,
}

pub const CW721_CONTRACT_ADDRESS: Item<Addr> = Item::new("cw721_contract_address");
pub const NEXT_TOKEN_ID: Item<u64> = Item::new("next_token_id");

pub const NFT_SLOTS: Map<u64, NftSlot> = Map::new("ntf_slots");
pub const ICA_PORT_ID_TO_NFT_SLOT_ID: Map<String, u64> = Map::new("ica_port_id_to_nft_id");
pub const NFT_SLOTS_BY_CREATOR: Map<Addr, Vec<u64>> = Map::new("nft_slots_by_creator");