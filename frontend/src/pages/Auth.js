import React, { useState, useEffect, useRef } from "react";
import "./Auth.css";
import AuthContext from "../context/auth-context";
export default () => {
  const [isLogging, setIsLogging] = useState(true);

  const emailEl = useRef();
  const passwordEl = useRef();

  const switchHandler = () => {
    setIsLogging(!isLogging);
  };

  const submitHandler = e => {
    e.preventDefault();
    const email = emailEl.current.value;
    const password = passwordEl.current.value;
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
            query {
                login(email: "${email}", password:"${password}"){
                    userId
                    token
                    tokenExpiration
                }
            }
        `
    };

    if (!isLogging) {
      requestBody = {
        query: `
              mutation {
                  createUser(userInput:{email:"${email}", password:"${password}"}){
                      _id
                      email
                  }
              }
              `
      };
    }

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        if (resData.data.login.token) {
          AuthContext.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }
      })
      .catch(err => console.log(err));
  };
  return (
    <form className="auth-form" onSubmit={submitHandler}>
      <div className="form-control">
        <label htmlFor="email">E-mail</label>
        <input type="email" id="email" ref={emailEl} />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordEl} />
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={switchHandler}>
          Switch to {isLogging ? "Signup" : "Login"}
        </button>
      </div>
    </form>
  );
};
