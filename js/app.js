/**
* Created by dana on 2/18/15.
*/
    
'use strict';

var angular = require('angular');
require('angular-route');

var app = angular.module('DiagramLayoutManager', ['ngRoute']);

app.controller('fileUploadCtrl', require('./controllers.js'));

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/home', {
                'templateUrl': 'views/home.html'
            })
            .when('/manage', {
                'templateUrl': 'views/manager.html'
            })
            .when('/about', {
                'templateUrl': 'views/about-us.html'
            })
            .otherwise({
                'redirectTo': '/home'
            });
    }
]);