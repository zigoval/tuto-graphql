import React from "react";
import { NavLink } from "react-router-dom";
import "./MainNavigation.css";

const mainNavigation = props => (
  <header className="mainNavigation">
    <div className="mainNavigation__logo">
      <h1>EasyEvent</h1>
    </div>
    <div className="mainNavigation__items">
      <ul>
        <li>
          <NavLink to="/auth">Connexion</NavLink>
        </li>
        <li>
          <NavLink to="/events">Events</NavLink>
        </li>
        <li>
          <NavLink to="/bookings">Bookings</NavLink>
        </li>
      </ul>
    </div>
  </header>
);

export default mainNavigation;
