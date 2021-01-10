import { Grid } from "./Pathfinder/Grid/Grid.js";
import { NodeState } from "./Pathfinder/Grid/NodeState.js";
import * as _ from "./helper.js";
import { recursiveDivision } from "./Pathfinder/Alogithms/RecursiveDivision.js";
import { dijkstra } from "./Pathfinder/Alogithms/Dijkstra.js";

const HEIGHT = 20;
const WIDTH = 50;
const { START, TARGET, WALL, WEIGHT, NORMAL } = NodeState;
const OBSTACLES = [WEIGHT, WALL];
const TERMINALS = [START, TARGET];
const MAZE_GENERTORS = {
    0: recursiveDivision,
};
const SHORTEST_PATH_ALGS = {
    // dijsktra
    0: () => dijkstra(grid.makeGraph(), grid.start.id, grid.target.id),
};

let grid = new Grid(HEIGHT, WIDTH);
let isActive = true;
let isAlgoDone = false;
let algoSpeed = 10;
let mouseDown = false;
let pressedNodeState = NORMAL;
let obstacleType = WALL;
let mazeAlgorithm = MAZE_GENERTORS[0];
let shortestPathAlgorithm = SHORTEST_PATH_ALGS[0];

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
    grid = new Grid(HEIGHT, WIDTH);
    for (let row = 0; row < HEIGHT; row++) {
        let newRow = _.createNewDOMRow(row);
        for (let col = 0; col < WIDTH; col++) {
            const newNode = _.creatNewDOMNode(row, col);
            newRow.append(newNode);
        }
        dom.append(newRow);
    }

    const startId = grid.start.id;
    const targetId = grid.target.id;

    _.setAsDOMStartNode(_.getDOMNode(startId));
    _.setAsDOMTargetNode(_.getDOMNode(targetId));
};

const addControlEventListeners = () => {
    const generate_btn = _.getDOMObj(_.BTN_IDS.GENERATE_MAZE);
    const clrObstacles_btn = _.getDOMObj(_.BTN_IDS.CLEAR_OBSTACLES);
    const fndShrtstPth_btn = _.getDOMObj(_.BTN_IDS.FIND_SHORTEST_PATH);
    const clearPath_btn = _.getDOMObj(_.BTN_IDS.CLEAR_PATH);
    const reset_btn = _.getDOMObj(_.BTN_IDS.RESET);
    const wallOpt_btn = _.getDOMObj(_.BTN_IDS.WALL_OPTION);
    const weightOpt_btn = _.getDOMObj(_.BTN_IDS.WEIGHT_OPTION);
    const DOMgrid = _.getDOMObj(_.BTN_IDS.GRID);

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
    _.addEvntListnr(wallOpt_btn, _.EVENTS.CLICK, gate(selectWallObstacle));
    _.addEvntListnr(weightOpt_btn, _.EVENTS.CLICK, gate(selectWeightObstacle));
    _.addEvntListnr(DOMgrid, _.EVENTS.MOUSE_LEAVE, gate(onMouseUp));
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
    isActive = false;
    isAlgoDone = false;
    for (let row = 0; row < HEIGHT; row++) {
        for (let col = 0; col < WIDTH; col++) {
            const node = grid.getNode(row, col);
            grid.clearObstableAt(row, col);
            updateDOMNodeVisual(node.id);
        }
    }
    isActive = true;
};

const resetGrid = () => {
    isAlgoDone = false;
    createGrid();
    addNodeEventListeners();
};

const clearPath = () => {
    isAlgoDone = false;
    _.clearDOMPaths();
};

const selectWallObstacle = () => {
    obstacleType = WALL;
    _.toggleWallOptionOn();
    _.toggleWeightOptionOff();
};

const selectWeightObstacle = () => {
    obstacleType = WEIGHT;
    _.toggleWallOptionOff();
    _.toggleWeightOptionOn();
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

const generateMaze = () => {
    isActive = false;
    clearObstacles();
    const wallsToAnimate = [];
    mazeAlgorithm(wallsToAnimate, HEIGHT, WIDTH);

    let l = wallsToAnimate.length;
    wallsToAnimate.forEach((id, i) => {
        setTimeout(() => {
            toggleObstable(...Grid.parseId(id));
            if (i === l - 1) isActive = true;
        }, 5 * i);
    });
};

const findShortestPath = () => {
    isActive = false;
    _.clearDOMPaths();
    let [visitedNodesInOrder, shortestPath] = shortestPathAlgorithm();
    const startId = grid.start.id;
    const targetId = grid.target.id;

    // remove start and target node
    visitedNodesInOrder = visitedNodesInOrder.filter(
        (id) => id !== startId && id !== targetId
    );
    shortestPath = shortestPath.filter(
        (id) => id !== startId && id !== targetId
    );

    animateVisitedNodes(visitedNodesInOrder, shortestPath);
};

const animateVisitedNodes = (visitedNodes, shortestPath) => {
    visitedNodes.forEach((id, i) => {
        if (i === visitedNodes.length - 1) {
            setTimeout(() => {
                if (shortestPath.length === 0) {
                    isActive = true;
                    isAlgoDone = true;
                } else {
                    animateShortestPath(shortestPath);
                }
            }, (isAlgoDone ? 0 : algoSpeed) * (i + 1));
        }

        setTimeout(() => {
            _.appendClass(_.getDOMNode(id), "visited");
        }, (isAlgoDone ? 0 : algoSpeed) * i);
    });
};

const animateShortestPath = (shortestPath) => {
    shortestPath.forEach((id, i) => {
        setTimeout(() => {
            _.appendClass(_.getDOMNode(id), "shortest-path");
            if (i === shortestPath.length - 1) {
                isAlgoDone = true;
                isActive = true;
            }
        }, (isAlgoDone ? 0 : algoSpeed) * i);
    });
};

/* -------------------------------------------------------------------------- */
/*                              Utility Functions                             */
/* -------------------------------------------------------------------------- */
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

const gate = (eventFunction) => {
    return (event) => {
        if (isActive) {
            eventFunction(event);
        }
    };
};
