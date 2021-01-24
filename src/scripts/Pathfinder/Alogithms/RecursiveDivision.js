export const ORIENTATION = {
    HORIZONTAL: 0,
    VERTICAL: 1,
};

export const recursiveDivision = (walls, height, width) => {
    generateOuterWalls(walls, height, width);
    generateMaze(walls, 2, height - 3, 2, width - 3);
};

const generateOuterWalls = (walls, height, width) => {
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

const generateMaze = (
    walls,
    rowStart,
    rowEnd,
    colStart,
    colEnd,
    orientation = Math.floor(Math.random() * 2)
) => {
    if (rowEnd < rowStart || colEnd < colStart) return;

    const isHorizontal = orientation === ORIENTATION.HORIZONTAL;

    const r_start = isHorizontal ? rowStart : rowStart - 1;
    const r_end = isHorizontal ? rowEnd : rowEnd + 1;

    const c_start = isHorizontal ? colStart - 1 : colStart;
    const c_end = isHorizontal ? colEnd + 1 : colEnd;

    const randomRow = randIntInRange(r_start, r_end, 2);
    const randomCol = randIntInRange(c_start, c_end, 2);

    const fixedAxis = isHorizontal ? randomRow : randomCol;
    const hole = isHorizontal ? randomCol : randomRow;

    const start = isHorizontal ? c_start : r_start;
    const end = isHorizontal ? c_end : r_end;

    for (let n = start; n <= end; n++) {
        const wall = isHorizontal ? `${fixedAxis}-${n}` : `${n}-${fixedAxis}`;

        if (n !== hole) walls.push(wall);
    }

    const newRowEnd = isHorizontal ? fixedAxis - 2 : rowEnd;
    const newColEnd = isHorizontal ? colEnd : fixedAxis - 2;

    let newHeight = newRowEnd - rowStart;
    let newWidth = newColEnd - colStart;

    let newOrientation;

    newOrientation =
        newHeight > newWidth ? ORIENTATION.HORIZONTAL : ORIENTATION.VERTICAL;

    generateMaze(
        walls,
        rowStart,
        newRowEnd,
        colStart,
        newColEnd,
        newOrientation
    );

    const newRowStart = isHorizontal ? fixedAxis + 2 : rowStart;
    const newColStart = isHorizontal ? colStart : fixedAxis + 2;

    newHeight = rowEnd - newRowStart;
    newWidth = colEnd - newColStart;

    newOrientation =
        newHeight > newWidth ? ORIENTATION.HORIZONTAL : ORIENTATION.VERTICAL;

    generateMaze(
        walls,
        newRowStart,
        rowEnd,
        newColStart,
        colEnd,
        newOrientation
    );
};

/**
 * Returns a random integer from n from the set
 * {for i in [min, max] i += step}
 *
 * @param {Number} min lower bound, inclusive
 * @param {Number} max upper bound
 * @param {Number} step increment value
 */
const randIntInRange = (min, max, step = 1) => {
    const intervals = Math.floor((max - min) / step) + 1;
    const rand = Math.floor(Math.random() * intervals);
    return rand * step + min;
};
