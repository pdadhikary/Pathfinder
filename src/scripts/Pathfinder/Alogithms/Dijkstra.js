import { PriorityQueue } from "./DataStructures/PriorityQueue.js";
import { Graph } from "./DataStructures/Graph.js";

/**
 * Returns the shortest path from s to t which are vertices of the graph
 * and the visited veriticies in the order they were inspected.
 * @param {Graph} graph graph
 * @param {Object} s star vertex of graph
 * @param {Object} t target vertex of graph
 * @returns {Array} first element is the visited verticies in order, seconds element
 *                  is the shortest path
 */
export const dijkstra = (graph, s, t) => {
    const queue = new PriorityQueue();
    const queueTokens = {};
    const table = {};
    const cloud = {};
    const visitedVerticiesInOrder = [];

    for (let v of graph.getVertices()) {
        let w = Infinity;
        if (v === s) {
            w = 0;
        }
        table[v] = { dist: w, from: "" };
        queueTokens[v] = queue.insert(w, v);
    }

    while (!queue.isEmpty()) {
        const entry = queue.removeMin();
        const key = entry.key;
        const u = entry.value;

        if (key === Infinity) break;

        cloud[u] = { dist: key, from: table[u].from };
        visitedVerticiesInOrder.push(u);
        delete queueTokens[u];

        if (u === t) break;

        for (let edge of graph.edges[u]) {
            const v = edge.vertex;
            if (!(v in cloud)) {
                const wgt = edge.weight;
                if (table[u].dist + wgt < table[v].dist) {
                    table[v] = { dist: table[u].dist + wgt, from: u };
                    queue.replaceKey(queueTokens[v], table[v].dist);
                }
            }
        }
    }

    const shortestPath = t in cloud ? findShortestPath(cloud, s, t) : [];

    return [visitedVerticiesInOrder, shortestPath];
};

const findShortestPath = (disjkstraCloud, s, t) => {
    const shortestPath = [];
    let v = t;

    while (v !== s) {
        shortestPath.unshift(v);
        v = disjkstraCloud[v].from;
    }
    shortestPath.unshift(v);
    return shortestPath;
};
