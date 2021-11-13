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

const [offered_money, dict_money] = divMoney(); 

export default class Game extends React.Component {

    constructor(){
        super(); 
        this.state = {value:""};
        this.onChange = this.onChange.bind(this); 
        this.add = this.add.bind(this); 
    }

    add() {
        this.setState({ value:this.state.value});
        if(this.state.value === "yes"){
            this.setState({ value:"YES_STATE"});}
        if(this.state.value === "no"){
            this.setState({ value:"NO_STATE"});}
    }

    onChange(e) {
        const desc = /^[yesno\b]+$/;
        if(e.target.value === "" || desc.test(e.target.value)){
            this.setState({ value: e.target.value });
        }
        else{
            this.state = {value:""}; 
        }
    }

    refreshPage(){
        window.location.reload(false);
    }

    render () { 

        return(

        <body style={background}>
            <h1  style={t_styles}>Dictator Game</h1>
            <h2 style={t_styles}>Rules:</h2>
            <p style={p_styles}>
                The dictator is offering you a certain amount of money. You can either accpet the offer and BOTH you and the 
                dictator will get the money. You also may deny the offer and NEITHER you or the dictator will get money. The choice
                is yours. 
            </p>
            <h3 style={h_style}>The Dictator's offer is below, will you accept?</h3>
            <form>
            <table style={b_style}>
                <tbody>
                    <tr>
                        <td>The Dictator has: {dict_money}</td>
                        <td>The Dictator is offering: {offered_money}</td>
                    </tr>
                </tbody> 
            </table>                
            </form>
            <div className="add-item" style = {t_styles}>
                <input type="text" className="add-item__input" onChange={this.onChange} placeholder={"Enter yes or no"}/>
                <button disabled={!this.state.value} className="add-item__button" onClick={this.add}>Submit</button>
            </div>
            {this.state.value === "YES_STATE"?
                <div style={pa_styles}>
                    <p>You accepted the offer, you get what the Dictator was giving away.</p>
                    <button onClick={this.refreshPage} disabled={!this.state.value}>Play Again?</button>
                </div>
                : null
            }
            { this.state.value === "NO_STATE"?
                <div style={pa_styles}>
                    <p>You declined the offer, now you and the Dictator get nothing.</p>
                    <button onClick={this.refreshPage} disabled={!this.state.value}>Play Again?</button>
                </div>
                : null
            }
          </body>
        );
    }
}
