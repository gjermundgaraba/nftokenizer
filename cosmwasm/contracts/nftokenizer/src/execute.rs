use cosmwasm_std::{DepsMut, Empty, entry_point, Env, MessageInfo, Response, to_binary, WasmMsg};
use neutron_sdk::bindings::msg::NeutronMsg;
use neutron_sdk::interchain_txs::helpers::get_port_id;

use crate::{error::ContractError, msg::ExecuteMsg};
use crate::state::{CW721_CONTRACT_ADDRESS, ICA_PORT_ID_TO_NFT_SLOT_ID, NEXT_TOKEN_ID, NFT_SLOTS, NFT_SLOTS_BY_CREATOR, NftSlot};

#[entry_point]
pub fn execute(deps: DepsMut, env: Env, info: MessageInfo, msg: ExecuteMsg) -> Result<Response<NeutronMsg>, ContractError> {
    match msg {
        ExecuteMsg::CreateSlot { connection_id, metadata } => create_slot(deps, env, info, connection_id, metadata),
        ExecuteMsg::MintNftFromSlot { nft_slot_id } => mint_nft_from_slot(deps, info, nft_slot_id),
    }
}

pub fn create_slot(deps: DepsMut, env: Env, info: MessageInfo, connection_id: String, metadata: String) -> Result<Response<NeutronMsg>, ContractError> {
    let nft_slot_id = NEXT_TOKEN_ID.load(deps.storage).unwrap();

    let interchain_account_id = format!("nftokenizer-ica-{}", nft_slot_id);
    let register_ica_msg = NeutronMsg::register_interchain_account(connection_id.clone(), interchain_account_id.clone());
    let ica_port_id = get_port_id(env.contract.address.as_str(), &interchain_account_id);

    let nft_slot = NftSlot {
        creator: info.sender.clone(),
        connection_id: connection_id.clone(),
        ica_port_id: ica_port_id.clone(),
        ica_address: None,
        minted: false,
        metadata: metadata.clone(),
    };

    // Add an incomplete entry for the new account to the storage.
    NFT_SLOTS.save(deps.storage, nft_slot_id, &nft_slot)?;
    ICA_PORT_ID_TO_NFT_SLOT_ID.save(deps.storage, ica_port_id.clone(), &nft_slot_id)?;
    NEXT_TOKEN_ID.save(deps.storage, &(nft_slot_id + 1)).unwrap();

    let mut nft_slots_by_creator = NFT_SLOTS_BY_CREATOR.may_load(deps.storage, info.sender.clone())?.unwrap_or(vec![]);
    nft_slots_by_creator.push(nft_slot_id);
    NFT_SLOTS_BY_CREATOR.save(deps.storage, info.sender.clone(), &nft_slots_by_creator)?;

    Ok(Response::new()
        .add_message(register_ica_msg)
        .add_attribute("action", "create_slot")
        .add_attribute("creator", info.sender.to_string())
        .add_attribute("nft_slot_id", nft_slot_id.to_string())
        .add_attribute("connection_id", connection_id)
        .add_attribute("ica_port_id", ica_port_id)
        .add_attribute("metadata", metadata)
    )
}

pub fn mint_nft_from_slot(deps: DepsMut, info: MessageInfo, nft_slot_id: String) -> Result<Response<NeutronMsg>, ContractError> {
    let cw721_contract_address = CW721_CONTRACT_ADDRESS.load(deps.storage).unwrap();
    let nft_slot_id_as_u64 = nft_slot_id.parse::<u64>().unwrap();

    let mut nft_slot = NFT_SLOTS.load(deps.storage, nft_slot_id_as_u64).unwrap();
    if nft_slot.creator != info.sender {
        return Err(ContractError::Unauthorized {});
    }

    // TODO: MAKE THIS A REAL URI AT SOME POINT IN THE FUTURE (MAYBE A CROSS-CHAIN QUERY TO SEE WHAT IS IN THE ICA?)
    let uri = format!("https://ipfs.io/ipfs/{}", nft_slot_id);
    let mint_msg = cw721_base::msg::ExecuteMsg::<Empty, Empty>::Mint(cw721_base::MintMsg {
        token_id: nft_slot_id.to_string(),
        token_uri: Option::from(uri),
        owner: info.sender.to_string(),
        extension: Empty::default(),
    });

    // Not checking if it has been minted already, because it will simply fail
    let mint_wasm_msg = WasmMsg::Execute {
        contract_addr: cw721_contract_address.to_string(),
        msg: to_binary(&mint_msg)?,
        funds: vec![],
    };

    // Update nft slot to reflect that it has been minted (mostly used for querying right now)
    nft_slot.minted = true;
    NFT_SLOTS.save(deps.storage, nft_slot_id_as_u64, &nft_slot)?;

    Ok(Response::new()
        .add_message(mint_wasm_msg)
        .add_attribute("action", "create_slot")
        .add_attribute("nft_slot_id", nft_slot_id.to_string())
        .add_attribute("cw721_contract_address", cw721_contract_address.to_string())
    )
}


#[cfg(test)]
mod tests {}
