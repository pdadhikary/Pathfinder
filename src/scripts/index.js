import { Grid } from "./Pathfinder/Grid/Grid.js";
import * as _ from "./helper.js";
import { recursiveDivision } from "./Pathfinder/Alogithms/RecursiveDivision.js";
import { dijkstra } from "./Pathfinder/Alogithms/Dijkstra.js";

let HEIGHT = 21;
let WIDTH = 60;
const {
    START,
    TARGET,
    WALL,
    WEIGHT,
    NORMAL,
    VISITED,
    SHORTEST_PATH,
} = _.NODE_CLASSES;
const OBSTACLES = [WEIGHT, WALL];
const TERMINALS = [START, TARGET];
const MAZE_GENERTORS = {
    RCRSIVE_DIV: recursiveDivision,
};
const SHORTEST_PATH_ALGS = {
    DIJKSTRA: () => dijkstra(grid.makeGraph(), grid.start.id, grid.target.id),
};

const SPEEDS = {
    INSTANT: 0,
    FAST: 2,
    MED: 10,
    SLOW: 25,
};

let grid = new Grid(HEIGHT, WIDTH);
let isActive = true;
let isAlgoDone = false;
let algoSpeed = SPEEDS.MED;
let mouseDown = false;
let pressedNodeState = NORMAL;
let obstacleType = WALL;
let mazeAlgorithm = MAZE_GENERTORS.RCRSIVE_DIV;
let shortestPathAlgorithm = SHORTEST_PATH_ALGS.DIJKSTRA;

/* -------------------------------------------------------------------------- */
/*                                Main Function                               */
/* -------------------------------------------------------------------------- */
$(() => {
    createGrid();
    addControlEventListeners();
    addNodeEventListeners();
});

/* -------------------------------------------------------------------------- */
/*                               Event Handlers                               */
/* -------------------------------------------------------------------------- */
const createGrid = () => {
    let dom = _.clearDOMGridRows(_.getDOMGrid());
    [HEIGHT, WIDTH] = calculateGridDimensions(
        _.getAvailableHeight(),
        _.getAvailableWidth()
    );
    grid = new Grid(HEIGHT, WIDTH);
    for (let row = 0; row < HEIGHT; row++) {
        let newRow = _.createNewDOMRow(row);
        for (let col = 0; col < WIDTH; col++) {
            const newNode = _.creatNewDOMNode(row, col);
            _.appendChild(newRow, newNode);
        }
        _.appendChild(dom, newRow);
    }

    const startId = grid.start.id;
    const targetId = grid.target.id;

    _.setAsDOMStartNode(_.getDOMNode(startId));
    _.setAsDOMTargetNode(_.getDOMNode(targetId));
};

const addControlEventListeners = () => {
    const generate_btn = _.getDOMObjWithId(_.BTN_IDS.GENERATE_MAZE);
    const clrObstacles_btn = _.getDOMObjWithId(_.BTN_IDS.CLEAR_OBSTACLES);
    const fndShrtstPth_btn = _.getDOMObjWithId(_.BTN_IDS.FIND_SHORTEST_PATH);
    const clearPath_btn = _.getDOMObjWithId(_.BTN_IDS.CLEAR_PATH);
    const reset_btn = _.getDOMObjWithId(_.BTN_IDS.RESET);
    const obstacleOption_btn = _.getDOMObjWithId(_.BTN_IDS.OBSTACLE_OPTION);
    const speedControl_btns = _.getDOMObjsWithClass(_.DOM_ELEMS.SPEED_ITEMS);
    const DOMgrid = _.getDOMObjWithId(_.DOM_ELEMS.GRID);

    _.addEvntListnr(generate_btn, _.EVENTS.CLICK, gate(generateMaze));
    _.addEvntListnr(clrObstacles_btn, _.EVENTS.CLICK, gate(clearObstacles));
    _.addEvntListnr(
        fndShrtstPth_btn,
        _.EVENTS.CLICK,
        gate(() => {
            isAlgoDone = false;
            findShortestPath();
        })
    );
    _.addEvntListnr(clearPath_btn, _.EVENTS.CLICK, gate(clearPath));
    _.addEvntListnr(reset_btn, _.EVENTS.CLICK, gate(resetGrid));
    _.addEvntListnr(
        obstacleOption_btn,
        _.EVENTS.CLICK,
        gate(toggleObstacleType)
    );
    _.addClassEvntListnr(speedControl_btns, _.EVENTS.CLICK, speedControl);
    _.addEvntListnr(DOMgrid, _.EVENTS.MOUSE_LEAVE, gate(onMouseUp));
    _.addEvntListnr(_.getWindow(), _.EVENTS.RESIZE, gate(resetGrid));
};

const addNodeEventListeners = () => {
    for (let row = 0; row < HEIGHT; row++) {
        for (let col = 0; col < WIDTH; col++) {
            const node = _.getDOMNode(Grid.makeId(row, col));

            _.setDOMNodeMouseDown(node, gate(onMouseDown));
            _.setDOMNodeMouseUp(node, gate(onMouseUp));
            _.setDOMNodeMouseEnter(node, gate(onMouseEnter));
        }
    }
};

const clearObstacles = () => {
    isAlgoDone = false;
    for (let row = 0; row < HEIGHT; row++) {
        for (let col = 0; col < WIDTH; col++) {
            const node = grid.getNode(row, col);
            grid.clearObstableAt(row, col);
            updateDOMNodeVisual(node.id);
        }
    }
};

const resetGrid = () => {
    isAlgoDone = false;
    isActive = true;
    createGrid();
    addNodeEventListeners();
};

const clearPath = () => {
    isAlgoDone = false;
    _.clearDOMPaths();
};

