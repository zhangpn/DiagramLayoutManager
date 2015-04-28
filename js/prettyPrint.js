/**
 * Created by zhangpn on 3/3/2015.
 */


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

module.exports = prettyPrint;