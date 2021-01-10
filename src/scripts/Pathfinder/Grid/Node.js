import { NodeState } from "./NodeState.js";

const { START, TARGET, WALL, WEIGHT, NORMAL } = NodeState;
const TERMINALS = [START, TARGET];

/**
 * Represents a single node in the Grid
 */
export class Node {
    constructor(id) {
        this.id = id;
        this.weight = 1;
        this.state = NORMAL;
        this.previousState = NORMAL;
    }

    /**
     * Sets this Node as a start Node if it is valid. A target node
     * cannot be set as a start Node.
     *
     * @returns {Boolean} returns true if the node can be set to start,
     *                    returns false otherwise.
     */
    setAsStart() {
        if (this.state !== TARGET) {
            this.previousState = this.state;
            this.state = START;
            this.weight = 1;
            return true;
        }
        return false;
    }

    /**
     * Sets this Node as a target Node if it is valid. A start node
     * cannot be set as a target Node.
     *
     * @returns {Boolean} returns true if the node can be set to target,
     *                    returs false otherwise.
     */
    setAsTarget() {
        if (this.state !== START) {
            this.previousState = this.state;
            this.state = TARGET;
            this.weight = 1;
            return true;
        }
        return false;
    }

    setAsNormal() {
        if (!TERMINALS.includes(this.state)) {
            this.previousState = this.state;
            this.state = NORMAL;
            this.weight = 1;
        }
    }

    /**
     * Toggles the node wall on and off.
     */
    toggleWall() {
        if (!TERMINALS.includes(this.state)) {
            this.previousState = this.state;
            this.weight = 1;
            if (this.state === WALL) {
                this.state = NORMAL;
            } else {
                this.state = WALL;
            }
            return true;
        } else {
            this.previousState = WALL;
            return false;
        }
    }

    toggleWeight() {
        if (!TERMINALS.includes(this.state)) {
            this.previousState = this.state;
            if (this.state === WEIGHT) {
                this.state = NORMAL;
                this.weight = 1;
            } else {
                this.state = WEIGHT;
                this.weight = 15;
            }
            return true;
        } else {
            this.previousState = WEIGHT;
            return false;
        }
    }
}
