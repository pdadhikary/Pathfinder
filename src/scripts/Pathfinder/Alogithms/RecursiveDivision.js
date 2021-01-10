export const ORIENTATION = {
    HORIZONTAL: 0,
    VERTICAL: 1,
};

export const recursiveDivision = (walls, height, width) => {
    generateOuterWalls(walls, height, width);
    generateMaze(walls, 2, height - 3, 2, width - 3, ORIENTATION.HORIZONTAL);
};

/**
 * @author Clément Mihailescu <@clementmihailescu>
 * https://github.com/clementmihailescu/Pathfinding-Visualizer/blob/master/public/browser/mazeAlgorithms/recursiveDivisionMaze.js
 *
 * @param {*} walls
 * @param {*} rowStart
 * @param {*} rowEnd
 * @param {*} colStart
 * @param {*} colEnd
 * @param {*} orientation
 */
export const generateMaze = (
    walls,
    rowStart,
    rowEnd,
    colStart,
    colEnd,
    orientation
) => {
    if (rowEnd < rowStart || colEnd < colStart) return;

    if (orientation === ORIENTATION.HORIZONTAL) {
        let possibleRows = [];
        for (let r = rowStart; r <= rowEnd; r += 2) {
            possibleRows.push(r);
        }
        let possibleCols = [];
        for (let c = colStart - 1; c <= colEnd + 1; c += 2) {
            possibleCols.push(c);
        }
        let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
        let randomColIndex = Math.floor(Math.random() * possibleCols.length);
        let currentRow = possibleRows[randomRowIndex];
        let colRandom = possibleCols[randomColIndex];

        for (let n = colStart - 1; n <= colEnd + 1; n++)
            if (n !== colRandom) walls.push(`${currentRow}-${n}`);

        if (currentRow - 2 - rowStart > colEnd - colStart) {
            generateMaze(
                walls,
                rowStart,
                currentRow - 2,
                colStart,
                colEnd,
                orientation
            );
        } else {
            generateMaze(
                walls,
                rowStart,
                currentRow - 2,
                colStart,
                colEnd,
                ORIENTATION.VERTICAL
            );
        }
        if (rowEnd - (currentRow + 2) > colEnd - colStart) {
            generateMaze(
                walls,
                currentRow + 2,
                rowEnd,
                colStart,
                colEnd,
                orientation
            );
        } else {
            generateMaze(
                walls,
                currentRow + 2,
                rowEnd,
                colStart,
                colEnd,
                ORIENTATION.VERTICAL
            );
        }
    } else {
        let possibleCols = [];
        for (let c = colStart; c <= colEnd; c += 2) {
            possibleCols.push(c);
        }
        let possibleRows = [];
        for (let r = rowStart - 1; r <= rowEnd + 1; r += 2) {
            possibleRows.push(r);
        }
        let randomColIndex = Math.floor(Math.random() * possibleCols.length);
        let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
        let currentCol = possibleCols[randomColIndex];
        let rowRandom = possibleRows[randomRowIndex];

        for (let r = rowStart - 1; r <= rowEnd + 1; r++)
            if (r !== rowRandom) walls.push(`${r}-${currentCol}`);

        if (rowEnd - rowStart > currentCol - 2 - colStart) {
            generateMaze(
                walls,
                rowStart,
                rowEnd,
                colStart,
                currentCol - 2,
                ORIENTATION.HORIZONTAL
            );
        } else {
            generateMaze(
                walls,
                rowStart,
                rowEnd,
                colStart,
                currentCol - 2,
                orientation
            );
        }
        if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
            generateMaze(
                walls,
                rowStart,
                rowEnd,
                currentCol + 2,
                colEnd,
                ORIENTATION.HORIZONTAL
            );
        } else {
            generateMaze(
                walls,
                rowStart,
                rowEnd,
                currentCol + 2,
                colEnd,
                orientation
            );
        }
    }
};

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
