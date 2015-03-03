/**
 * Created by dana on 2/22/15.
 */
/**
 * Created by Dana Zhang on 12/8/2014.
 */



'use strict';

    var DELIM = '>',
        ID_SEPARATOR = '=:',
        TOP = 'T',
        BOTTOM = 'B',
        LEFT = 'L',
        RIGHT = 'R';

    var weights = {
        nbrOfComps: 1,
        nbrOfConns: 1,
        nbrOfOverlaps: -0.5,
        nbrOfCrossings: -1,
        nbrOfTurns: -0.5, // could be exponential
        pathLengths: -0.5
    };


    var score = function (layout, weights) {
        if (!layout || !weights) {
            return 'Invalid input!';
        }
        var properties = getPropertiesForScoring(layout);
        var finalScore = calculateFinalScore(properties, weights);
        var retObj = {
            properties: properties,
            weights: weights,
            score: finalScore
        };
        return retObj;
    };

    var scoreComponentCount = function (nbrOfComps, weight) {
        var score = nbrOfComps * weight;

        // other factors to add
        return score;
    };

//<editor-fold desc='Overlap Calculations'>
var _getOverlaps = function (coordinates) {
    var stack = [],
        list = [], // a list that contains pairs of overlapped components
        topElm,
        i,
        index;

    // iterate through each element in sorted array:
    for (i = 0; i < coordinates.length; i += 1) {
        var fields = coordinates[i].split(DELIM),
            id = fields[2],
            LorR = fields[1];

        // if it is a left end point, push it onto the stack
        if (LorR === LEFT) {
            stack.push(id);
        } else if (LorR === RIGHT) {
            // if it is a right end point, keep iterating until Left point with matching id is found
            // along the way, store visited elements in corresponding adjacency lists
            index = stack.length - 1;
            topElm = stack[index];
            while (index > -1 && topElm !== id) {

                // todo: possible optimization - just push the pair and have the intersecting function calculate the intersects
                if (topElm > id) {
                    list.push(topElm + DELIM + id);
                } else {
                    list.push(id + DELIM + topElm);
                }
                // point index to the next element
                topElm = stack[--index];
            }
        }
    }

    // now clean up the adj lists to remove duplicates

    return list;
};
    var scoreComponentOverlap = function (nbrOfOverlaps, weight) {
        var score;

        score = nbrOfOverlaps * weight;

        return score;
    };

    /**
     * Calculate the number of component overlaps
     * @param components
     */
    var calculateOverlaps = function (components) {
        var xCoordinates = [],
            yCoordinates = [],
            xList,
            yList,
            i,
            comp,
            max;

        /**
         * algorithm: convert the boxes to vertices of a graph (represented as an adjacent list), then vertex with the largest degree (-1) will correspond to
         * the number of overlaps of all the boxes
         * Steps: for x plane, store start and end points of each box tagged with its id in a list; sort the list
         * when encounter leftmost end point, enqueue it; when encounter rightmost point, dequeue the previous one, and store the vertices relationship in
         * an adjacency list.
         *
         * For instance, for boxes A, B, C where A overlaps with some left part of B which overlaps with some left part of C
         * Then, for x-point sorted list, it becomes: LA, LB, RA, LC, RB, RC
         * To find overlaps, push each Lx element in list onto a stack in order and pop stack if an Rx element is encountered, add to adjacency list the unmatched-point pair
         * take AND of x-list and y-list
         */

        // store all points in lists
        for (i = 0; i < components.length; i += 1) {
            comp = components[i];
            xCoordinates.push(comp.position.x + DELIM + LEFT + DELIM + comp.id);
            xCoordinates.push((comp.position.x + comp.size.width) + DELIM + RIGHT + DELIM + comp.id);
            yCoordinates.push(comp.position.y + DELIM + LEFT + DELIM + comp.id);
            yCoordinates.push((comp.position.y + comp.size.height) + DELIM + RIGHT + DELIM + comp.id);
        }

        // sort the lists first by end-point positions
        xCoordinates.sort();
        yCoordinates.sort();

        xList = _getOverlaps(xCoordinates);
        yList = _getOverlaps(yCoordinates);

        max = _getIntersectedVal(xList, yList);

        return max;
    };


