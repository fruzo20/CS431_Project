import React from "react";
import {divMoney} from "./Logic";
import { uploadFile } from 'react-s3';
import AWS from 'aws-sdk'
const BrowserFS = require('browserfs');

//Source: https://javascript.plainenglish.io/how-to-create-download-and-upload-files-in-react-apps-80893da4247a

const t_styles = {
    width: '300px',
    margin: '10px auto',
    textAlign: 'center', 
};

const p_styles ={
    width: "300px",
    margin: "10px auto",
    textAlign: 'center', 
};

const h_style = {
    background:" #aa0420",
    color: "white",
    margin: "8px 0",
    border: "black",
    cursor: "pointer",
    width: "15%",
    textAlign: 'center',
    margin: '20px auto',
};

const b_style ={
    background:"#bb3420",
    color: "white",
    margin: "8px 0",
    border: "black",
    cursor: "pointer",
    width: "15%",
    textAlign: 'center',
    margin: '20px auto',
};

const display_style={
    textAlign: 'center',
    margin: '20px auto',
};

const background = {
    background:"#cc99ff", 
    padding: "5px"
};

const pa_styles = {
    textAlign: 'center',  
    padding: "10px",
};

const [offered_money, dict_money] = divMoney(); 

export default class Game extends React.Component {

    constructor(){
        super(); 
        this.state = {fileDownloadUrl: null, value:"", money: offered_money};
        this.onChange = this.onChange.bind(this); 
        this.add = this.add.bind(this); 

        this.download = this.download.bind(this);
        this.fileName = "dictator_" + Math.floor(Math.random()*10000000000)

        this.config1 = {
            bucketName: 'bigbucketboyz',
            region: 'us-east-2',
            accessKeyId: 'AKIAVGCSL7QH5KFDTDET',
            secretAccessKey: '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',
        }

        this.config2 = {
            bucketName: "dictdestinationbucket",
            region:"us-east-2",
            accessKeyId: 'AKIAVGCSL7QH5KFDTDET',
            secretAccessKey: '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',
        }

        this.s3 = new AWS.S3({params: {Bucket:'bigbucketboyz'}, region:"us-east-2", accessKeyId:'AKIAVGCSL7QH5KFDTDET', 
        secretAccessKey:'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'})

        this.promise = new Promise((resolve, reject) => {
        })
  }

    handleUpload(file, file2, config, params){
        uploadFile(file, config)
        .then(() => (uploadFile(file2,config))
        .then(() => (this.s3.copyObject(params, function(err, data){
            if(err) console.log(err, err.stack);
            else    console.log(data);})))      
        .catch(err => console.error(err))) 

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

    makeCSV(input){
        let csv = ''; 

        input.forEach(value =>{
            value.forEach((item, i) => {
                let innerVal = item === null ? "" : item.toString();
                let result = innerVal.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0){
                    result = '"' + result + '"'
                }
                if (i > 0) {csv += ','}
                csv += result;
                })
                csv += '\n'; 
            })
        return csv; 
    }

    
    download(event){
        event.preventDefault();

        let output;
        let contents = []; 
        contents.push(["desc, "+this.state.value, "offer_money, "+this.state.money]); 

        output = this.makeCSV(contents);

        const blob = new Blob([output]);
        console.log(output)

        const file = {
            name:this.fileName,
        }

        const params = {
            Bucket: "dictdestinationbucket",
            CopySource: "dictdestinationbucket/undefined",
            Key: this.fileName
        }  

        this.handleUpload(blob, file, this.config2, params)

        this.add(); 
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
            <div style = {t_styles}>
                <input type="text" className="add-item__input" onChange={this.onChange} placeholder={"Enter yes or no"}/>
                <button disabled={!this.state.value} onClick={this.download}>Submit</button>
                <a className="hidden" download={'dictator.csv'} href={this.state.fileDownloadUrl} ref={e=>this.dofileDownload = e}></a>
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
