/**
 * Created by dana on 2/22/15.
 */
require.config({
    baseUrl: "js",
    paths: {
        angular: "../libs/angular/angular",
        angularRoute: "../libs/angular-route/angular-route"
    }
});

require (
    [
        "angular",
        "app",
        "controllers",
        "parseLayout",
        "score"
    ],
    function () {
        angular.bootstrap(document, ["DiagramLayoutManager"]);
    }
);