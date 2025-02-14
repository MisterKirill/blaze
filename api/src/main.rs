#[macro_use] extern crate rocket;

use std::env;

use sqlx::postgres::PgPoolOptions;

mod routes;

#[launch]
async fn rocket() -> _ {
    dotenvy::dotenv().unwrap();

    let postgres_connection = env::var("POSTGRES_CONNECTION")
        .expect("POSTGRES_CONNECTION must be set in .env");

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(postgres_connection.as_str()).await.unwrap();

    rocket::build()
        .manage(pool)
        .mount("/", routes::register())
}