const toggleObstacleType = () => {
    obstacleType = obstacleType == WALL ? WEIGHT : WALL;
    _.toggleObstacleOption();
};

const onMouseDown = (event) => {
    event.preventDefault();
    const { id } = event.currentTarget;
    const [row, col] = Grid.parseId(id);
    const node = grid.getNode(row, col);
    mouseDown = true;

    if (TERMINALS.includes(node.state)) {
        pressedNodeState = node.state;
    } else {
        pressedNodeState = obstacleType;
        toggleObstable(row, col);
    }

    updateDOMNodeVisual(id);
};

const onMouseUp = (event) => {
    if (mouseDown && isAlgoDone) {
        findShortestPath();
    }

    mouseDown = false;
    pressedNodeState = null;
};

const onMouseEnter = (event) => {
    if (mouseDown) {
        const { id } = event.currentTarget;
        const [row, col] = Grid.parseId(id);

        if (pressedNodeState === START) {
            moveStart(row, col);
            _.clearDOMPaths();
        } else if (pressedNodeState === TARGET) {
            moveTarget(row, col);
            _.clearDOMPaths();
        } else if (OBSTACLES.includes(pressedNodeState)) {
            toggleObstable(row, col);
        }
    }
};

const speedControl = (event) => {
    const { id } = event.currentTarget;

    if (id === _.BTN_IDS.SPEED_INST) {
        algoSpeed = SPEEDS.INSTANT;
    } else if (id === _.BTN_IDS.SPEED_FAST) {
        algoSpeed = SPEEDS.FAST;
    } else if (id === _.BTN_IDS.SPEED_SLOW) {
        algoSpeed = SPEEDS.SLOW;
    } else {
        algoSpeed = SPEEDS.MED;
    }

    _.toggleOptionsItem(id, _.LIST.SPEED_LIST);
};

const generateMaze = () => {
    isActive = false;
    clearObstacles();
    const wallsToAnimate = [];
    mazeAlgorithm(wallsToAnimate, HEIGHT, WIDTH);

    wallsToAnimate.forEach((id, i) => {
        setTimeout(() => {
            toggleObstable(...Grid.parseId(id));
        }, algoSpeed * i);
    });
    setTimeout(() => {
        isActive = true;
    }, algoSpeed * wallsToAnimate.length);
};

const findShortestPath = async () => {
    isActive = false;
    _.clearDOMPaths();
    let [visitedNodesInOrder, shortestPath] = shortestPathAlgorithm();

    // remove start and target node
    const startId = grid.start.id;
    const targetId = grid.target.id;
    visitedNodesInOrder = visitedNodesInOrder.filter(
        (id) => id !== startId && id !== targetId
    );
    shortestPath = shortestPath.filter(
        (id) => id !== startId && id !== targetId
    );

    await animateVisitedNodes(visitedNodesInOrder);
    await animateShortestPath(shortestPath);

    isActive = true;
    isAlgoDone = true;
};

/* -------------------------------------------------------------------------- */
/*                              Utility Functions                             */
/* -------------------------------------------------------------------------- */

const calculateGridDimensions = (availableHeight, availableWidth) => {
    const nodeLength = 25;
    const padding = 30;
    return [
        Math.floor((availableHeight - padding) / nodeLength),
        Math.floor((availableWidth - padding) / nodeLength),
    ];
};

const moveStart = (row, col) => {
    const currStartId = grid.start.id;
    const currNodeId = Grid.makeId(row, col);

    grid.setStart(row, col);
    updateDOMNodeVisual(currStartId);
    updateDOMNodeVisual(currNodeId);
};

const moveTarget = (row, col) => {
    const currTargetId = grid.target.id;
    const currNodeId = Grid.makeId(row, col);

    grid.setTarget(row, col);
    updateDOMNodeVisual(currTargetId);
    updateDOMNodeVisual(currNodeId);
};

const toggleObstable = (row, col) => {
    if (obstacleType === WALL) {
        grid.toggleWallAt(row, col);
    } else if (obstacleType === WEIGHT) {
        grid.toggleWeightAt(row, col);
    }

    const nodeId = Grid.makeId(row, col);
    updateDOMNodeVisual(nodeId);
};

const updateDOMNodeVisual = (nodeId) => {
    const node = grid.getNode(...Grid.parseId(nodeId));
    const classes = getClassesByState(node.state);
    _.setDOMObjClass(_.getDOMNode(nodeId), classes);
};

const getClassesByState = (state) => {
    let output = [NORMAL];

    if (state === START) {
        output.push(START);
    } else if (state === TARGET) {
        output.push(TARGET);
    } else if (state === WALL) {
        output.push(WALL);
    } else if (state === WEIGHT) {
        output.push(WEIGHT);
    }

    return output;
};

const animateVisitedNodes = (visitedNodes) => {
    return new Promise((resolve, reject) => {
        const delay = isAlgoDone ? 0 : algoSpeed;
        visitedNodes.forEach((id, i) => {
            setTimeout(() => {
                _.appendClass(_.getDOMNode(id), VISITED);
            }, delay * i);
        });
        setTimeout(() => {
            resolve();
        }, delay * visitedNodes.length);
    });
};

const animateShortestPath = (shortestPath) => {
    return new Promise((resolve, reject) => {
        const delay = isAlgoDone ? 0 : algoSpeed;
        shortestPath.forEach((id, i) => {
            setTimeout(() => {
                _.appendClass(_.getDOMNode(id), SHORTEST_PATH);
            }, delay * i);
        });
        setTimeout(() => {
            resolve();
        }, delay * shortestPath.length);
    });
};

const gate = (eventFunction) => {
    return (event) => {
        if (isActive) {
            eventFunction(event);
        }
    };
};
