import * as helper from "./dom_helper.js";
import { Node, nodeState } from "./node/node.js";

export function Grid(height = 10, width = 20) {
    this.height = height;
    this.width = width;
    this.start = null;
    this.target = null;
    this.board = [];
}

Grid.prototype.setupGrid = function () {
    let grid = helper.clearGridRows(helper.getDOMGrid());
    let board = [];
    for (let r = 0; r < this.height; r++) {
        let newDOMRow = helper.createNewDOMRow(r);
        let newBoardRow = [];
        for (let c = 0; c < this.width; c++) {
            let newDOMNode = helper.creatNewDOMNode(r, c),
                newNode = new Node(`${r}-${c}`, nodeState.NORMAL);

            if (r === Math.floor(this.height / 2)) {
                if (c === Math.floor(this.width / 4)) {
                    helper.setAsDOMStartNode(newDOMNode);
                    this.setAsStart(newNode);
                } else if (c === Math.floor((3 * this.width) / 4)) {
                    helper.setAsDOMTargetNode(newDOMNode);
                    this.setAsTarget(newNode);
                }
            }
            newDOMRow.append(newDOMNode);
            newBoardRow.push(newNode);
        }
        grid.append(newDOMRow);
        board.push(newBoardRow);
        this.board = board;
    }
};

Grid.prototype.setAsStart = function (node) {
    node.state = nodeState.START;
    this.start = node;
};

Grid.prototype.setAsTarget = function (node) {
    node.state = nodeState.TARGET;
    this.target = node;
};
