class FeedRepository extends require("@repository") {
    // you can defined your repository name if you want to
    // however if you dont define it, the repo name will set to the classname
    // Below is the example of repo name
    // $name = "FeedRepo";

    // Gets user data from the database
    // this function represent a single repo method which goint to be consume by the controller
    getFeeds = () => {
        // access database connection
        // this.database.query()
        // this.database.table(table_name).insert({ name : "zain"}).execute() to insert data with database helper
        return [
            {
                id: 1,
                author: "Robert Downer Jr",
                post: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
            },
            {
                id: 2,
                author: "Just Thanos",
                post: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium",
            },
        ];
    };
}

module.exports = FeedRepository;
