export const ORIENTATION = {
    HORIZONTAL: 0,
    VERTICAL: 1,
};

export const generate = (
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
            generate(
                walls,
                rowStart,
                currentRow - 2,
                colStart,
                colEnd,
                orientation
            );
        } else {
            generate(
                walls,
                rowStart,
                currentRow - 2,
                colStart,
                colEnd,
                ORIENTATION.VERTICAL
            );
        }
        if (rowEnd - (currentRow + 2) > colEnd - colStart) {
            generate(
                walls,
                currentRow + 2,
                rowEnd,
                colStart,
                colEnd,
                orientation
            );
        } else {
            generate(
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
            generate(
                walls,
                rowStart,
                rowEnd,
                colStart,
                currentCol - 2,
                ORIENTATION.HORIZONTAL
            );
        } else {
            generate(
                walls,
                rowStart,
                rowEnd,
                colStart,
                currentCol - 2,
                orientation
            );
        }
        if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
            generate(
                walls,
                rowStart,
                rowEnd,
                currentCol + 2,
                colEnd,
                ORIENTATION.HORIZONTAL
            );
        } else {
            generate(
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
