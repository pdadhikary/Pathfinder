import { Node } from "./Node.js";
import { NodeState } from "./NodeState.js";
import { Graph } from "../Alogithms/DataStructures/Graph.js";

const { START, TARGET, WALL, WEIGHT, NORMAL } = NodeState;
const TERMINALS = [START, TARGET];

export class Grid {
    constructor(height, width) {
        this.height = height;
        this.width = width;
        this.start = null;
        this.target = null;
        this.board = [];

        this._initializeBoard();
    }

    _initializeBoard() {
        for (let row = 0; row < this.height; row++) {
            let newRow = [];
            for (let col = 0; col < this.width; col++) {
                const newNode = new Node(Grid.makeId(row, col));
                newRow.push(newNode);
            }
            this.board.push(newRow);
        }

        const middleRow = Math.floor(this.height / 2);
        const startCol = Math.floor(this.width / 4);
        const targetCol = Math.floor((3 * this.width) / 4);

        const startNode = this.getNode(middleRow, startCol);
        startNode.setAsStart();
        this.start = startNode;

        const targetNode = this.getNode(middleRow, targetCol);
        targetNode.setAsTarget();
        this.target = targetNode;
    }

    /**
     * Fetches the node at the specified row and col number.
     *
     * @param {Number} row row number
     * @param {Number} col col number
     * @returns {Node} node at (row, col)
     */
    getNode(row, col) {
        return this.board[row][col];
    }

    /**
     * Moves the start Node to possition (row, col)
     * @param {Number} row row number
     * @param {Number} col col number
     */
    setStart(row, col) {
        const prevStart = this.start;
        const node = this.getNode(row, col);
        if (node.setAsStart()) {
            this.start = node;
            this._revertNode(prevStart);
            return true;
        }
        return false;
    }

    setTarget(row, col) {
        const prevTarget = this.target;
        const node = this.getNode(row, col);

        if (node.setAsTarget()) {
            this.target = node;
            this._revertNode(prevTarget);
            return true;
        }
        return false;
    }

    toggleWallAt(row, col) {
        const node = this.getNode(row, col);
        return node.toggleWall();
    }

    toggleWeightAt(row, col) {
        const node = this.getNode(row, col);
        return node.toggleWeight();
    }

    clearObstableAt(row, col) {
        const node = this.getNode(row, col);
        if (!TERMINALS.includes(node.state)) {
            node.state = NORMAL;
        }
        node.weight = 1;
        node.previousState = NORMAL;
    }

    /**
     * Converts the Grid into a Graph
     *
     * @returns {Graph} graph representing this Grid
     */
    makeGraph() {
        const graph = new Graph();

        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                const node = this.getNode(row, col);
                if (node.state !== WALL) {
                    const numNeighbours = 4;
                    const dx = [0, 1, 0, -1];
                    const dy = [-1, 0, 1, 0];
                    const neighbours = [];

                    for (let i = 0; i < numNeighbours; i++) {
                        if (
                            row + dy[i] < this.height &&
                            row + dy[i] >= 0 &&
                            col + dx[i] < this.width &&
                            col + dx[i] >= 0 &&
                            this.getNode(row + dy[i], col + dx[i]).state !==
                                WALL
                        ) {
                            const neighbour = this.getNode(
                                row + dy[i],
                                col + dx[i]
                            );
                            neighbours.push(neighbour);
                        }
                    }

                    graph.addVertex(node.id);
                    for (let neighbour of neighbours) {
                        graph.addDirectedEdge(
                            node.id,
                            neighbour.id,
                            neighbour.weight
                        );
                    }
                }
            }
        }

        return graph;
    }

    static makeId(row, col) {
        return `${row}-${col}`;
    }

    static parseId(id) {
        const row = id.split("-")[0];
        const col = id.split("-")[1];

        return [row, col];
    }

    /**
     * Reverts the Node back to its previous state.
     * @param {Node} node node from the grid
     */
    _revertNode(node) {
        const row = parseInt(node.id.split("-")[0]);
        const col = parseInt(node.id.split("-")[1]);

        node.state = NORMAL;

        if (node.previousState === WALL) {
            node.toggleWall();
        } else if (node.previousState === WEIGHT) {
            node.toggleWeight();
        } else {
            node.setAsNormal();
        }
    }
}
