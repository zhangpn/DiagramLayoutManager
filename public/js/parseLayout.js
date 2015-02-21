
/**
 * Created by zhangpn on 10/20/2014.
 */

var _componentList = {},
    PORTS = "ports",
    SRCID = "srcID",
    DSTID = "dstID",
    DELIM = "=>";

var mGraph;

//<editor-fold desc="Parsing Function">
/**
 * Get components (atoms, models) map {id: componentObject} from layout object
 * and draw them on paper
 * @param components
 */
var parseComponents = function (components) {
    var i,
        j,
        component,
        port,
        portSelector,
        inports,
        outports,
        rect,
        ports,
        componentMap = {};

    for (i = 0; i < components.length; i += 1) {
        component = components[i];
        inports = [];
        outports = [];
        ports = {};

        // get ports of each component if any and store them in the list of ports
        if (component.hasOwnProperty(PORTS)) {
            for (j = 0; j < component.ports.length; j += 1) {
                port = component.ports[j];
                ports[port.id] = port.name;
                inports.push(port.name);
            }

            rect = new joint.shapes.devs.Model({
                id: component.id,
                position: { x: component.position.x, y: component.position.y},
                size: { width: component.size.width, height: component.size.height},
                inPorts: inports,
                attrs: {'.label': {text: component.name, 'font-size': '8px'},
                        rect: { fill: 'white'},
                        '.inPorts circle': { fill: 'PaleGreen', r: 5},
                        '.inPorts text': {'font-size': '8px', x: -5},
                        '.outPorts circle': { fill: 'Tomato', r: 5},
                        '.outPorts text': { 'font-size': '8px', x: -5}
                }
            });

            for (j = 0; j < component.ports.length; j += 1) {
                portSelector = '.inPorts>.port' + j;
//                rect.attr(portSelector, {transform: 'translate (' + component.ports[j].relative_position.x + ', ' + component.ports[j].relative_position.y + ')'});
                if (component.ports[j].relative_position) {
                    rect.attributes.attrs[portSelector]['ref-y'] = component.ports[j].relative_position.y;
                    rect.attributes.attrs[portSelector]['ref-x'] = component.ports[j].relative_position.x;
                }
            }

        } else {
            rect = new joint.shapes.devs.Atomic({
                id: component.id,
                position: { x: component.position.x, y: component.position.y},
                size: { width: component.size.width, height: component.size.height},
                attrs: { rect: { fill: 'white' }, text: { text: component.name, fill: 'black' } }
            });
        }

        mGraph.addCell(rect);
        componentMap[component.id] = rect;
        _componentList[component.id] = {
            name: component.name,
            ports: ports
        };
    }

    return componentMap;
};

/**
 * Create links from layout connections
 * @param connections
 * @param componentMap
 */
var parseConnections = function (connections, componentMap) {
    var i,
        connection,
        src,
        dst,
        link;

    for (i = 0; i < connections.length; i += 1) {
        connection = connections[i];
        src = _getConnectorInfo(connection, SRCID);
        dst = _getConnectorInfo(connection, DSTID);

        if (src.portName && dst.portName) {

            link = new joint.shapes.devs.Link({
                source: { id: src.id, selector: componentMap[src.id].getPortSelector(src.portName) },
                target: { id: dst.id, selector: componentMap[dst.id].getPortSelector(dst.portName) }
            });
        } else if (src.portName) {
            link = new joint.shapes.devs.Link({
                source: { id: src.id, selector: componentMap[src.id].getPortSelector(src.portName) },
                target: { id: dst.id }
            });
        } else if (dst.portName) {
            link = new joint.shapes.devs.Link({
                source: { id: src.id },
                target: { id: dst.id, selector: componentMap[dst.id].getPortSelector(dst.portName) }
            });
        } else {
            link = new joint.shapes.devs.Link({
                source: { id: src.id },
                target: { id: dst.id }
            });
        }

        link.set('vertices', connection.pathPoints);
        mGraph.addCell(link);
    }
};

/**
 * Get information regarding a connection: source, target
 * @param connection
 * @param ID
 * @returns {{id: *, name: *, portName: *}}
 * @private
 */
var _getConnectorInfo = function (connection, ID) {
    var id = connection[ID],
        fields = id.split(DELIM),
        componentId = fields[0],
        component = _componentList[componentId],
        componentName = component.name,
        portId,
        portName,
        retVal;

    portId = fields[1] === "" ? null : fields[1];
    if (portId) {
        portName = component[PORTS][portId];
    } else {
        portName = null;
    }
    retVal = { id: componentId,
        name: componentName,
        portName: portName };

    return retVal;
};

/**
 * Main function to execute the parser
 * @param layout
 */
var parseLayout = function (layout, graph) {
    var componentMap;

    mGraph = graph;
    componentMap = parseComponents(layout.components);
    if (layout.connections) {
        parseConnections(layout.connections, componentMap);
    }

};
//</editor-fold>