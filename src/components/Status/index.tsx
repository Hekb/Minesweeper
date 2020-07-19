import React from "react";
import "./Status.scss"

interface StatusProps{
    message: String;
    color: String
}

const Status: React.FC<StatusProps> = ({message, color}) => {
    return <div className={`status ${color}`}>{message}</div>
}

export default Status;

