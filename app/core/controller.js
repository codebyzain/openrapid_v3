const yup = require("yup");
class Controller {
    constructor() {
        this.validate = yup;
        this.should = yup;
        // Controller can access the global variable
        this.global = require("@global");
        this.helper = require("@helper");
    }
}
module.exports = Controller;
