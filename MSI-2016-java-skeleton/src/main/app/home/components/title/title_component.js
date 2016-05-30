module = require('main_module');

function Controller() {
    //Controller body goes here
}
Controller.$inject = [];

var templateUrl = require('./title.html');
module.component('msiTitle', {
    controller: Controller,
    templateUrl: templateUrl
});