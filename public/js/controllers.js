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
        $scope.btnName = "Draw Diagram";
        $scope.filenames = [];
        $scope.layoutFiles = [];

        $scope.upload = function () {
            this.clearFileNumberDisplay();

            return $scope.filenames;
        };

        $scope.deleteFile = function (file) {
            var ind = $scope.filenames.indexOf(file);
            $scope.filenames.splice(ind, 1);
            $scope.layoutFiles.splice(ind, 1);
        };

        $scope.clearAll = function () {
            $scope.filenames = [];
        };

        $scope.displayNbrOfFiles = function (elm) {
            var files = elm.files,
                input = document.getElementById("nbrFiles"),
                i,
                counter = 0;

            this.clearFileNumberDisplay();

            for (i = 0; i < files.length; i += 1) {
                if (files[i].name.indexOf(".json")) {
                    $scope.filenames.push(files[i].name);
                    $scope.layoutFiles.push(files[i]);
                    ++counter;
                }
            }

            if (counter > 0) {
                input.value = counter === 1 ? counter + " file selected"
                    : counter + " files selected";
            }
        };

        $scope.clearFileNumberDisplay = function () {
            var input = document.getElementById('nbrFiles');
            input.value = "";
        };

        $scope.draw = function () {
            var holder = document.getElementById("myholder"),
                parsedJSONFileContent,
                graph,
                paper;

            if ($scope.layoutFiles.length > 0) {

                var reader = new FileReader();
                reader.onload = function(e) {
                    if (e.target && e.target.result) {
                        parsedJSONFileContent = JSON.parse(e.target.result);
                        //                holder.innerHTML = "Success!";
                    }
                    graph = new joint.dia.Graph;
                    paper = new joint.dia.Paper({
                        el: $('#myholder'),
                        model: graph
                    });

                    parseLayout(parsedJSONFileContent, graph);
                };

                reader.readAsText($scope.layoutFiles[$scope.layoutFiles.length - 1]);
            } else {
                holder.innerHTML = "No layout file is provided!";
            }
        };

        var dropbox = document.getElementById("upload-drop-zone"),
            dropText = 'Drop files here...',
            invalidClass = 'invalid';

        $scope.dropText = dropText;

        // init event handlers
        function dragEnterLeave(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            $scope.$apply(function () {
                $scope.dropText = dropText;
                $scope.dropClass = ''
            })
        }


        dropbox.addEventListener("dragenter", dragEnterLeave, false);
        dropbox.addEventListener("dragleave", dragEnterLeave, false);

        dropbox.addEventListener("dragover", function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var ok = evt.dataTransfer && evt.dataTransfer.types && evt.dataTransfer.types.indexOf('Files') >= 0;
            $scope.$apply(function () {
                $scope.dropText = ok ? dropText : 'Only files are allowed!';
                $scope.dropClass = ok ? 'over' : invalidClass;
            })
        }, false);

        dropbox.addEventListener("drop", function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            $scope.$apply(function () {
                $scope.dropText = dropText;
                $scope.dropClass = '';
            });

            var files = evt.dataTransfer.files;
            if (files.length > 0) {
                $scope.$apply(function () {
                    for (var i = 0; i < files.length; i++) {
                        if (files[i].name.indexOf(".json") > -1) {
                            $scope.filenames.push(files[i].name);
                            $scope.layoutFiles.push(files[i]);
                        } else {
                            $scope.dropText = 'Only json files are allowed!';
                            $scope.dropClass = invalidClass;
                        }
                    }
                })
            }

        });

    }
]);

