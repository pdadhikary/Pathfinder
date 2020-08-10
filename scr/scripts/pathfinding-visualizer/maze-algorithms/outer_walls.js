export const generateOuterWalls = (walls, height, width) => {
    for (let c = 0; c < width - 1; c++) {
        walls.push(`0-${c}`);
    }
    for (let r = 0; r < height - 1; r++) {
        walls.push(`${r}-${width - 1}`);
    }
    for (let c = width - 1; c > 0; c--) {
        walls.push(`${height - 1}-${c}`);
    }
    for (let r = height - 1; r > 0; r--) {
        walls.push(`${r}-0`);
    }
};
