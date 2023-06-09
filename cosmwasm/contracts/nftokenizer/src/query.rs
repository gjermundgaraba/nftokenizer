use cosmwasm_std::{Binary, Deps, entry_point, Env, StdResult, to_binary};
use cw_storage_plus::Bound;

use crate::msg::{NftSlotsResponse, NftSlotWithId, QueryMsg};
use crate::state::{NFT_SLOTS, NftSlot};

pub const DEFAULT_LIMIT: u64 = 30;

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::NftSlots { limit, start_after } => to_binary(&query_nft_slots(deps, limit, start_after)?),
        QueryMsg::NftSlot { nft_slot_id } => to_binary(&query_nft_slot(deps, nft_slot_id)?)
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
        .map(|(id, nft_slot)| NftSlotWithId { id, nft_slot })
        .collect();

    Ok(NftSlotsResponse { nft_slots })
}

pub fn query_nft_slot(deps: Deps, nft_slot_id: u64) -> StdResult<NftSlotWithId> {
    let nft_slot = NFT_SLOTS.load(deps.storage, nft_slot_id)?;
    Ok(NftSlotWithId { id: nft_slot_id, nft_slot })
}

#[cfg(test)]
mod tests {}
