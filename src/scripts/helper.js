import { Grid } from "./Pathfinder/Grid/Grid.js";
import { NodeState } from "./Pathfinder/Grid/NodeState.js";

export const NODE_CLASSES = {
    NORMAL: NodeState.NORMAL,
    WALL: NodeState.WALL,
    WEIGHT: NodeState.WEIGHT,
    START: NodeState.START,
    TARGET: NodeState.TARGET,
    VISITED: "visited",
    SHORTEST_PATH: "shortest-path",
};

export const DOM_ELEMS = {
    NAV_BAR: "nav-bar",
    OPTION_BAR: "opt-bar",
    GRID: "grid",
    SPEED_ITEMS: "speed-items",
    MAZE_GENERATORS: "obstacle-gen-algs",
};

export const LIST = {
    SPEED_LIST: {
        LIST_ID: "list-speed",
        ITEMS: {
            INSTANT: "speed-inst",
            FAST: "speed-fst",
            MED: "speed-med",
            SLOW: "speed-slw",
        },
    },
    GENERATOR_LIST: {
        LIST_ID: "generator-list",
        ITEMS: {
            RCRSIVE_DIV: "rcrsive",
            PRIMS_MAZE: "prims",
            RANDOM: "random",
        },
    },
};

export const BTN_IDS = {
    GENERATE_MAZE: "generate",
    CLEAR_OBSTACLES: "clear-obstacles",
    FIND_SHORTEST_PATH: "find-path",
    CLEAR_PATH: "clear-path",
    RESET: "reset",
    OBSTACLE_OPTION: "obstacle-opt",
    SPEED_INST: LIST.SPEED_LIST.ITEMS.INSTANT,
    SPEED_FAST: LIST.SPEED_LIST.ITEMS.FAST,
    SPEED_MED: LIST.SPEED_LIST.ITEMS.MED,
    SPEED_SLOW: LIST.SPEED_LIST.ITEMS.SLOW,
    RCRSIVE_DIV: LIST.GENERATOR_LIST.ITEMS.RCRSIVE_DIV,
    PRIMS_MAZE: LIST.GENERATOR_LIST.ITEMS.PRIMS_MAZE,
    RANDOM: LIST.GENERATOR_LIST.ITEMS.RANDOM,
};

export const EVENTS = {
    CLICK: "click",
    MOUSE_DOWN: "mousedown",
    MOUSE_UP: "mouseup",
    MOUSE_ENTER: "mouseenter",
    MOUSE_LEAVE: "mouseleave",
    RESIZE: "resize",
};

// returns the available amount of height for DOM grid
export const getAvailableHeight = () =>
    $(window).height() -
    $(getDOMObjWithId(DOM_ELEMS.NAV_BAR)).height() * 2 -
    $(getDOMObjWithId(DOM_ELEMS.OPTION_BAR)).height() * 2;

// returns the available amount of Width for DOM grid
export const getAvailableWidth = () => $(window).width();

// gets the window DOM object
export const getWindow = () => $(window);

const makeId = Grid.makeId;

const parseId = Grid.parseId;

// creates a new DOM row and retuns it
export const createNewDOMRow = (row) =>
    $("<div></div>").attr("class", "row").attr("id", `row-${row}`);

// clears all contents from the DOM grid
export const clearDOMGridRows = (DOMgrid) => DOMgrid.empty();

// returns the DOM grid.
export const getDOMGrid = () => getDOMObjWithId(DOM_ELEMS.GRID);

// creates a DOM node and returns it
export const creatNewDOMNode = (row, col) =>
    $("<div><div>")
        .attr("class", NODE_CLASSES.NORMAL)
        .attr("id", makeId(row, col));

// gets the DOM node with given id
export const getDOMNode = (nodeId) => $(`#${nodeId}`);

// appends the child element to the DOMObj
export const appendChild = (DOMObj, child) => DOMObj.append(child);

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
export const setDOMObjClass = (DOMObj, classes) =>
    DOMObj.attr("class", classes.join(" "));

// retieves the DOM object with id
export const getDOMObjWithId = (id) => $(`#${id}`);

export const getDOMObjsWithClass = (className) => $(`.${className}`);

// adds an event listener to the DOM object
export const addEvntListnr = (DOMObj, eventName, eventFunction) =>
    DOMObj.on(eventName, eventFunction);

export const addClassEvntListnr = (DOMObjs, eventName, eventFunction) => {
    DOMObjs.each(function () {
        $(this).on(eventName, eventFunction);
    });
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

// clears previous paths from the DOM grid
export const clearDOMPaths = () => {
    $(`.${NODE_CLASSES.VISITED}`).each(function () {
        removeClass($(this), NODE_CLASSES.VISITED);
    });

    $(`.${NODE_CLASSES.SHORTEST_PATH}`).each(function () {
        removeClass($(this), NODE_CLASSES.SHORTEST_PATH);
    });
};

// toggles the obstacle type between Walls and Weights
export const toggleObstacleOption = () => {
    const icon = {
        WALL: "fas fa-square",
        WEIGHT: "fas fa-weight-hanging",
    };

    const obstacleOpt = $(`#${BTN_IDS.OBSTACLE_OPTION}`);

    const newIcon = $("<i></i>");
    let newText = "";

    if (obstacleOpt.hasClass("opt-wall")) {
        removeClass(obstacleOpt, "opt-wall");
        newIcon.attr("class", icon.WEIGHT);
        newText = "Weight";
        appendClass(obstacleOpt, "opt-weight");
    } else {
        removeClass(obstacleOpt, "opt-weight");
        newIcon.attr("class", icon.WALL);
        newText = "Wall";
        appendClass(obstacleOpt, "opt-wall");
    }

    obstacleOpt.empty();
    obstacleOpt.append(newIcon).append(newText);
};

export const toggleOptionsItem = (id, list) => {
    const listId = list.LIST_ID;
    const itemIds = list.ITEMS;

    for (let key in itemIds) {
        const id = itemIds[key];
        const DOMItem = getDOMObjWithId(id);
        removeClass(DOMItem, "item-selected");
    }

    const selectedItem = getDOMObjWithId(id);
    appendClass(selectedItem, "item-selected");
};
