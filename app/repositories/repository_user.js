class UserRepository extends require("@repository") {
    // you can defined your repository name if you want to
    // however if you dont define it, the reepo name will set to the classname
    // Below is the example of repo name
    // $name = "UserRepo";

    // Gets user data from the database
    isLoggedIn = async () => {
        return true;
    };
}

module.exports = UserRepository;
