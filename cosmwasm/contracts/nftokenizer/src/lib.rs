use cosmwasm_std::{DepsMut, Empty, entry_point, Env, MessageInfo, Response, SubMsg, to_binary, WasmMsg};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::InstantiateMsg;
use crate::reply::INSTANTIATE_CW721_REPLY_ID;
use crate::state::{NEXT_TOKEN_ID};

pub mod error;
pub mod msg;
pub mod execute;
pub mod query;
pub mod state;
pub mod reply;
pub mod sudo;

const CONTRACT_NAME: &str = env!("CARGO_PKG_NAME");
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    let cw721_init_msg = SubMsg::<Empty>::reply_on_success(
        WasmMsg::Instantiate {
            admin: None,
            code_id: msg.cw721_code_id,
            msg: to_binary(&cw721_base::msg::InstantiateMsg {
                name: "NFTokenizer".to_string(),
                symbol: "NFTOK".to_string(),
                minter: env.contract.address.to_string(),
            })?,
            funds: vec![],
            label: "NFTokenizer NFTs".to_string(),
        },
        INSTANTIATE_CW721_REPLY_ID,
    );

    NEXT_TOKEN_ID.save(deps.storage, &1).unwrap();


    Ok(Response::new().add_submessage(cw721_init_msg))
}

#[entry_point]
pub fn migrate(_deps: DepsMut, _env: Env, _msg: Empty) -> Result<Response, ContractError> {
    // No state migrations performed, just returned a Response
    Ok(Response::default())
}

#[cfg(test)]
mod tests {
    use cosmwasm_std::coins;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};

    use super::*;

    #[test]
    fn test_initialization() {
        let mut deps = mock_dependencies();

        let info = mock_info("creator", &coins(1, "untrn"));

        let res = instantiate(deps.as_mut(), mock_env(), info.clone(), InstantiateMsg{ cw721_code_id: 1337 }).unwrap();
        assert_eq!(1, res.messages.len());

        let next_token_id = state::NEXT_TOKEN_ID.load(deps.as_ref().storage).unwrap();
        assert_eq!(next_token_id, 1);
    }
}
