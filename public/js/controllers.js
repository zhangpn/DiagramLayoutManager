/**
 * Created by dana on 2/19/15.
 */

'use strict';

/* Controllers */

var controllers = angular.module('controllers', []);

controllers.controller('fileUploadCtrl', ['$scope',
    function($scope) {
        var DELETE_LAYOUT_FILE = "L",
            DELETE_WEIGHT_FILE = "W",
            DELETE_ALL = "A";

        $scope.drawBtnName = "Draw";
        $scope.scoreBtnName = "Score";
        $scope.resetBtnName = "Reset";

        $scope.layoutFiles = {};

        $scope.weightFiles = {};

        $scope.layouts = {};

        $scope.upload = function () {
            this.clearFileNumberDisplay();

            $scope.layoutNames = Object.keys($scope.layoutFiles);
            $scope.weightNames = Object.keys($scope.weightFiles);
        };

        $scope.deleteLayoutFile = function (file) {
            this.deleteFile(file, DELETE_LAYOUT_FILE);
        };

        $scope.deleteWeightFile = function (file) {
            this.deleteFile(file, DELETE_WEIGHT_FILE);
        };

        $scope.deleteFile = function (file, opt) {
            if (opt === DELETE_ALL) {
                $scope.layoutFiles = {};
                $scope.weightFiles = {};
            } else if (opt === DELETE_LAYOUT_FILE) {
                delete $scope.layoutFiles[file];
            } else if (opt === DELETE_WEIGHT_FILE) {
                delete $scope.weightFiles[file];
            }
        };

        $scope.clearAll = function () {
            $scope.filenames = [];
        };

        $scope.displayNbrOfFiles = function (elm) {
            var EXT = ".json",
                WFILE = "weight",
                LFILE = "layout",
                files = elm.files,
                input = document.getElementById("nbrFiles"),
                i,
                fname,
                counter = 0;

            this.clearFileNumberDisplay();

            for (i = 0; i < files.length; i += 1) {
                fname = files[i].name;
                if (fname.indexOf(EXT) > -1) {
                    // todo: check for duplicates
                    if (fname.indexOf(LFILE) > -1) {
                        $scope.layoutFiles[fname] = files[i];
                    } else if (fname.indexOf(WFILE) > -1) {
                        $scope.weightFiles[fname] = files[i];
                    }
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

            if (Object.keys($scope.layoutFiles).length > 0) {

                var reader = new FileReader();
                reader.onload = function(e) {
                    if (e.target && e.target.result) {
                        parsedJSONFileContent = JSON.parse(e.target.result);
                    }
                    graph = new joint.dia.Graph;
                    paper = new joint.dia.Paper({
                        el: $('#myholder'),
                        model: graph
                    });


                    $scope.layouts[Object.keys($scope.layoutFiles)[0]] = parsedJSONFileContent;
                    parseLayout(parsedJSONFileContent, graph);
                };

                reader.readAsText($scope.layoutFiles[Object.keys($scope.layoutFiles)[0]]);
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

        var propertyHolder = document.getElementById("properties");

        $scope.score = function () {
            var holder = document.getElementById("properties"),
                jsonObj;

            if (Object.keys($scope.layoutFiles).length > 0) {

                var reader = new FileReader();
                reader.onload = function(e) {
                    if (e.target && e.target.result) {
                        jsonObj = JSON.parse(e.target.result);
                    }

                    var layout = Object.keys($scope.layoutFiles)[0];

                    score(layout, jsonObj);
                };

                reader.readAsText($scope.weightFiles[Object.keys($scope.weightFiles)[0]]);
            } else {
                holder.innerHTML = "No layout file is provided!";
            }
        };
    }
]);

