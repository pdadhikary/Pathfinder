import { Grid } from "./grid/grid.js";
import { GridManipulator } from "./grid/grid_manipulator.js";
import { nodeState } from "./grid/node/node.js";
import * as helper from "./grid/dom_helper.js";
import { generateOuterWalls } from "./maze-algorithms/outer_walls.js";
import {
    generate as getMazeWalls,
    ORIENTATION,
} from "./maze-algorithms/recursive_division.js";
import {
    dijkstra,
    getNodesInShortestPathOrder,
} from "./pathfinding-algorithms/dijkstra.js";

export function Manager(height = 11, width = 31) {
    this.height = height;
    this.width = width;
    this.grid = undefined;
    this.gridManipulator;
    this.nodes = {};
    this.nodesToAnimate = [];
    this.shortestPathNodesToAnimate = [];
    this.wallsToAnimate = [];
    this.mouseDown = false;
    this.algoDone = false;
    this.pressedNodeState = nodeState.NORMAL;
    this.previouslyPressedNodeStatus = null;
}

Manager.prototype.initialise = function () {
    this.grid = new Grid(this.height, this.width);
    this.gridManipulator = new GridManipulator(this.grid);
    this.grid.setupGrid();
    this.addEventListeners();
};

Manager.prototype.addEventListeners = function () {
    helper.setDOMGridMouseLeave(() => {
        this.mouseDown = false;
    });

    helper.setResetEventListener(this.initialise.bind(this));
    helper.setClearWallsEventListener(this.clearWalls.bind(this));
    helper.setClearPathEventListener(this.clearPath.bind(this));
    helper.setStartEventListener(this.findShortestPath.bind(this));
    helper.setGenerateMazeEventListener(this.generateMaze.bind(this));

    for (let r = 0; r < this.height; r++) {
        for (let c = 0; c < this.width; c++) {
            let nodeId = `${r}-${c}`;
            let node = this.grid.board[r][c];

            helper.setDOMNodeMouseDown(nodeId, (e) => {
                e.preventDefault();
                this.mouseDown = true;
                let specialStates = [nodeState.START, nodeState.TARGET];
                if (specialStates.includes(node.state)) {
                    this.pressedNodeState = node.state;
                } else {
                    this.pressedNodeState = nodeState.WALL;
                    this.gridManipulator.toggleNodeWall(node.id);
                }
            });

            helper.setDOMNodeMouseUp(nodeId, () => {
                this.mouseDown = false;
                this.pressedNodeState = null;
            });

            helper.setDOMNodeMouseEnter(nodeId, () => {
                if (this.mouseDown) {
                    if (this.pressedNodeState === nodeState.START) {
                        this.gridManipulator.moveStartNode(node.id);
                        if (this.algoDone) {
                            this.instantDijkstra();
                        }
                    } else if (this.pressedNodeState === nodeState.TARGET) {
                        this.gridManipulator.moveTargetNode(node.id);
                        if (this.algoDone) {
                            this.instantDijkstra();
                        }
                    } else {
                        this.gridManipulator.toggleNodeWall(node.id);
                    }
                }
            });
        }
    }
};

Manager.prototype.removeEventListeners = function () {
    helper.disableWithClassName("toggle");
    helper.disableWithClassName("node");
};

Manager.prototype.clearWalls = function () {
    this.algoDone = false;
    for (let r = 0; r < this.height; r++) {
        for (let c = 0; c < this.width; c++) {
            let node = this.resetNode(r, c);
            node.wasWall = false;
            if (node.state === nodeState.WALL) {
                this.gridManipulator.toggleNodeWall(node.id);
            }
        }
    }
};

Manager.prototype.clearPath = function () {
    this.algoDone = false;
    for (let r = 0; r < this.height; r++) {
        for (let c = 0; c < this.width; c++) {
            this.resetNode(r, c);
        }
    }
};

Manager.prototype.resetNode = function (row, col) {
    let node = this.grid.board[row][col];
    node.previousNode = null;
    node.distance = Infinity;
    node.isVisited = false;

    let relevantStates = [nodeState.START, nodeState.TARGET, nodeState.WALL];
    if (!relevantStates.includes(node.state)) {
        node.state = nodeState.NORMAL;
        helper.setDOMNodeClass(node.id, "node");
    }
    return node;
};

Manager.prototype.generateMaze = function () {
    this.removeEventListeners();
    this.clearWalls();
    generateOuterWalls(this.wallsToAnimate, this.height, this.width);
    getMazeWalls(
        this.wallsToAnimate,
        2,
        this.height - 3,
        2,
        this.width - 3,
        ORIENTATION.HORIZONTAL
    );
    let l = this.wallsToAnimate.length;
    this.wallsToAnimate.forEach((nodeId, i) => {
        setTimeout(() => {
            this.gridManipulator.toggleNodeWall(nodeId);
            if (i === l - 1) this.addEventListeners();
        }, 5 * i);
    });
    this.wallsToAnimate = [];
};

Manager.prototype.findShortestPath = function () {
    this.removeEventListeners();
    if (this.algoDone) {
        for (let r = 0; r < this.height; r++) {
            for (let c = 0; c < this.width; c++) {
                this.resetNode(r, c);
            }
        }
    }

    const visitedNodesInOrder = dijkstra(this.grid);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(
        this.grid.target
    );
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
};

Manager.prototype.animateDijkstra = function (
    visitedNodesInOrder,
    nodesInShortestPathOrder
) {
    const relevantStates = [nodeState.START, nodeState.TARGET, nodeState.WALL];
    visitedNodesInOrder.forEach((node, i) => {
        if (i === visitedNodesInOrder.length - 1)
            setTimeout(
                () => this.animateShortestPath(nodesInShortestPathOrder),
                10 * (i + 1)
            );

        setTimeout(() => {
            if (!relevantStates.includes(node.state))
                helper.setDOMNodeClass(node.id, "node visited");
        }, 10 * i);
    });
};

Manager.prototype.animateShortestPath = function (nodesInShortestPathOrder) {
    const relevantStates = [nodeState.START, nodeState.TARGET, nodeState.WALL];
    nodesInShortestPathOrder.forEach((node, i) => {
        setTimeout(() => {
            if (!relevantStates.includes(node.state))
                helper.setDOMNodeClass(node.id, "node shortest-path");
            if (i === nodesInShortestPathOrder.length - 1) {
                this.algoDone = true;
                this.addEventListeners();
            }
        }, 10 * i);
    });
};

Manager.prototype.instantDijkstra = function () {
    if (this.algoDone) {
        for (let r = 0; r < this.height; r++) {
            for (let c = 0; c < this.width; c++) {
                this.resetNode(r, c);
            }
        }
    }
    const visitedNodesInOrder = dijkstra(this.grid);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(
        this.grid.target
    );

    const relevantStates = [nodeState.START, nodeState.TARGET, nodeState.WALL];

    visitedNodesInOrder.forEach((node) => {
        if (!relevantStates.includes(node.state))
            helper.setDOMNodeClass(node.id, "node visited");
    });
    nodesInShortestPathOrder.forEach((node) => {
        if (!relevantStates.includes(node.state))
            helper.setDOMNodeClass(node.id, "node shortest-path");
    });
    this.algoDone = true;
};
