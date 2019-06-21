import React from "react";
import "./App.css";
import logo from "./logo.svg";
import { LOGIN_BUTTON, PASSWORD_PLACEHOLDER, USERNAME_PLACEHOLDER } from "./strings";

function App() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <section className="App-body">
        <span>Please type</span>
        <input
          placeholder={USERNAME_PLACEHOLDER}
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          placeholder={PASSWORD_PLACEHOLDER}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button>{LOGIN_BUTTON}</button>
      </section>
    </div>
  );
}

export default App;
