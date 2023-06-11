use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Addr, DepsMut, entry_point, Env, Response, StdError, StdResult};
use neutron_sdk::sudo::msg::SudoMsg;
use crate::state::{ICA_PORT_ID_TO_NFT_SLOT_ID, NFT_SLOTS};

#[cw_serde]
struct OpenAckVersion {
    version: String,
    controller_connection_id: String,
    host_connection_id: String,
    address: String,
    encoding: String,
    tx_type: String,
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn sudo(deps: DepsMut, env: Env, msg: SudoMsg) -> StdResult<Response> {
    match msg {
        SudoMsg::OpenAck {
            port_id,
            channel_id,
            counterparty_channel_id,
            counterparty_version,
        } => sudo_open_ack(
            deps,
            env,
            port_id,
            channel_id,
            counterparty_channel_id,
            counterparty_version,
        ),
        _ => Ok(Response::default()),
    }
}

fn sudo_open_ack(
    deps: DepsMut,
    _env: Env,
    port_id: String,
    _channel_id: String,
    _counterparty_channel_id: String,
    counterparty_version: String,
) -> StdResult<Response> {
    // The version variable contains a JSON value with multiple fields,
    // including the generated account address.
    let parsed_version: Result<OpenAckVersion, _> = serde_json_wasm::from_str(counterparty_version.as_str());

    // Update the storage record associated with the interchain account.
    if let Ok(parsed_version) = parsed_version {
        let nft_id = ICA_PORT_ID_TO_NFT_SLOT_ID.load(deps.storage, port_id.clone())?;

        NFT_SLOTS.update(
            deps.storage,
            nft_id,
            |existing_slot| -> StdResult<_> {
                let mut slot = existing_slot.unwrap();
                let address = Addr::unchecked(parsed_version.address);
                slot.ica_address = Option::from(address);
                Ok(slot)
            },
        )?;
        return Ok(Response::default());
    }

    Err(StdError::generic_err("Can't parse counterparty_version"))
}