use rocket::Route;

pub mod users;

pub fn register() -> Vec<Route> {
    routes![
        users::register,
    ]
}
