import { PriorityQueue } from "./DataStructures/PriorityQueue.js";
import { Graph } from "./DataStructures/Graph.js";

/**
 *
 * @param {Graph} graph graph
 * @param {Object} s star vertex of graph
 * @param {Object} t target vertex of graph
 */
export const dijkstra = (graph, s, t) => {
    const pq = new PriorityQueue();
    const pqTokens = {};
    const d = {};
    const cloud = {};
    const visitedVerticiesInOrder = [];

    for (let v of graph.getVertices()) {
        let w = Infinity;
        if (v === s) {
            w = 0;
        }
        d[v] = { dist: w, from: "" };
        pqTokens[v] = pq.insert(w, v);
    }

    while (!pq.isEmpty()) {
        const entry = pq.removeMin();
        const key = entry.key;
        const u = entry.value;

        if (key === Infinity) break;

        cloud[u] = { dist: key, from: d[u].from };
        visitedVerticiesInOrder.push(u);
        delete pqTokens[u];

        if (u === t) break;

        for (let edge of graph.edges[u]) {
            const v = edge.vertex;
            if (!(v in cloud)) {
                const wgt = edge.weight;
                if (d[u].dist + wgt < d[v].dist) {
                    d[v] = { dist: d[u].dist + wgt, from: u };
                    pq.replaceKey(pqTokens[v], d[v].dist);
                }
            }
        }
    }

    console.log(cloud);

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
