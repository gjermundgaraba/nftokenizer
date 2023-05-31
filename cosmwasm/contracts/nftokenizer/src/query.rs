use cosmwasm_std::{Binary, Deps, entry_point, Env, StdResult};

use crate::msg::QueryMsg;

pub const DEFAULT_LIMIT: u64 = 30;

#[entry_point]
pub fn query(_deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {}
}

#[cfg(test)]
mod tests {}
