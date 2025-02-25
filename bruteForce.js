const start = Date.now();
const puzzle = new Array();

// load the puzzle
// const diabolical = '900050001006804900000000000700000006050000030008000400030070090000405000509206104';
// escargot
const diabolical = '100007090030020008009600500005300900010080002600004000300000010040000007007000300';
for (let index = 0; index < 9; index++) {
    puzzle.push(diabolical.split("").slice(index * 9, index * 9 + 9).map(x => parseInt(x)));
}


function findZero(startRow) {
    for (let index = startRow; index < 9; index++) {
        const location = puzzle[index].findIndex(element => element === 0);
        if (location >= 0) {
            return [index, location];
        }
    }
    return [null, null];
}

// find the first value that does not create a conflict with any other cells
// in that row, column, and quadrant
function incrementCell(row, col) {

    let value = puzzle[row][col];
    let flag;

    do {
        value++;
        flag = false;
        
        // check the row
        let location = puzzle[row].findIndex(element => element === value)
        if (location >= 0) {
            flag = true;
        }
        
        // check the column
        const slicedColumn = puzzle.map(row => row[col]);
        location = slicedColumn.findIndex(element => element === value)
        if (location >= 0) {
            flag = true;
        }
        
        // check the quadrant
        const rowStart = ((row / 3) | 0) * 3;
        const colStart = ((col / 3) | 0) * 3;
        for (let indexRow = rowStart; indexRow < rowStart + 3; indexRow++) {
            for (let indexCol = colStart; indexCol < colStart + 3; indexCol++) {
                if (puzzle[indexRow][indexCol] === value) {
                    flag = true;
                }
            }
        }

    } while (flag);

    return value;
}

// console.table(puzzle);

const history = new Array();

let myRow, myCol, myVal;

[myRow, myCol] = findZero(0);

while (myRow !== null) {
    myVal = incrementCell(myRow, myCol);

    if (myVal > 9) {
        puzzle[myRow][myCol] = 0;
        try {
            [myRow, myCol] = history.pop();

        } catch {
            console.table(puzzle);
            throw new Error("Something went badly wrong!");
        }
        
    } else {
        puzzle[myRow][myCol] = myVal;
        history.push([myRow, myCol]);
        [myRow, myCol] = findZero(myRow);
    }
}

const end = Date.now();

console.table(puzzle);

console.log(`Execution time: ${end - start} ms`);