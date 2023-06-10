use cosmwasm_std::{DepsMut, entry_point, Env, Reply, Response};
use cw_utils::parse_reply_instantiate_data;

use crate::error::ContractError;
use crate::state::CW721_CONTRACT_ADDRESS;

/// Submessage reply ID used for instantiating cw721 contracts.
pub(crate) const INSTANTIATE_CW721_REPLY_ID: u64 = 0;

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn reply(deps: DepsMut, _env: Env, reply: Reply) -> Result<Response, ContractError> {
    match reply.id {
        INSTANTIATE_CW721_REPLY_ID => {
            let res = parse_reply_instantiate_data(reply).unwrap();
            let cw721_addr = deps.api.addr_validate(&res.contract_address)?;

            CW721_CONTRACT_ADDRESS.save(deps.storage, &cw721_addr).unwrap();

            Ok(Response::default()
                .add_attribute("method", "instantiate_cw721_reply")
                .add_attribute("cw721_addr", cw721_addr))
        }
        _ => Err(ContractError::UnrecognisedReplyId {}),
    }
}