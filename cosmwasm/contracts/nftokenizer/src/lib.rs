use cosmwasm_std::{
    entry_point, DepsMut, Env, MessageInfo, Response,
};
use crate::error::ContractError;
use crate::msg::InstantiateMsg;

pub mod error;
pub mod msg;
pub mod execute;
pub mod query;
pub mod state;

#[entry_point]
pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    Ok(Response::new())
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins};

    #[test]
    fn test_initialization() {
        let mut deps = mock_dependencies();

        let info = mock_info("creator", &coins(1, "untrn"));

        let res = instantiate(deps.as_mut(), mock_env(), info.clone(), InstantiateMsg{ }).unwrap();
        assert_eq!(0, res.messages.len());
    }
}
