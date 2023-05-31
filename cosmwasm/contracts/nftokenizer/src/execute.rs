use cosmwasm_std::{DepsMut, entry_point, Env, MessageInfo, Response};

use crate::{error::ContractError, msg::ExecuteMsg};

#[entry_point]
pub fn execute(_deps: DepsMut, _env: Env, _info: MessageInfo, msg: ExecuteMsg) -> Result<Response, ContractError> {
    match msg {}
}

#[cfg(test)]
mod tests {}
