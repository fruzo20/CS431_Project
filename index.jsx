import React from "react"; 
import { Link } from "react-router-dom";

const MainPage = () => {
  return (
      <div class="center">
        <h3>Welcome to Our Site!</h3>
        <small>Please make actions that would reflect closest to your actual response.</small>
        <br />
        <small>Your actions will be recorded for data analysis.</small>
        <br />
        <br />
        <Link to="/bjackinstruct">
          <button type="button">
            Play BlackJack!
          </button>
        </Link>
        <br />
        <br />
        <Link to="/dictator">
          <button type="button">
            Play the Dictator Game!
          </button>
        </Link>
      </div>
  );
};
export default MainPage;