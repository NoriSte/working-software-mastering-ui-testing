import Axios from "axios";
import React from "react";
import "./App.css";
import { AUTHENTICATE_API_URL, SERVER_URL } from "./constants";
import logo from "./logo.svg";
import {
  GENERIC_ERROR,
  LOADING,
  LOGIN_BUTTON,
  LONG_WAITING,
  PASSWORD_PLACEHOLDER,
  SUCCESS_FEEDBACK,
  UNAUTHORIZED_ERROR,
  USERNAME_PLACEHOLDER
} from "./strings";

/**
 * This app is far from being a well-written React app, its sole purpose is to allow me showing
 * some e2e testing characteristics
 */
function App() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [longWaiting, setLongWaiting] = React.useState(false);

  const onLoginClick = async () => {
    setLoading(true);
    let response;
    const timeoutId = setTimeout(() => setLongWaiting(true), 1000);
    try {
      response = await Axios.post(SERVER_URL + AUTHENTICATE_API_URL, {
        username,
        password
      });
    } catch (e) {
      setError(e.response && e.response.status === 401 ? UNAUTHORIZED_ERROR : GENERIC_ERROR);
      setSuccess(false);
    }
    setLoading(false);
    setLongWaiting(false);
    clearTimeout(timeoutId);

    // success management
    if (response && response.status === 200) {
      setSuccess(true);
    }
  };

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
        <button onClick={onLoginClick}>{LOGIN_BUTTON}</button>
        <span>
          {loading && LOADING}
          {success && SUCCESS_FEEDBACK}
          {error}
        </span>
        <span>{longWaiting && LONG_WAITING}</span>
      </section>
    </div>
  );
}

export default App;
