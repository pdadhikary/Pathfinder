// creates a new DOM row and retuns it
export const createNewDOMRow = (rowId) =>
    $("<div></div>").attr("class", "row").attr("id", `row-${rowId}`);

// creates a DOM node and returns it
export const creatNewDOMNode = (rowId, nodeId) =>
    $("<div><div>").attr("class", "node").attr("id", `${rowId}-${nodeId}`);

// clears all contents from the DOM grid
export const clearGridRows = (DOMgrid) => DOMgrid.empty();

// return the Grid from DOM
export const getDOMGrid = () => $("#grid");

// flags the given DOM node as start
export const setAsDOMStartNode = (DOMNode) =>
    DOMNode.attr("class", "node start");

// flags the given DOM node as target
export const setAsDOMTargetNode = (DOMnode) =>
    DOMnode.attr("class", "node target");

// gets the DOM node with given id
export const getDOMNode = (nodeId) => $(`#${nodeId}`);

// gets the class attribute of the DOMNode with given id
export const getDOMNodeClass = (nodeId) => $(`#${nodeId}`).attr("class");

// sets the class attribute of the DOMNode with given id
export const setDOMNodeClass = (nodeId, className) =>
    $(`#${nodeId}`).attr("class", className);

// add mouseleave eventListener to the DOMGrid
export const setDOMGridMouseLeave = (eventFunction) =>
    getDOMGrid().off("mouseleave").mouseleave(eventFunction);

// add mousedown evenListener to DOMNode with given id
export const setDOMNodeMouseDown = (nodeId, eventFunction) =>
    $(`#${nodeId}`).off("mousedown").mousedown(eventFunction);

// add mouseup evenListener to DOMNode with given id
export const setDOMNodeMouseUp = (nodeId, eventFunction) =>
    $(`#${nodeId}`).off("mouseup").mouseup(eventFunction);

// add mouseenter evenListener to DOMNode with given id
export const setDOMNodeMouseEnter = (nodeId, eventFunction) =>
    $(`#${nodeId}`).off("mouseenter").mouseenter(eventFunction);

export const setResetEventListener = (eventFunction) =>
    $("#reset").off("click").click(eventFunction);

export const setClearWallsEventListener = (eventFunction) =>
    $("#clear-walls").off("click").click(eventFunction);

export const setClearPathEventListener = (eventFunction) => {
    $("#clear-path").off("click").click(eventFunction);
};

export const setStartEventListener = (eventFunction) =>
    $("#find-path").off("click").click(eventFunction);

export const setGenerateMazeEventListener = (eventFunction) =>
    $("#generate").off("click").click(eventFunction);

export const disableWithClassName = (className) => {
    $(`.${className}`).each(function () {
        $(this).off();
    });
};

export const disableWithId = (id) => $(`#${id}`).off();
