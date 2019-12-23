import React from "react";
import { NavLink } from "react-router-dom";

import AuthContext from "../context/auth-context";
import "./MainNavigation.css";

const mainNavigation = props => (
  <AuthContext.Consumer>
    {context => {
      return (
        <header className="mainNavigation">
          <div className="mainNavigation__logo">
            <h1>EasyEvent</h1>
          </div>
          <div className="mainNavigation__items">
            <ul>
              {context.token || (
                <li>
                  <NavLink to="/auth">Connexion</NavLink>
                </li>
              )}
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {context.token && (
                <li>
                  <NavLink to="/bookings">Bookings</NavLink>
                </li>
              )}
            </ul>
          </div>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;
