import {MAX_ROWS,MAX_COLS, MINES} from "../constants"
import {cellState} from "../types"
import {cellValue} from "../types"
import {cell} from "../types"
import React from 'react'
// Function to generate cells
export const generateCells = () =>{
    let cells: cell[][] = [];
    for(let i = 0; i < MAX_ROWS; i++){
        cells.push([]);
        for(let j = 0; j < MAX_COLS; j++){
            cells[i].push({
                value: cellValue.empty,
                state: cellState.open
            })
        }
    }

    let placedMines = 0;
    while(placedMines < MINES){
        let randomRow = Math.floor(Math.random() * MAX_ROWS);
        let randomCol = Math.floor(Math.random() * MAX_COLS);
        const currentCell = cells[randomRow][randomCol];
        if(currentCell.value != cellValue.bomb){
            cells = cells.map((row, rowIndex) => row.map((cell, colIndex) => {
                if(randomRow == rowIndex && randomCol == colIndex){
                    return {
                        ... cell,
                        value: cellValue.bomb
                    };
                }
                return cell;
            }));
            placedMines++;
            
        }
    }
    //generate adj number cells
    for(let rowIndex2 = 0; rowIndex2 < MAX_ROWS; rowIndex2++){
        for(let colIndex2= 0; colIndex2 < MAX_COLS; colIndex2++){
            const currentCell = cells[rowIndex2][colIndex2];
            if(currentCell.value == cellValue.bomb){
                continue;
            }
            let adjBombs = 0;
            const topLeft = rowIndex2 > 0 && colIndex2 > 0 ? cells[rowIndex2-1][colIndex2-1] : null;
            const top = rowIndex2 > 0 ? cells[rowIndex2-1][colIndex2] : null;
            const topRight = rowIndex2 > 0 && colIndex2 < MAX_COLS - 1 ? cells[rowIndex2-1][colIndex2+1]: null;
            const left = colIndex2 > 0 ? cells[rowIndex2][colIndex2 - 1]: null;
            const right = colIndex2 < MAX_COLS - 1 ? cells[rowIndex2][colIndex2+1]: null;
            const bottomLeft = rowIndex2 < MAX_ROWS - 1 && colIndex2 > 0 ? cells[rowIndex2+1][colIndex2-1]: null;
            const bottom = rowIndex2 < MAX_ROWS - 1 ? cells[rowIndex2+1][colIndex2]: null;
            const bottomRight = rowIndex2 < MAX_ROWS - 1 && colIndex2 < MAX_COLS - 1 ? cells[rowIndex2+1][colIndex2+1]: null;
            
            if(topLeft?.value === cellValue.bomb){
                adjBombs++;
            }
            if(top?.value == cellValue.bomb){
                adjBombs++;
            }
            if(topRight?.value == cellValue.bomb){
                adjBombs++;
            }
            if(left?.value === cellValue.bomb){
                adjBombs++;
            }
            if(right?.value == cellValue.bomb){
                adjBombs++;
            }
            if(bottomLeft?.value == cellValue.bomb){
                adjBombs++;
            }
            if(bottom?.value === cellValue.bomb){
                adjBombs++;
            }
            if(bottomRight?.value == cellValue.bomb){
                adjBombs++;
            }
            if(adjBombs > 0){
                cells[rowIndex2][colIndex2] = {
                    ...currentCell,
                    value: adjBombs
                }
            }
        }   
    }
    
    return cells;
}

export const grabAdjCells = (cells: cell[][], row: number, col: number): 
{
    topLeft: cell | null,
    top: cell | null,
    topRight: cell | null,
    left: cell | null,
    right: cell | null,
    bottomLeft: cell | null,
    bottom: cell | null,
    bottomRight: cell | null,

}=> {
    const topLeft = row > 0 && col > 0 ? cells[row-1][col-1] : null;
    const top = row > 0 ? cells[row-1][col] : null;
    const topRight = row > 0 && col < MAX_COLS - 1 ? cells[row-1][col+1]: null;
    const left = col > 0 ? cells[row][col - 1]: null;
    const right = col < MAX_COLS - 1 ? cells[row][col+1]: null;
    const bottomLeft = row < MAX_ROWS - 1 && col > 0 ? cells[row+1][col-1]: null;
    const bottom = row < MAX_ROWS - 1 ? cells[row+1][col]: null;
    const bottomRight = row < MAX_ROWS - 1 && col < MAX_COLS  - 1 ? cells[row+1][col+1]: null;
    return {
        topLeft,
        top,
        topRight,
        left,
        right,
        bottomLeft,
        bottom,
        bottomRight,
    }
    
}
export const openAdjEmptyCells = (cells: cell[][], row: number, col: number): cell[][] =>{
    const currentCell = cells[row][col];    
    
    if(currentCell.state === cellState.visible || currentCell.state === cellState.flagged){
        return cells;
    }

    let newCells = cells.slice();
    newCells[row][col].state = cellState.visible

    const {
        topLeft,
        top,
        topRight,
        left,
        right,
        bottomLeft,
        bottom,
        bottomRight,
    } = grabAdjCells(cells, row, col);
    if(topLeft?.state === cellState.open && topLeft.value != cellValue.bomb){
        if(topLeft.value === cellValue.empty){
            newCells=openAdjEmptyCells(newCells, row-1, col - 1)
        }else{
            newCells[row-1][col-1].state = cellState.visible
        }
        
    }

    
    if(top?.state === cellState.open && top.value != cellValue.bomb){
        if(top.value === cellValue.empty){
            newCells=openAdjEmptyCells(newCells, row-1, col )
        }else{
            newCells[row-1][col].state = cellState.visible
        }
        
    }

    if(topRight?.state === cellState.open && topRight.value != cellValue.bomb){
        if(topRight.value === cellValue.empty){
            newCells=openAdjEmptyCells(newCells, row-1, col + 1)
        }else{
            newCells[row-1][col+1].state = cellState.visible
        }
        
    }

    if(left?.state === cellState.open && left.value != cellValue.bomb){
        if(left.value === cellValue.empty){
            newCells=openAdjEmptyCells(newCells, row, col - 1)
        }else{
            newCells[row][col-1].state = cellState.visible
        }
        
    }
    

    if(right?.state === cellState.open && right.value != cellValue.bomb){
        if(right.value === cellValue.empty){
            newCells=openAdjEmptyCells(newCells, row, col +1)
        }else{
            newCells[row][col+1].state = cellState.visible
        }
        
    }    

    if(bottomLeft?.state === cellState.open && bottomLeft.value != cellValue.bomb){
        if(bottomLeft.value === cellValue.empty){
            newCells=openAdjEmptyCells(newCells, row+1, col-1)
        }else{
            newCells[row+1][col-1].state = cellState.visible
        }
        
    }

    if(bottom?.state === cellState.open && bottom.value != cellValue.bomb){
        if(bottom.value === cellValue.empty){
            newCells=openAdjEmptyCells(newCells, row+1, col )
        }else{
            newCells[row+1][col].state = cellState.visible
        }
        
    }
    if(bottomRight?.state === cellState.open && bottomRight.value != cellValue.bomb){
        if(bottomRight.value === cellValue.empty){
            newCells=openAdjEmptyCells(newCells, row+1, col+1)
        }else{
            newCells[row+1][col+1].state = cellState.visible
        }
        
    }

    return newCells;
}

