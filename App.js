import React, { Component } from "react";
import "./App.css";
//All paths imported from .jsx files
import MainPage from "./pages";
import ErrorPage from "./pages/404err";
import Game from "./pages/blackjack";
import DictGame from "./pages/dictator";
import Directions from "./pages/bjackInstruct";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate
} from "react-router-dom";

class App extends Component {
  render() {
    return (
      //wrapper for routes to make routes work
      //need to define a path and an element that the paths will lead to
      //basename="/vspak22/build"
      <Router basename="/vspak22/build">
        <Routes>
          <Route exact path="/" element={<MainPage />} />
          <Route exact path="/blackjack" element={<Game />} />
          <Route exact path="/dictator" element={<DictGame />} />
          <Route exact path="/bjackinstruct" element={<Directions />} />
          <Route exact path="404" element={<ErrorPage />} />
          <useNavigate to="/404" />
        </Routes>
      </Router>
    );
  }
}

export default App;