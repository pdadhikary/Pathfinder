export const nodeState = {
    NORMAL: "normal",
    WALL: "wall",
    START: "start",
    TARGET: "target",
    VISITED: "visited",
};

export function Node(id, state) {
    this.id = id;
    this.state = state;
    this.previousNode = null;
    this.distance = Infinity;
    this.isVisited = false;
    this.wasWall = false;
}
