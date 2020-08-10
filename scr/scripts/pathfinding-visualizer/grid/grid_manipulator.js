import * as helper from "./dom_helper.js";
import { nodeState } from "./node/node.js";

export function GridManipulator(grid) {
    this.grid = grid;
}

GridManipulator.prototype.moveStartNode = function (newStartNodeId) {
    let prevStartNode = this.grid.start;
    let newStartNode = this.getNode(newStartNodeId);
    let relevantStates = [nodeState.START, nodeState.TARGET];
    if (!relevantStates.includes(newStartNode.state)) {
        if (newStartNode.state === nodeState.WALL) newStartNode.wasWall = true;
        newStartNode.state = nodeState.START;
        helper.setDOMNodeClass(newStartNode.id, `node ${nodeState.START}`);
        this.grid.start = newStartNode;
        if (prevStartNode.wasWall) {
            prevStartNode.state = nodeState.NORMAL;
            this.toggleNodeWall(prevStartNode.id);
            prevStartNode.wasWall = false;
        } else {
            prevStartNode.state = nodeState.NORMAL;
            helper.setDOMNodeClass(prevStartNode.id, "node");
        }
    }
};

GridManipulator.prototype.moveTargetNode = function (newTargetNodeId) {
    let prevTargetNode = this.grid.target;
    let newTargetNode = this.getNode(newTargetNodeId);
    let relevantStates = [nodeState.START, nodeState.TARGET];
    if (!relevantStates.includes(newTargetNode.state)) {
        if (newTargetNode.state === nodeState.WALL)
            newTargetNode.wasWall = true;
        newTargetNode.state = nodeState.TARGET;
        helper.setDOMNodeClass(newTargetNode.id, `node ${nodeState.TARGET}`);
        this.grid.target = newTargetNode;
        if (prevTargetNode.wasWall) {
            prevTargetNode.state = nodeState.NORMAL;
            this.toggleNodeWall(prevTargetNode.id);
            prevTargetNode.wasWall = false;
        } else {
            prevTargetNode.state = nodeState.NORMAL;
            helper.setDOMNodeClass(prevTargetNode.id, "node");
        }
    }
};

GridManipulator.prototype.toggleNodeWall = function (nodeId) {
    let node = this.getNode(nodeId);
    let relevantStates = [nodeState.START, nodeState.TARGET];
    if (!relevantStates.includes(node.state)) {
        let newClass =
            node.state !== nodeState.WALL ? `node ${nodeState.WALL}` : "node";
        helper.setDOMNodeClass(nodeId, newClass);
        node.state =
            node.state !== nodeState.WALL ? nodeState.WALL : nodeState.NORMAL;
    } else {
        node.wasWall = true;
    }
};

GridManipulator.prototype.getNode = function (nodeId) {
    let coord = nodeId.split("-");
    let r = parseInt(coord[0]),
        c = parseInt(coord[1]);
    return this.grid.board[r][c];
};
