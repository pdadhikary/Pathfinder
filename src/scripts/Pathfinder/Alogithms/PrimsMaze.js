export const primsMaze = (walls, height, width) => {
    generateMaze(walls, 1, height - 2, 1, width - 2);
};

const generateMaze = (walls, rowStart, rowEnd, colStart, colEnd) => {
    const connected = {};
    const visited = {};
    const nodes = {};

    // select a random starting node
    const startR = randIntInRange(rowStart, rowEnd, 2);
    const startC = randIntInRange(colStart, colEnd, 2);
    const startNode = `${startR}-${startC}`;
    nodes[startNode] = true;

    while (Object.keys(nodes).length !== 0) {
        const nodeIdx = randIntInRange(0, Object.keys(nodes).length - 1);
        // select a cell randomly
        const node = Object.keys(nodes)[nodeIdx];
        // remove it from path set
        delete nodes[node];
        // mark it as visited
        visited[node] = true;
        // mark it as connected
        connected[node] = true;
        walls.push(node);

        // get visited neighbours
        const neighbours = getNeighbours(
            node,
            rowStart,
            rowEnd,
            colStart,
            colEnd
        ).filter((id) => id in visited);

        if (neighbours.length > 0) {
            // get connected neighbours
            const connectedNeighbours = neighbours.filter(
                (neighbour) => neighbour in connected
            );

            // pick a random connected neighbour
            const randomConnectedNeighbour =
                connectedNeighbours[
                    randIntInRange(0, connectedNeighbours.length - 1)
                ];

            // connect with the already connected neighbour
            const intermediateNode = getIntermediateNode(
                node,
                randomConnectedNeighbour
            );
            visited[intermediateNode] = true;
            connected[intermediateNode] = true;
            walls.splice(walls.length - 1, 0, intermediateNode);
        }

        // add all unconnected neighbours to the nodes set
        const unvisitedNeighbours = getNeighbours(
            node,
            rowStart,
            rowEnd,
            colStart,
            colEnd
        ).filter((neighbour) => !(neighbour in visited));
        unvisitedNeighbours.forEach(
            (unvisitedNeighbour) => (nodes[unvisitedNeighbour] = true)
        );
    }

    // walls.push(...Object.keys(connected));
};

const getNeighbours = (node, rowStart, rowEnd, colStart, colEnd) => {
    const NUM_OF_NEIGHOURS = 4;
    const dy = [2, 0, -2, 0];
    const dx = [0, 2, 0, -2];

    const [r, c] = node.split("-").map((val) => parseInt(val));
    let neighbours = [];

    for (let i = 0; i < NUM_OF_NEIGHOURS; i++) {
        const neighbourRow = r + dy[i];
        const neighboutCol = c + dx[i];

        if (
            neighbourRow >= rowStart &&
            neighbourRow <= rowEnd &&
            neighboutCol >= colStart &&
            neighboutCol <= colEnd
        )
            neighbours.push(`${neighbourRow}-${neighboutCol}`);
    }

    return neighbours;
};

const getIntermediateNode = (node, neighbour) => {
    const [nodeR, nodeC] = node.split("-").map((val) => parseInt(val));
    const [neighbourR, neighbourC] = neighbour
        .split("-")
        .map((val) => parseInt(val));

    const dR = (neighbourR - nodeR) / 2;
    const dC = (neighbourC - nodeC) / 2;

    const intermediate = `${nodeR + dR}-${nodeC + dC}`;
    return intermediate;
};

const randIntInRange = (min, max, step = 1) => {
    const intervals = Math.floor((max - min) / step) + 1;
    const rand = Math.floor(Math.random() * intervals);
    return rand * step + min;
};
