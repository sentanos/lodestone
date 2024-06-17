use crate::playitgg::{
    cli_is_running, generate_signup_link, get_tunnels, start_cli, stop_cli, verify_key,
};
use axum::{
    routing::{get, post},
    Router,
};

use crate::AppState;

pub fn get_playitgg_routes(state: AppState) -> Router {
    Router::new()
        .route("/playitgg/generate_signup_link", get(generate_signup_link))
        .route("/playitgg/start_cli", post(start_cli))
        .route("/playitgg/stop_cli", post(stop_cli))
        .route("/playitgg/verify_key", post(verify_key))
        .route("/playitgg/cli_is_running", get(cli_is_running))
        .route("/playitgg/get_tunnels", get(get_tunnels))
        .with_state(state)
}
