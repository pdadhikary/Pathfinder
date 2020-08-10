import { nodeState } from "../grid/node/node.js";

export const dijkstra = (grid) => {
    const board = grid.board;
    const startNode = grid.start;
    const targetNode = grid.target;

    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(board);
    while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        if (closestNode.state === nodeState.WALL) continue;
        if (closestNode.distance === Infinity) return visitedNodesInOrder;
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        if (closestNode === targetNode) return visitedNodesInOrder;
        updateUnvisitedNeighbours(closestNode, board);
    }
};

const sortNodesByDistance = (unvisitedNodes) =>
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);

const updateUnvisitedNeighbours = (node, board) => {
    const unvisitedNeighbours = getUnvisitedNeighbours(node, board);
    for (const neighbour of unvisitedNeighbours) {
        neighbour.distance = node.distance + 1;
        neighbour.previousNode = node;
    }
};

const getUnvisitedNeighbours = (node, board) => {
    const neighbours = [];
    const { row, col } = getRowCol(node.id);
    if (row > 0) neighbours.push(board[row - 1][col]);
    if (row < board.length - 1) neighbours.push(board[row + 1][col]);
    if (col > 0) neighbours.push(board[row][col - 1]);
    if (col < board[0].length - 1) neighbours.push(board[row][col + 1]);
    return neighbours.filter((neighbour) => !neighbour.isVisited);
};

const getRowCol = (nodeId) => {
    const tmp = nodeId.split("-");
    return { row: parseInt(tmp[0]), col: parseInt(tmp[1]) };
};

const getAllNodes = (board) => {
    const nodes = [];
    for (const row of board) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
};

export const getNodesInShortestPathOrder = (targetNode) => {
    const nodesInShortestPathOrder = [];
    let currentNode = targetNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
};
