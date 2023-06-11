use cosmwasm_schema::{cw_serde, QueryResponses};
use crate::state::NftSlot;

#[cw_serde]
pub struct InstantiateMsg {
    pub cw721_code_id: u64, // 755 on Neutron testnet
}

#[cw_serde]
pub enum ExecuteMsg {
    CreateSlot {
        connection_id: String,
    },
    MintNftFromSlot {
        nft_slot_id: String,
    },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(NftokenizerContractInfoResponse)]
    NftokenizerContractInfo {},
    #[returns(NftSlotsResponse)]
    NftSlots {
        limit: Option<u64>,
        start_after: Option<u64>,
    },
    #[returns(NftSlot)]
    NftSlot {
        nft_slot_id: String,
    },
}

#[cw_serde]
pub struct NftokenizerContractInfoResponse {
    pub cw721_contract_address: String,
    pub next_token_id: u64,
}

#[cw_serde]
pub struct NftSlotWithId {
    pub id: String,
    pub nft_slot: NftSlot,
}

#[cw_serde]
pub struct NftSlotsResponse {
    pub nft_slots: Vec<NftSlotWithId>,
}