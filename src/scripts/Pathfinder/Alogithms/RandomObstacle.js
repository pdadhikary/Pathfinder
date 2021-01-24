export const randomObstacle = (walls, height, width) => {
    const allWalls = [];

    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            allWalls.push(`${r}-${c}`);
        }
    }

    const WALL_PERCENTAGE = 0.35;
    const numWalls = Math.floor(height * width * WALL_PERCENTAGE);

    for (let i = 0; i < numWalls; i++) {
        const wall = Math.floor(Math.random() * allWalls.length);
        walls.push(...allWalls.splice(wall, 1));
    }
};
