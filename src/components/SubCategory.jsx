import React from "react";

export default function(props){


    return (
        <div>
        {
            Object.entries(props.row.values.values).map((key) => {
                return <button key={key[0]} onClick={props.function} value={key[0]}>{key[1].label}</button>
            })
        }
        </div>
    );



}