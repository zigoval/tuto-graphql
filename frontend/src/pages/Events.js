import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";
import Backdrop from "../components/BackDrop";
import "./Events.css";

export default () => {
  const [isCreating, setIsCreating] = useState();

  const modalConfirmHandle = () => {};
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
            <p>test</p>
          </Modal>
        </>
      )}
      <div className="events-control">
        <p>Share your own Event !</p>
        <button className="btn" onClick={() => setIsCreating(true)}>
          Create Event
        </button>
      </div>
    </>
  );
};
