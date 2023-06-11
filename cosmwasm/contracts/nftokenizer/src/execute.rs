use cosmwasm_std::{DepsMut, Empty, entry_point, Env, MessageInfo, Response, to_binary, WasmMsg};
use neutron_sdk::bindings::msg::NeutronMsg;
use neutron_sdk::interchain_txs::helpers::get_port_id;

use crate::{error::ContractError, msg::ExecuteMsg};
use crate::state::{CW721_CONTRACT_ADDRESS, ICA_PORT_ID_TO_NFT_SLOT_ID, NEXT_TOKEN_ID, NFT_SLOTS, NftSlot};

#[entry_point]
pub fn execute(deps: DepsMut, env: Env, info: MessageInfo, msg: ExecuteMsg) -> Result<Response<NeutronMsg>, ContractError> {
    match msg {
        ExecuteMsg::CreateSlot { connection_id } => create_slot(deps, env, connection_id),
        ExecuteMsg::MintNftFromSlot { nft_slot_id } => mint_nft_from_slot(deps, info, nft_slot_id),
    }
}

pub fn create_slot(deps: DepsMut, env: Env, connection_id: String) -> Result<Response<NeutronMsg>, ContractError> {
    let nft_slot_id = NEXT_TOKEN_ID.load(deps.storage).unwrap();

    let interchain_account_id = format!("nftokenizer-ica-{}", nft_slot_id);
    let register_ica_msg = NeutronMsg::register_interchain_account(connection_id.clone(), interchain_account_id.clone());
    let ica_port_id = get_port_id(env.contract.address.as_str(), &interchain_account_id);

    let nft_slot = NftSlot{
        connection_id: connection_id.clone(),
        ica_port_id: ica_port_id.clone(),
        ica_address: None,
    };

    // Add an incomplete entry for the new account to the storage.
    NFT_SLOTS.save(deps.storage, nft_slot_id, &nft_slot)?;
    ICA_PORT_ID_TO_NFT_SLOT_ID.save(deps.storage, ica_port_id.clone(), &nft_slot_id)?;
    NEXT_TOKEN_ID.save(deps.storage, &(nft_slot_id + 1)).unwrap();

    Ok(Response::new()
        .add_message(register_ica_msg)
        .add_attribute("action", "create_slot")
        .add_attribute("nft_slot_id", nft_slot_id.to_string())
        .add_attribute("connection_id", connection_id)
        .add_attribute("ica_port_id", ica_port_id)
    )
}

pub fn mint_nft_from_slot(deps: DepsMut, info: MessageInfo, nft_slot_id: u64) -> Result<Response<NeutronMsg>, ContractError> {
    // TODO: CHECK THAT IT HASN'T BEEN MINTED YET
    // TODO: Query the CW721 contract for the owner of the token (maybe?)

    let cw721_contract_address = CW721_CONTRACT_ADDRESS.load(deps.storage).unwrap();

    let uri = format!("https://ipfs.io/ipfs/{}", nft_slot_id); // TODO: MAKE PROPER
    let mint_msg = cw721_base::msg::ExecuteMsg::<Empty, Empty>::Mint(cw721_base::MintMsg {
        token_id: nft_slot_id.to_string(),
        token_uri: Option::from(uri),
        owner: info.sender.to_string(),
        extension: Empty::default(),
    });

    let mint_wasm_msg = WasmMsg::Execute {
        contract_addr: cw721_contract_address.to_string(),
        msg: to_binary(&mint_msg)?,
        funds: vec![],
    };

    Ok(Response::new()
        .add_message(mint_wasm_msg)
        .add_attribute("action", "create_slot")
        .add_attribute("nft_token_id", nft_slot_id.to_string())
    )
}


#[cfg(test)]
mod tests {}
