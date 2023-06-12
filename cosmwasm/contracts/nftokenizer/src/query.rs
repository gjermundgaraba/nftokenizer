use cosmwasm_std::{Binary, Deps, entry_point, Env, StdResult, to_binary};
use cw_storage_plus::Bound;

use crate::msg::{NftokenizerContractInfoResponse, NftSlotsResponse, NftSlotWithId, QueryMsg};
use crate::state::{CW721_CONTRACT_ADDRESS, NEXT_TOKEN_ID, NFT_SLOTS, NftSlot};

pub const DEFAULT_LIMIT: u64 = 30;

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::NftSlots { limit, start_after } => to_binary(&query_nft_slots(deps, limit, start_after)?),
        QueryMsg::NftSlot { nft_slot_id } => to_binary(&query_nft_slot(deps, nft_slot_id)?),
        QueryMsg::NftokenizerContractInfo { .. } => to_binary(&query_nftokenizer_contract_info(deps)?),
    }
}

pub fn query_nft_slots(
    deps: Deps,
    limit: Option<u64>,
    start_after: Option<u64>,
) -> StdResult<NftSlotsResponse> {
    let limit = limit.unwrap_or(DEFAULT_LIMIT);
    let start = start_after.map(Bound::exclusive);

    let nft_slots: Vec<NftSlotWithId> = NFT_SLOTS
        .range(deps.storage, start, None, cosmwasm_std::Order::Ascending)
        .take(limit as usize)
        .collect::<Result<Vec<(u64, NftSlot)>, _>>()?
        .into_iter()
        .map(|(id, nft_slot)| NftSlotWithId { id: id.to_string(), nft_slot })
        .collect();

    Ok(NftSlotsResponse { nft_slots })
}

pub fn query_nft_slot(deps: Deps, nft_slot_id: String) -> StdResult<NftSlotWithId> {
    let nft_slot_id_u64 = nft_slot_id.parse::<u64>().unwrap();
    let nft_slot = NFT_SLOTS.load(deps.storage, nft_slot_id_u64)?;
    Ok(NftSlotWithId { id: nft_slot_id, nft_slot })
}

pub fn query_nftokenizer_contract_info(deps: Deps) -> StdResult<NftokenizerContractInfoResponse> {
    let cw721_contract_address = CW721_CONTRACT_ADDRESS.load(deps.storage).unwrap();
    let next_token_id = NEXT_TOKEN_ID.load(deps.storage).unwrap();

    Ok(NftokenizerContractInfoResponse {
        cw721_contract_address: cw721_contract_address.to_string(),
        next_token_id
    })
}

#[cfg(test)]
mod tests {}