//</editor-fold>

    var scoreComponents = function (countScore, overlapScore) {
        var score = 0;
        score = countScore + overlapScore;

        return score;
    };

    var scoreConnectionCount = function (nbrOfConns, weight) {
        var score = nbrOfConns * weight;

        return score;
    };


    /**
     * Calculate number of crossings given coordinates of one direction
     * @param coordinates - a string that can be split into 3 parts: [x/y coordinate, id, relative position to segment (L/R/T/B);
     * id is made up of 2 parts: [connection id, line segment sub id]
     * @returns {*} - adjacency list that contains all pairs of crossings for one direction
     */
    var _getCrossings = function (coordinates) {
    var stack = [],
        list = [],
        topElm,
        i,
        index;

    // iterate through each element in sorted array:
    for (i = 0; i < coordinates.length; i += 1) {
        var fields = coordinates[i].split(DELIM),
            idStr = fields[1],
            LorR = fields[2],
            idFields = idStr.split(ID_SEPARATOR),
            id = idFields[0];

        // if it is a left or top end point, push it onto the stack
        if (LorR === LEFT || LorR === TOP) {
            stack.push(idStr);
        } else if (LorR === RIGHT || LorR === BOTTOM) {
            // if it is a right or bottom end point, keep iterating until Left point with matching id is found,
            // remove it and keep going
            index = stack.length - 1;
            topElm = stack[index];
            while (index > -1 && topElm !== idStr) {
                // point index to the next element
                topElm = stack[--index];
            }
            // remove the counterpart
            stack.splice(index, 1);

        } else {
            // if LorR is undefined, aka if it's a line of the opposite plane that we are looking at,
            // go through the stack and record all segments until reaching the end
            index = stack.length - 1;
            topElm = stack[index];
            // if segments belong to the same connection, ignore it
            if (topElm) {

                var topElmConnIdFields = topElm.split(ID_SEPARATOR),
                    topElmConnId = topElmConnIdFields[0];

                while (index > -1) {
                    if (topElmConnId !== id) {

                        if (idStr > topElm) {
                            list.push(idStr + DELIM + topElm);
                        } else {
                            list.push(topElm + DELIM + idStr);
                        }
                    }
                    // point index to the next element
                    topElm = stack[--index];
                }
            }
        }
    }

    return list;
};


    var scoreConnectionCrossing = function (nbrOfCrossings, weight) {
        var score = nbrOfCrossings * weight;

        return score;
    };

    /**
     * Calculate the number of crossings, not including point-line intersections
     * @param connections
     * @returns {*}
     */
    var calculateCrossings = function (connections) {
        var nbrOfCrossings,
            i,
            j,
            pathpoints,
            xList = [],
            yList = [],
            xNodes,
            yNodes,
            isX,
            _isHorizontal,
            _push2list;

        _isHorizontal = function (point1, point2) {
            return point1.y === point2.y;
        };

        _push2list = function (isHorizontal, id, point1, point2) {
            if (isHorizontal) {
                // need to check if L/T points are smaller than R/B points because a setment could be backwards like C5_2 in the bad routing example
                if (point1.x < point2.x) {
                    xList.push(point1.x + DELIM + id + DELIM + LEFT);
                    xList.push(point2.x + DELIM + id + DELIM + RIGHT);
                } else {
                    xList.push(point2.x + DELIM + id + DELIM + LEFT);
                    xList.push(point1.x + DELIM + id + DELIM + RIGHT);
                }
                yList.push(point1.y + DELIM + id);
            } else {
                if (point1.y < point2.y) {
                    yList.push(point1.y + DELIM + id + DELIM + TOP);
                    yList.push(point2.y + DELIM + id + DELIM + BOTTOM);
                } else {
                    yList.push(point2.y + DELIM + id + DELIM + TOP);
                    yList.push(point1.y + DELIM + id + DELIM + BOTTOM);
                }
                xList.push(point1.x + DELIM + id);
            }
        };

        // add each connection's id and x coordinates to xList
        for (i = 0; i < connections.length; i += 1) {
            pathpoints = connections[i].pathPoints;
            for (j = 0; j < pathpoints.length - 1; j += 1) {
                isX = _isHorizontal(pathpoints[j], pathpoints[j + 1]);
                // first push all x coordinates and y coordinates to lists for each path segment
                _push2list(isX, connections[i].id + ID_SEPARATOR + j, pathpoints[j], pathpoints[j + 1]);
            }
        }
        // sort the lists in ascending order
        xList.sort();
        yList.sort();

        // calculate the number of crossings
        xNodes = _getCrossings(xList);
        yNodes = _getCrossings(yList);

        nbrOfCrossings = _getIntersectedVal(xNodes, yNodes);

        return nbrOfCrossings;
    };


    /**
     * For now add nbrOfTurns of each connection
     * @param connections
     */
    var calculateTurns = function (connections) {
        var i,
            pathpoints,
            turns = 0;

        for (i = 0; i < connections.length; i += 1) {
            pathpoints = connections[i].pathPoints;
            turns += pathpoints.length - 2;
        }

        return turns;
    };

    /**
     * For now add length of each connection
     * @param connections
     */
    var calculatePathLengths = function (connections) {
        var i,
            pathpoints,
            j,
            point1,
            point2,
            pathLengths = 0;

        for (i = 0; i < connections.length; i += 1) {
            pathpoints = connections[i].pathPoints;
            for (j = 0; j < pathpoints.length - 1; j += 1) {
                point1 = pathpoints[j];
                point2 = pathpoints[j + 1];
                if (point1.x === point2.x) {
                    pathLengths += Math.abs(point1.y - point2.y);
                } else if (point1.y === point2.y) {
                    pathLengths += Math.abs(point1.x - point2.x);
                } else {
                    // todo: something has gone wrong here...
                }

            }
        }

        return pathLengths;
    };

    var scoreConnections = function (countScore, crossingScore) {
        var score;
        score = countScore + crossingScore;
        return score;
    };

    Array.prototype.removeDuplicates = function () {
        var self = this,
            n = {},
            r = [],
            i;
        for (i = 0; i < self.length; i++) {
            if (!n[self[i]]) {
                n[self[i]] = true;
                r.push(self[i]);
            }
        }
        return r;
    };

    var getPropertiesForScoring = function (layout) {
        var components = layout.components,
            connections = layout.connections,
            properties = {};

        properties.nbrOfComps = components.length;
        properties.nbrOfConns = connections.length;
        properties.nbrOfOverlaps = calculateOverlaps(components);
        properties.nbrOfCrossings = calculateCrossings(connections);
        properties.nbrOfTurns = calculateTurns(connections);
        properties.pathLengths = calculatePathLengths(connections);

        return properties;
    };

    var calculateFinalScore = function (properties, weights) {
        var scores,
            compCountScore = scoreComponentCount(properties.nbrOfComps, weights.nbrOfComps),
            compOverlapScore = scoreComponentOverlap(properties.nbrOfOverlaps, weights.nbrOfOverlaps),
            compScore = scoreComponents(compCountScore, compOverlapScore),
            connCountScore = scoreConnectionCount(properties.nbrOfConns, weights.nbrOfConns),
            connCrossingScore = scoreConnectionCrossing(properties.nbrOfCrossings, weights.nbrOfCrossings),
            connTurnScore = scoreConnectionTurn(properties.nbrOfTurns, weights.nbrOfTurns),
            connPathLengthScore = scoreConnectionLength(properties.pathLengths, weights.pathLengths),
            connScore = scoreConnections(connCountScore, connCrossingScore, connTurnScore, connPathLengthScore);

        scores = {
            Final: compScore + connScore,
            Components: {
                Final: compScore,
                Categories: {
                    Count: compCountScore,
                    Overlap: compOverlapScore
                }
            },
            Connections: {
                Final: connScore,
                Categories: {
                    Count: connCountScore,
                    Crossing: connCrossingScore,
                    Turn: connTurnScore,
                    PathLength: connPathLengthScore
                }
            }
        };

        return scores;
    };

    var scoreConnectionTurn = function (nbrOfTurns, weight) {
        var score = nbrOfTurns * weight;

        return score;
    };

    var scoreConnectionLength = function (pathLengths, weight) {
        var score = pathLengths * weight;

        return score;
    };

    var _getIntersectedVal = function (xlist, ylist) {
        var intersection;

        intersection = _.intersection(xlist, ylist);

        return intersection.length;
    };

    var printFinalScore = function (finalScore) {
//    if (window && window.console) {
//
//    } else {
//
//    }
        console.log('**********Property Values***********');
        prettyPrint(properties, true);
        console.log('\n\n**********Property Weights***********');
        prettyPrint(weights, true);
        console.log('\n\n**********Final Scores***********');
        prettyPrint(finalScore, true);
    };

    var prettyPrint = function (obj, printToConsole) {
        var i,
            printString = '';
        if (Array.isArray(obj)) {

            for (i = 0; i < obj.length; i += 1) {
                if (printToConsole) {
                    console.log(obj[i]);
                } else {
                    printString += obj[i] + '\n';
                }
            }
        } else {
            printString = prettyPrintObjRec(obj, 0);

            if (printToConsole) {
                console.log(printString);
            }
        }
        return printString;
    };

    var prettyPrintObjRec = function (obj, tabs) {
        var i,
            tabsString = '',
            printString = '',
            objVal;

        for (i = 0; i < tabs; i += 1) {
            tabsString += '\t';
        }

        for (i in obj) {
            if (obj.hasOwnProperty(i)) {

                if (typeof obj[i] !== 'object' && !Array.isArray(obj[i])) {
                    objVal = obj[i];
                } else {
                    objVal = '';
                }
                printString += tabsString + i + ': ' + objVal + '\n';
                printString += prettyPrintObjRec(obj[i], tabs + 1);
            }
        }
        return printString;
    };

module.exports = score;