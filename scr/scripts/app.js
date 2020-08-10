import { Manager } from "./pathfinding-visualizer/manager.js";
const HEIGHT = 31;
const WIDTH = 75;
// Main function
$(document).ready(function () {
    let manager = new Manager(HEIGHT, WIDTH);
    manager.initialise();
});
