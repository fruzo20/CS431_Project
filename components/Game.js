import React from "react";
import {divMoney} from "./Logic";
import { useState } from "react";

const t_styles = {
    width: '300px',
    margin: '10px auto',
    textAlign: 'center', 
};

const p_styles ={
    width: "300px",
    margin: "10px auto",
    textAlign: 'center', 
}

const h_style = {
    background:" #aa0420",
    color: "white",
    margin: "8px 0",
    border: "black",
    cursor: "pointer",
    width: "15%",
    textAlign: 'center',
    margin: '20px auto',
}

const b_style ={
    background:"#bb3420",
    color: "white",
    margin: "8px 0",
    border: "black",
    cursor: "pointer",
    width: "15%",
    textAlign: 'center',
    margin: '20px auto',
}

const display_style={
    textAlign: 'center',
    margin: '20px auto',
}

const background = {
    background:"#cc99ff", 
    padding: "5px"
}

const pa_styles = {
    textAlign: 'center',  
    padding: "10px",
}


function Game(){

    const [buttonText_y, setButtonText_y] = useState("Yes");
    const [buttonText_n, setButtonText_n] = useState("No");

    const changeText_y = (text) => setButtonText_y(text);
    const changeText_n = (text) => setButtonText_n(text);

    const [offered_money, dict_money] = divMoney(); 

    return(
        <div style={background}>
            <h1  style={t_styles}>Dictator Game</h1>
            <h2 style={t_styles}>Rules:</h2>
            <p style={p_styles}>
                The dictator is offering you a certain amount of money. You can either accpet the offer and BOTH you and the 
                dictator will get the money. You also may deny the offer and NEITHER you or the dictator will get money. The choice
                is yours. 
            </p>
            <h3 style={h_style}>The Dictator's offer is below, will you accept?</h3>
            <div style={t_styles}>
                <button onClick={() => changeText_y("You get the offered money! Click PLAY AGAIN to restart")}>{buttonText_y}</button>
                <button onClick={() => changeText_n("You and the dictator get nothing!  Click PLAY AGAIN to restart")}>{buttonText_n}</button>
            </div>
            <form>
                <table style={b_style}>
                    <tbody>
                        <tr>
                            <td>The Dictator has: {dict_money}</td>
                            <td>The Dictator is offering: {offered_money}</td>
                        </tr>
                    </tbody> 
                </table>  
                <div style={pa_styles}>
                    <button>Play Again?</button>
                </div>              
            </form>
        </div>
    );
}
export default Game; 