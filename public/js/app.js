/**
 * Created by dana on 2/18/15.
 */
var app = angular.module("DiagramLayoutManager", [
    'ngRoute',
    'controllers'
]);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/home', {
                "templateUrl": "views/home.html"
            })
            .when('/manager', {
                "templateUrl": "views/manager.html"
            })
            .otherwise({
                "redirectTo": "/home"
            })
    }
]);