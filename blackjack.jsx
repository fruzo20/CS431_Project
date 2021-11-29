import React from "react";
import { Link } from "react-router-dom";
import { uploadFile } from 'react-s3';
import AWS from 'aws-sdk';

class Game extends React.Component {
    constructor(props) {
      super(props);

      this.download = this.download.bind(this);
      this.fileName = "blackjack_" + Math.floor(Math.random()*10000000000)

        this.config2 = {
            bucketName: "bigbucketboyz",
            region:"us-east-2",
            accessKeyId: 'ACCESS-ID',
            secretAccessKey: 'SECRET-ACCESS-ID',
        }

        this.s3 = new AWS.S3({params: {Bucket:'bigbucketboyz'}, region:"us-east-2", accessKeyId:'ACCESS-ID', 
        secretAccessKey:'SECRET-ACCESS-ID'})
    this.startHand = 0;
    this.startDeal = 0;
      
      this.state = {
        deck: [],
        dealer: null,
        player: null,
        value: 0,
        inputValue: '',
        currentBet: null,
        gameOver: false,
        message: null,
        render: false
      };
    }

    handleUpload(file, file2, config, params){
        uploadFile(file, config)
        .then(() => (uploadFile(file2,config))
        .then(() => (this.s3.copyObject(params, function(err, data){
            if(err) console.log(err, err.stack);
            else    console.log(data);})))      
        .catch(err => console.error(err))) 

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
  
    generateDeck() {
      const cards = [2,3,4,5,6,7,8,9,10,'J','Q','K','A'];
      const suits = ['♦','♣','♥','♠'];
      const deck = [];
      for (let i = 0; i < cards.length; i++) {
        for (let j = 0; j < suits.length; j++) {
          deck.push({number: cards[i], suit: suits[j]});
        }
      }
      return deck;
    }
    
    dealCards(deck) {
      const playerCard1 = this.getRandomCard(deck);
      const dealerCard1 = this.getRandomCard(playerCard1.updatedDeck);
      const playerCard2 = this.getRandomCard(dealerCard1.updatedDeck);    
      const playerStartingHand = [playerCard1.randomCard, playerCard2.randomCard];
      const dealerStartingHand = [dealerCard1.randomCard, {}];
      
      const player = {
        cards: playerStartingHand,
        count: this.getCount(playerStartingHand)
      };
      const dealer = {
        cards: dealerStartingHand,
        count: this.getCount(dealerStartingHand)
      };
      this.startHand = this.getCount(playerStartingHand);
      this.startDeal = this.getCount(dealerStartingHand);
      
      return {updatedDeck: playerCard2.updatedDeck, player, dealer};
    }
  
    startNewGame(type) {
      if (type === 'continue') {
        if (this.state.value > 0) {
          const deck = (this.state.deck.length < 10) ? this.generateDeck() : this.state.deck;
          const { updatedDeck, player, dealer } = this.dealCards(deck);
  
          this.setState({
            deck: updatedDeck,
            dealer,
            player,
            currentBet: null,
            gameOver: false,
            message: null,
            render: false
          });
        } else {
          this.setState({ message: 'Game over! You are broke! Please start a new game.' });
        }
      } else {
        const deck = this.generateDeck();
        const { updatedDeck, player, dealer } = this.dealCards(deck);
  
        this.setState({
          deck: updatedDeck,
          dealer,
          player,
          value: 100,
          inputValue: '',
          currentBet: null,
          gameOver: false,
          message: null,
          render: false
        });
      }
    }
         
    getRandomCard(deck) {
      const updatedDeck = deck;
      const randomIndex = Math.floor(Math.random() * updatedDeck.length);
      const randomCard = updatedDeck[randomIndex];
      updatedDeck.splice(randomIndex, 1);
      return { randomCard, updatedDeck };
    }

    download(){

        let output;
        let contents = []; 
        const winner = this.getWinner(this.state.dealer, this.state.player);
        contents.push(["startVal, "+this.state.value, "startHand, "+this.startHand, "startDeal, "+this.startDeal, "bet, "+this.state.currentBet, "win, "+winner, "endHand, "+this.getCount(this.state.player.cards)]); 

        output = this.makeCSV(contents);

        const blob = new Blob([output]);
        console.log(output)

        const file = {
            name:this.fileName,
        };

        const params = {
            Bucket: "bigbucketboyz",
            CopySource: "bigbucketboyz/undefined",
            Key: this.fileName
        };  

        this.handleUpload(blob, file, this.config2, params);
    }
    
    placeBet() {
      const currentBet = this.state.inputValue;
  
      if (currentBet > this.state.value) {
        this.setState({ message: 'Insufficient funds to bet that amount.' });
      } else if (currentBet % 1 !== 0) {
        this.setState({ message: 'Please bet whole numbers only.' });
      } else {
        // Deduct current bet from value
        const value = this.state.value - currentBet;
        this.setState({ value, inputValue: '', currentBet , render: true});
      }
    }
    
    hit() {
      if (!this.state.gameOver) {
        if (this.state.currentBet) {
          const { randomCard, updatedDeck } = this.getRandomCard(this.state.deck);
          const player = this.state.player;
          player.cards.push(randomCard);
          player.count = this.getCount(player.cards);
  
          if (player.count > 21) {
            this.setState({ player, gameOver: true, message: 'BUST!' });
          } else {
            this.setState({ deck: updatedDeck, player });
          }
        } else {
          this.setState({ message: 'Please place bet.' });
        }
      } else {
        this.setState({ message: 'Game over! Please start a new game.' });
      }
    }
    
    dealerDraw(dealer, deck) {
      const { randomCard, updatedDeck } = this.getRandomCard(deck);
      dealer.cards.push(randomCard);
      dealer.count = this.getCount(dealer.cards);
      return { dealer, updatedDeck };
    }
    
    getCount(cards) {
      const rearranged = [];
      cards.forEach(card => {
        if (card.number === 'A') {
          rearranged.push(card);
        } else if (card.number) {
          rearranged.unshift(card);
        }
        
        
        // (card.number === 'A') ? rearranged.push(card) : rearranged.unshift(card);
      });
      
      return rearranged.reduce((total, card) => {
        if (card.number === 'J' || card.number === 'Q' || card.number === 'K') {
          return total + 10;
        } else if (card.number === 'A') {
          return (total + 11 <= 21) ? total + 11 : total + 1;
        } else {
          return total + card.number;
        }
      }, 0);
    }
    
    stand() {
      if (!this.state.gameOver) {
        // Show dealer's 2nd card
        const randomCard = this.getRandomCard(this.state.deck);
        let deck = randomCard.updatedDeck;
        let dealer = this.state.dealer;
        dealer.cards.pop();
        dealer.cards.push(randomCard.randomCard);
        dealer.count = this.getCount(dealer.cards);
  
        // Keep drawing cards until count is 17 or more
        while(dealer.count < 17) {
          const draw = this.dealerDraw(dealer, deck);
          dealer = draw.dealer;
          deck = draw.updatedDeck;
        }
  
        if (dealer.count > 21) {
          this.setState({
            deck,
            dealer,
            value: this.state.value + this.state.currentBet * 2,
            gameOver: true,
            message: 'Dealer bust! You win!'
          });
        } else {
          const winner = this.getWinner(dealer, this.state.player);
          let value = this.state.value;
          let message;

          if (winner === 'dealer') {
            message = 'Dealer wins... You lost all the money you bet';
          } else if (winner === 'player') {
            value += this.state.currentBet * 2;
            message = 'You won twice your bet!!';
          } else {
            value += this.state.currentBet;
            message = 'Push. You do not lose anything.';
          }
          this.download();
          this.setState({
            deck, 
            dealer,
            value,
            gameOver: true,
            message
          });
        } 
      } else {
        this.setState({ message: 'Game over! Please start a new game.' });
      }
    }
    
    getWinner(dealer, player) {
      if (dealer.count > player.count) {
        return 'dealer';
      } else if (dealer.count < player.count) {
        return 'player';
      } else {
        return 'push';
      }
    }
    
    inputChange(e) {
      const inputValue = +e.target.value;
      this.setState({inputValue});
    }
    
    handleKeyDown(e) {
      const enter = 13;
      console.log(e.keyCode);
      
      if (e.keyCode === enter) {
        this.placeBet();
      }
    }
    
    componentWillMount() {
      this.startNewGame();
      const body = document.querySelector('body');
      body.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    
    render() {
      let dealerCount;
      const card1 = this.state.dealer.cards[0].number;
      const card2 = this.state.dealer.cards[1].number;
      if (card2) {
        dealerCount = this.state.dealer.count;
      } else {
        if (card1 === 'J' || card1 === 'Q' || card1 === 'K') {
          dealerCount = 10;
        } else if (card1 === 'A') {
          dealerCount = 11;
        } else {
          dealerCount = card1;
        }
      }
  
      return (
        <div>
          <div className="buttons">
            <button onClick={() => {this.startNewGame()}}>New Game</button>
            <button onClick={() => {this.hit()}}>Hit</button>
            <button onClick={() => {this.stand()}}>Stand</button>
            <Link to="/">
                <button>
                    Main Page
                </button>
            </Link>
          </div>
          
          <p>Points: { this.state.value }</p>
          {
            !this.state.currentBet ? 
            <div className="input-bet">            
              <form>
                <input type="text" name="bet" placeholder="" value={this.state.inputValue} onChange={this.inputChange.bind(this)}/>
              </form>
              <button onClick={() => {this.placeBet()}}>Place Bet</button>
            </div>
            : null
          }
          {
            this.state.render ?
            <p>Your Bet: {this.state.currentBet}</p>
            : null
          }

          {
            this.state.gameOver ?
            <div className="buttons">
              <button onClick={() => {this.startNewGame('continue')}}>Continue</button>
            </div>
            : null
          }
          <p>Your Hand ({ this.state.player.count })</p>
          <table className="cards">
            <tr>
              { this.state.player.cards.map((card, i) => {
                return <Card key={i} number={card.number} suit={card.suit}/>
              }) }
            </tr>
          </table>
          
          <p>Dealer's Hand ({ this.state.dealer.count })</p>
          <table className="cards">
            <tr>
              { this.state.dealer.cards.map((card, i) => {
                return <Card key={i} number={card.number} suit={card.suit}/>;
              }) }
            </tr>
          </table>
          
          <h2>{ this.state.message }</h2>
        </div>
      );
    }
  };
  
  const Card = ({ number, suit }) => {
    const combo = (number) ? `${number}${suit}` : null;
    const color = (suit === '♦' || suit === '♥') ? 'card-red' : 'card';
    
    return (
      <td>
        <div className={color}>
          { combo }
        </div>
      </td>
    );
  };
  
export default Game;