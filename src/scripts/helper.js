import { Grid } from "./Pathfinder/Grid/Grid.js";
import { NodeState } from "./Pathfinder/Grid/NodeState.js";

const NODE_CLASSES = {
    NORMAL: NodeState.NORMAL,
    WALL: NodeState.WALL,
    WEIGHT: NodeState.WEIGHT,
    START: NodeState.START,
    TARGET: NodeState.TARGET,
    VISITED: "visited",
    SHORTEST_PATH: "shortest-path",
};

export const BTN_IDS = {
    GENERATE_MAZE: "generate",
    CLEAR_OBSTACLES: "clear-walls",
    FIND_SHORTEST_PATH: "find-path",
    CLEAR_PATH: "clear-path",
    RESET: "reset",
    WALL_OPTION: "opt-wall",
    WEIGHT_OPTION: "opt-weight",
    GRID: "grid",
};

export const EVENTS = {
    CLICK: "click",
    MOUSE_DOWN: "mousedown",
    MOUSE_UP: "mouseup",
    MOUSE_ENTER: "mouseenter",
    MOUSE_LEAVE: "mouseleave",
};

const makeId = Grid.makeId;

const parseId = Grid.parseId;

// creates a new DOM row and retuns it
export const createNewDOMRow = (row) =>
    $("<div></div>").attr("class", "row").attr("id", `row-${row}`);

// clears all contents from the DOM grid
export const clearDOMGridRows = (DOMgrid) => DOMgrid.empty();

// returns the DOM grid.
export const getDOMGrid = () => getDOMObj(BTN_IDS.GRID);

// creates a DOM node and returns it
export const creatNewDOMNode = (row, col) =>
    $("<div><div>")
        .attr("class", NODE_CLASSES.NORMAL)
        .attr("id", makeId(row, col));

// gets the DOM node with given id
export const getDOMNode = (nodeId) => $(`#${nodeId}`);

// flags the DOM node as start
export const setAsDOMStartNode = (DOMNode) => {
    appendClass(DOMNode, NODE_CLASSES.START);
};

// flags the DOM node as target
export const setAsDOMTargetNode = (DOMnode) =>
    appendClass(DOMnode, NODE_CLASSES.TARGET);

// appends the class to the DOM object
export const appendClass = (DOMObj, newClass) => {
    let className = getDOMObjClass(DOMObj);
    className = className.split(" ").filter((c) => c !== newClass);
    className.push(newClass);
    className = className.join(" ");

    return DOMObj.attr("class", className);
};

// removes the class from the DOM object
export const removeClass = (DOMObj, removedClass) => {
    let className = getDOMObjClass(DOMObj);
    className = className
        .split(" ")
        .filter((c) => c !== removedClass)
        .join(" ");

    return DOMObj.attr("class", className);
};

// gets the class of the DOM object
export const getDOMObjClass = (DOMObj) => DOMObj.attr("class");

// overrites the DOM object with the given iterable list of classes
export const setDOMObjClass = (DOMObj, classes) => {
    return DOMObj.attr("class", classes.join(" "));
};

// retieves the DOM object with id
export const getDOMObj = (id) => $(`#${id}`);

// adds an event listener to the DOM object
export const addEvntListnr = (DOMObj, eventName, eventFunction) => {
    DOMObj.on(eventName, eventFunction);
};

// set mousedown evenListener to DOMNode with given id
export const setDOMNodeMouseDown = (node, eventFunction) =>
    node.off("mousedown").on("mousedown", eventFunction);

// set mouseup evenListener to DOMNode with given id
export const setDOMNodeMouseUp = (node, eventFunction) =>
    node.off("mouseup").on("mouseup", eventFunction);

// set mouseenter evenListener to DOMNode with given id
export const setDOMNodeMouseEnter = (node, eventFunction) =>
    node.off("mouseenter").on("mouseenter", eventFunction);

export const clearDOMPaths = () => {
    $(`.${NODE_CLASSES.VISITED}`).each(function () {
        // $(this).attr("class", "node");
        removeClass($(this), NODE_CLASSES.VISITED);
    });

    $(`.${NODE_CLASSES.SHORTEST_PATH}`).each(function () {
        removeClass($(this), NODE_CLASSES.SHORTEST_PATH);
    });
};

export const toggleWallOptionOff = () => {
    $("#opt-wall").attr("class", "option");
};

export const toggleWallOptionOn = () => {
    $("#opt-wall").attr("class", "option opt-selected");
};

export const toggleWeightOptionOff = () => {
    $("#opt-weight").attr("class", "option");
};

export const toggleWeightOptionOn = () => {
    $("#opt-weight").attr("class", "option opt-selected");
};
