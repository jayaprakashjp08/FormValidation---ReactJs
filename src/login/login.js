import React, { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import "./login.css";
import { set } from "react-hook-form";
import { borderColor } from "@mui/system";

export default function Login() {
  const [userNameError, setUserNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [userNameFieldError, setUserNameFieldError] = useState(false);
  const [passwordFieldError, setPasswordFieldError] = useState(false);
  const [userName, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);

  const handleLogin = async () => {
    if (!Boolean(userName)) {
      setUserNameFieldError(true);
    }
    if (!Boolean(password)) {
      setPasswordFieldError(true);
    } else {
      await axios
        .post(
          "http://localhost:3001/api/v1/users/doLogin",
          { email: userName, password: password },
          {
            headers: {
              authorization: "Basic",
              "Content-Type": "application/json",
            },
          }
        )
        .then((data) => {
          setResponseMessage(data.data.message);
          if (data.data.statusCode === 200) {
            alert(data.data.message);
          } else if (data.data.statusCode === 406) {
            setInvalidCredentials(true);
          } else if (data.data.statusCode === 401) {
            setUserNameFieldError(true);
            console.log(responseMessage);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleOnchange = (label, text) => {
    setInvalidCredentials(false);
    setResponseMessage(null);
    if (label === "userName") {
      setUserName(text);
      setUserNameFieldError(false);
    }
    if (label === "password") {
      setPassword(text);
      setPasswordFieldError(false);
    }
  };

  return (
    <div className="body">
      <div className="login-wrapper">
        <h1>Login</h1>
        <form className="form">
          <div className="container">
            <TextField
              required
              error={userNameError || userNameFieldError || invalidCredentials}
              id="standard-basic"
              label="Username"
              variant="standard"
              helperText={userNameError ? "Invalid Username" : ""}
              helperText={
                Boolean(responseMessage) && userNameFieldError
                  ? responseMessage
                  : userNameFieldError
                  ? "Please fill username"
                  : ""
              }
              onChange={(event) =>
                handleOnchange("userName", event.target.value)
              }
            />
          </div>
          <div className="container">
            <TextField
              error={passwordFieldError || passwordError || invalidCredentials}
              required
              id="standard-basic"
              label="Password"
              variant="standard"
              type="password"
              helperText={passwordError ? "Invalid Password" : ""}
              helperText={passwordFieldError ? "Please fill password" : ""}
              helperText={
                Boolean(responseMessage) && passwordFieldError
                  ? responseMessage
                  : passwordFieldError
                  ? "Please fill password"
                  : ""
              }
              onChange={(event) =>
                handleOnchange("password", event.target.value)
              }
            />
          </div>
          <div className="button">
            <Button
              variant="outlined"
              style={{
                backgroundColor: "red",
                color: "white",
                borderColor: "red",
                marginRight: "20px",
              }}
            >
              signUp
            </Button>
            <Button variant="contained" onClick={handleLogin}>
              login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
