/**
 * Created by dana on 2/19/15.
 */
//function myCtrl ($$scope) {
//
//    $$scope.uploadedFiles = [];
//    $$scope.data = "";
//    $$scope.getNbrOfFiles = function () {
//        return $$scope.uploadedFiles.length;
//    };
//
//    //
//    $$scope.add = function(){
//        var f = document.getElementById('file').files[0],
//            r = new FileReader();
//        r.onloadend = function(e){
//            var data = e.target.result;
//            //send you binary data via $http or $resource or do anything else with it
//        };
//        r.readAsBinaryString(f);
//    }
//}

//function MyCtrl($scope) {
//
//    $scope.files = [];
//
//    $scope.setFiles = function(element) {
//        $scope.$apply(function($scope) {
//            console.log('files:', element.files);
//            // Turn the FileList object into an Array
//            for (var i = 0; i < element.files.length; i++) {
//                $scope.files.push(element.files[i])
//            }
//            $scope.progressVisible = false
//        });
//    };
//
//    $scope.getNbrOfFiles = function () {
//        return $scope.files.length;
//    };
//}


//var myControllers = angular.module('myControllers', []);
//
//myControllers.controller('myCtrl', ['$$scope',
//    function($$scope) {
//        $$scope.uploadedFiles = [];
//        $$scope.getNbrOfFiles = function () {
//            return $$scope.uploadedFiles.length;
//        };
//
//
//        $$scope.$on("fileSelected", function (event, args) {
//            $$scope.$apply(function () {
//                //add the file object to the $scope's files collection
//                $$scope.uploadedFiles.push(args.file);
//            });
//        });
//    }
//
//]);


'use strict';

/* Controllers */

var controllers = angular.module('controllers', []);

controllers.controller('fileUploadCtrl', ['$scope',
    function($scope) {
        $scope.files = [];
        $scope.add = function(){
            var f = document.getElementById('file').files,
                i;

            for (i = 0; i < f.length; i += 1) {
                $scope.files.push(f[i].name);
            }
        };
        $scope.retFileNames = function () {
            return $scope.files;
        };
    }
]);
