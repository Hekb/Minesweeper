import React from 'react';
import "./display.scss";

interface NumberDisplay{
    value: number;
}

const Number: React.FC<NumberDisplay> = ({value}) => {
    return <div className="numberDisplay">{value < 0 ? `-${Math.abs(value).toString().padStart(2,'0')}` : value.toString().padStart(3, '0')}</div>
}

export default Number;