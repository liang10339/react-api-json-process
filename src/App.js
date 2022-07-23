import React from "react";
import {Routes, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Statics from "./components/statics";

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            José DE PAULA goes the distance easily
          </Link>
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Statics/>} />
          </Routes>
        </div>
    </div>
  );
}

export default App;
