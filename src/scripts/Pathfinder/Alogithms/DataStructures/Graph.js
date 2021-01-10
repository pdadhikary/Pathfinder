/**
 * Graph Entry
 */
class GraphEntry {
    /**
     * Creates a new Graph Entry
     * @param {*} vertex vertex connected through this edge
     * @param {Number} weight weight of edge
     */
    constructor(vertex, weight) {
        this.vertex = vertex;
        this.weight = weight;
    }
}

export class Graph {
    /**
     * Creates an empty Graph
     */
    constructor() {
        this.edges = {};
        this.vertices = [];
    }

    /**
     * Returns the number of verticies in this Graph.
     * @returns {Number} number of verticies
     */
    numVerticies() {
        return this.vertices.length;
    }

    /**
     * Returns an iterable collection of all the verticies in the Graph.
     * @returns {Array} collection of verticies
     */
    getVertices() {
        return [...this.vertices];
    }

    /**
     * Returns the number of edges in this Graph.
     * @returns {Number} number of edges in this Graph
     */
    numEdges() {
        return Object.keys(this.getEdges).length;
    }

    /**
     * Returns an iterable collection of all the edges in the Graph.
     * @returns {Array<Object>} collection of edges
     */
    getEdges() {
        return Object.keys(this.getEdges);
    }

    /**
     * Add a vertex to this Graph.
     * @param {Object} v a vertex
     */
    addVertex(v) {
        this.vertices.push(v);
        this.edges[v] = [];
    }

    /**
     * Adds an undirected vertex between two verticies
     * @param {Object} v1 a vertex
     * @param {Object} v2 a vertex
     * @param {Number} w weight of the edge
     */
    addEdge(v1, v2, w = 1) {
        this.edges[v1].push(new GraphEntry(v2, w));
        this.edges[v2].push(new GraphEntry(v1, w));
    }

    /**
     * Add a directed edge between two verticies
     * @param {Object} from from vertex
     * @param {Object} to to vertex
     * @param {Number} w weight of the edge
     */
    addDirectedEdge(from, to, w = 1) {
        this.edges[from].push(new GraphEntry(to, w));
    }

    /**
     * Logs a string representation of the graph
     */
    display() {
        let graph = "";
        this.getVertices().forEach((vertex) => {
            graph +=
                vertex +
                " -> " +
                this.edges[vertex]
                    .map((entry) => `${entry.vertex}(${entry.weight})`)
                    .join(", ") +
                "\n\n";
        });
        console.log(graph);
    }
}
