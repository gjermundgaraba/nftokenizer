use cosmwasm_std::{Addr, Binary, Deps, entry_point, Env, StdResult, to_binary};
use cw_storage_plus::Bound;

use crate::msg::{NftokenizerContractInfoResponse, NftSlotsResponse, NftSlotWithId, QueryMsg};
use crate::state::{CW721_CONTRACT_ADDRESS, NEXT_TOKEN_ID, NFT_SLOTS, NFT_SLOTS_BY_CREATOR, NftSlot};

pub const DEFAULT_LIMIT: u64 = 30;

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::NftSlots { limit, start_after } => to_binary(&query_nft_slots(deps, limit, start_after)?),
        QueryMsg::NftSlot { nft_slot_id } => to_binary(&query_nft_slot(deps, nft_slot_id)?),
        QueryMsg::NftokenizerContractInfo { .. } => to_binary(&query_nftokenizer_contract_info(deps)?),
        QueryMsg::NftSlotsByCreator { creator } => to_binary(&query_nft_slots_by_creator(deps, creator)?),
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

pub fn query_nft_slots_by_creator(
    deps: Deps,
    creator: String,
) -> StdResult<NftSlotsResponse> {
    let creator_addr = Addr::unchecked(creator);

    let nft_slot_ids = NFT_SLOTS_BY_CREATOR.may_load(deps.storage, creator_addr)?.unwrap_or(vec![]);
    let nft_slots = nft_slot_ids
        .into_iter()
        .map(|id| {
            let nft_slot = NFT_SLOTS.load(deps.storage, id)?;
            Ok(NftSlotWithId { id: id.to_string(), nft_slot })
        })
        .collect::<StdResult<Vec<NftSlotWithId>>>()?;

    Ok(NftSlotsResponse { nft_slots })
}

#[cfg(test)]
mod tests {
    mod query_nft_slots_by_creator_tests {
        use cosmwasm_std::Addr;
        use cosmwasm_std::testing::{mock_dependencies};
        use crate::query::query_nft_slots_by_creator;
        use crate::state::{NFT_SLOTS, NFT_SLOTS_BY_CREATOR, NftSlot};

        #[test]
        fn test_query_nft_slots_by_creator_when_empty() {
            let deps = mock_dependencies();

            let response = query_nft_slots_by_creator(deps.as_ref(), "creator".to_string()).unwrap();
            assert_eq!(response.nft_slots.len(), 0);
        }

        #[test]
        fn test_query_nft_slots_by_creator_with_results() {
            let mut deps = mock_dependencies();

            let creator_addr = Addr::unchecked("creator");
            NFT_SLOTS_BY_CREATOR.save(deps.as_mut().storage, creator_addr.clone(), &vec![42, 69, 420]).unwrap();
            NFT_SLOTS.save(deps.as_mut().storage, 42, &NftSlot {
                creator: creator_addr.clone(),
                metadata: "metadata".to_string(),
                connection_id: "connection_id".to_string(),
                ica_port_id: "ica_port_id".to_string(),
                minted: false,
                ica_address: None,
            }).unwrap();
            NFT_SLOTS.save(deps.as_mut().storage, 69, &NftSlot {
                creator: creator_addr.clone(),
                metadata: "metadata".to_string(),
                connection_id: "connection_id".to_string(),
                ica_port_id: "ica_port_id".to_string(),
                minted: false,
                ica_address: None,
            }).unwrap();
            NFT_SLOTS.save(deps.as_mut().storage, 420, &NftSlot {
                creator: creator_addr.clone(),
                metadata: "metadata".to_string(),
                connection_id: "connection_id".to_string(),
                ica_port_id: "ica_port_id".to_string(),
                minted: false,
                ica_address: None,
            }).unwrap();

            let response = query_nft_slots_by_creator(deps.as_ref(), "creator".to_string()).unwrap();
            assert_eq!(response.nft_slots.len(), 3);
            assert_eq!(response.nft_slots[0].id, "42");
            assert_eq!(response.nft_slots[1].id, "69");
            assert_eq!(response.nft_slots[2].id, "420");
        }
    }
}
