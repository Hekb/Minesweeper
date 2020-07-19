import React from "react";
import "./Difficulty.scss"


const Difficulty: React.FC = () => {
    return (
        <div className="dif">
            <label>Choose Difficulty -></label>
            <select id="list">
                <option value="beg">9x9 - 10</option>
                <option value="inter">16x16 - 40</option>
                <option value="expert">16x30 - 99</option> 
            </select>
        </div>
    );
}

export default Difficulty;