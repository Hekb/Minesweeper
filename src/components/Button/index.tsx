import React from "react";
import "./Button.scss"
import { cellState, cellValue } from "../../types";

interface ButtonProps{
    row: number;
    col: number;
    state: cellState;
    value: cellValue;
    onClick(rowP: number, colP: number): (...args: any[]) => void;
    rightClicked(row: number, col: number): (...args: any[]) => void;
    red?:boolean; 
}

const Button: React.FC<ButtonProps> = ({row, col, state, value, onClick, rightClicked, red}) => {
    const renderButton = (): React.ReactNode => {
        if(state == cellState.visible){
            if(value == cellValue.bomb){
                return (<span aria-label="bomb" role="img"> 💣</span>);
            }
            if(value == cellValue.empty){
                return null;
            }
            return (<span aria-label="number" role="img"> {value}</span>)
        }else if(state == cellState.flagged){
            return (<span aria-label="flag" role="img"> 🚩</span>);
        }else{
            return null;
        }

    };
    return (
    <div className={`button ${state == cellState.visible ? 'visible' : ""} value-${value} ${red ? 'red' : ""}`} 
        onClick={onClick(row,col)}
        onContextMenu={ rightClicked(row,col) }>
        {renderButton()}
    </div>
    );
};

export default Button;