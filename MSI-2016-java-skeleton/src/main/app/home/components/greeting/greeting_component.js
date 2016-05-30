module = require('main_module');

function Controller() {
    //Controller body goes here
}
Controller.$inject = [];

var templateUrl = require('./greeting.html');
require('./greeting.scss');
module.component('greeting', {
    controller: Controller,
    templateUrl: templateUrl
});