import React from "react"; 
import { Link } from "react-router-dom";

const Directions = () => {
  return (
      <div class="center">
        <h3>BlackJack!</h3>
        <h4>
            BlackJack is a simple gambling game where you will be dealt 2 cards and a dealer will also be dealt 2 cards. You see what cards you 
            have been dealt and what cards the dealer has been dealt and then make a bet.
            Be careful though, you don't want to lose because if you do, you lose all the points you bet. To win, you have to get as close to 21
            without going over. If you do go over 21, you lose. You also lose if you have less total value than the dealer. However, if the dealer
            goes over 21, you win twice the amount you bet! Ties between you and the dealer result in you not losing your bet. To play, select "hit" or
            "stand" when the game begins. Press "hit" and you will be given another card, but if you press "stand" you will have you cards and the dealer
            will take their turn to see whether you win or lose.
        </h4>
        <small>
            A majority of the code for BlackJack was taken from Jeff Leu on codepen.
            Find him here: https://codepen.io/jeffleu    
        </ small>
        <br />
        <br />
        <Link to="/blackjack">
          <button type="button">
            Got it! Let's Go!
          </button>
        </Link>
      </div>
  );
};
export default Directions;