import React, { useState, useRef, useContext, useEffect } from "react";
import Modal from "../components/Modal";
import Backdrop from "../components/BackDrop";
import AuthContext from "../context/auth-context";
import "./Events.css";

export default () => {
  const [isCreating, setIsCreating] = useState();
  const [events, setEvents] = useState([]);

  const authContext = useContext(AuthContext);

  const titleEl = useRef();
  const priceEl = useRef();
  const dateEl = useRef();
  const descriptionEl = useRef();

  const modalConfirmHandle = () => {
    const title = titleEl.current.value;
    const price = +priceEl.current.value;
    const date = dateEl.current.value;
    const description = descriptionEl.current.value;

    if (
      title.trim().length === 0 ||
      price < 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    )
      return;
    const requestBody = {
      query: `
            mutation {
                createEvent(eventInput: {title:"${title}", description:"${description}", price:${price}, date:"${date}"}){
                    _id
                    title
                    description
                    price
                    date
                    creator {
                      _id
                      email
                    }
                }
            }
        `
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authContext.token}`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log("resData", resData);
        setIsCreating(false);
        fetchEvents();
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    const requestBody = {
      query: `
            query {
                events{
                    _id
                    title
                    description
                    price
                    date
                    creator {
                      _id
                      email
                    }
                }
            }
        `
    };
    console.log(JSON.stringify(requestBody));

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
        const events = resData.data.events;
        setEvents(events);
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      {isCreating && (
        <>
          <Backdrop />
          <Modal
            title="Add Event"
            onCancel={() => setIsCreating(false)}
            onConfirm={modalConfirmHandle}
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={titleEl} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={priceEl} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={dateEl} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea rows="4" id="description" ref={descriptionEl} />
              </div>
            </form>
          </Modal>
        </>
      )}
      {authContext.token && (
        <div className="events-control">
          <p>Share your own Event !</p>
          <button className="btn" onClick={() => setIsCreating(true)}>
            Create Event
          </button>
        </div>
      )}
      <section className="">
        <ul className="events__list">
          {events.map(event => (
            <li className="events__list-item" key={event._id}>
              {event.title}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};
