import React, {useState, useEffect, MouseEvent} from 'react';
import "./App.scss";
import Number from "../Number";
import {generateCells, openAdjEmptyCells} from "../../utils";
import Button from '../Button';
import {cell, face, cellState, cellValue} from "../../types";
import { MAX_ROWS, MAX_COLS, MINES } from '../../constants';
import Status from "../Status";
import Difficulty from '../Difficulty';

const App: React.FC = () =>{
    const[cells, setCells] = useState<cell[][]>(generateCells());
    const[Face, setFace] = useState<face>(face.happy);
    const[time, setTime] = useState<number>(0);
    const[gameStarted, setLive] = useState<boolean>(false);
    const[mineCounter, setMineCounter] = useState<number>(MINES);
    const[lost, setLost] = useState<boolean>(false);
    const[won, setWon] = useState<boolean>(false);
    const[status, setStatus] = useState<String>("Click on Anywhere to Start");
    const[color, setColor] = useState<String>("blue");
    useEffect(() =>{
        
        if(lost) return;

        const mosuedown = () =>{
            
            setFace(face.lost);
        }
        const mouseup = () => {
            setFace(face.happy)
        }
        const optionChange = () =>{
            
        }
        window.addEventListener('mousedown', mosuedown)
        window.addEventListener('mouseup', mouseup)
        window.addEventListener('change', optionChange)

        return () => {
            window.removeEventListener('mousedown', mosuedown)
            window.removeEventListener('mouseup', mosuedown)
        }
    }, [])
    useEffect(() => {
        if(gameStarted && time < 999){
            const timer = setInterval(() =>{
                setTime(time + 1);
            }, 1000)
            return () => {
                clearInterval(timer);
            }    
        }
    },[gameStarted, time ]);
    useEffect(() =>{
        if(lost){
            setFace(face.lost);
            setLive(false);            
            setLost(true)
            setStatus("You Lost :(")
            setColor("red")
        }

    },[lost])

    const handleCellClick = (row1: number, col1: number) => (): void => {
        if(lost) return;

        if(!gameStarted){
            setLive(true);
        }
        setStatus("Game Started, Good Luck");
        
        const currentCell = cells[row1][col1];
        let newCells = cells.slice();
        if(currentCell.state === cellState.flagged) return;
        //clicked on a mine
        if(currentCell.value === cellValue.bomb){
            setLost(true);
            setFace(face.lost);
            newCells[row1][col1].red = true
            newCells = revealMines();
            setCells(newCells);
        }else if(currentCell.value === cellValue.empty || currentCell.state == cellState.visible){//clicked on empty cell
            newCells = openAdjEmptyCells(newCells, row1,col1)
            setCells(newCells)
        }else{ //clicked on a number
            newCells[row1][col1].state = cellState.visible
            
        }
        //check if game won
        let safeMineOpen = false;
        for(let row = 0; row < MAX_ROWS; row++){
            for(let col = 0; col < MAX_COLS; col++){
                const currentCell = newCells[row][col];
                if(currentCell.value != cellValue.bomb && currentCell.state === cellState.open){
                    safeMineOpen = true;
                    break;
                }
            }
        }
        if(!safeMineOpen){
            //we won the game
            setWon(true)
            newCells = newCells.map(row => row.map(cell => {
                if(cell.value == cellValue.bomb){
                    return {
                        ...cell,
                        state: cellState.flagged
                    }
                }
                return cell;
            }))
        }
        setCells(newCells)
    } 
    useEffect(() => {
        if(won){
            setLive(false)
            setWon(true)
            setFace(face.won)
            setStatus("Yay, you won!")
            setColor("green")
        }

    },[won])
    const faceClicked = () => {
        setLive(false)
        setLost(false)
        setTime(0)
        setCells(generateCells())
        setWon(false)
        setMineCounter(MINES)
        setStatus("Click on Anywhere to Start")
        setColor("blue")
    }
    const handleRightClick = (row1: number, col1: number) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void =>{
        e.preventDefault();
        const cell = cells[row1][col1]
        const currentCells = cells.slice();
        if(!gameStarted) return;

        if(cell.state === cellState.visible){
            return;
        }else if(cell.state === cellState.open){
            currentCells[row1][col1].state = cellState.flagged
            setCells(currentCells)
            setMineCounter(mineCounter - 1);
        }else if(cell.state === cellState.flagged){
            
            currentCells[row1][col1].state = cellState.open
            setCells(currentCells)
            setMineCounter(mineCounter + 1);
        }
    }
    const renderCells = ():React.ReactNode => {
        return cells.map((i, rowIndex) => i.map((cell, colIndex) => 
        <Button key={`${rowIndex}-${colIndex}`} 
            row={rowIndex} 
            col={colIndex} 
            state={cell.state} 
            value={cell.value}
            onClick={handleCellClick}
            rightClicked={handleRightClick}
            red={cell.red}
            />)
        );
    };
    
    const revealMines = (): cell[][] =>{
        let currentcells = cells.slice();
        currentcells = currentcells.map(row => row.map(cell =>{
            if(cell.value == cellValue.bomb){
                return {
                    ...cell,
                    state: cellState.visible
                }
            }
            return cell;
        }))
        return currentcells;
    }
    return(
        <div className="wrapper">
            <div className="status">
                <Status message={status} color={color}></Status>
            </div>
            <div>
                <Difficulty></Difficulty>
            </div>
            <div className="App">
                <div className="header">
                    <Number value={mineCounter}>
                        
                    </Number>
                    <div className="face" onClick={faceClicked}> 
                        <span aria-label="face" role="img">{Face}</span> 
                    </div>
                    <Number value={time}>

                    </Number>
                </div>
                <div className="body">
                    {renderCells()}
                </div>
            </div>
            
        </div>
        
    )
};

export default App;
