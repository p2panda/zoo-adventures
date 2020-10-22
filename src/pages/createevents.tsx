import React from "react";
import { Link } from "react-router-dom";

const date = new Date(Date.now()).toISOString().slice(0, 10);

export default function CreateEvents() {
  return (
    <div>
      <h1>p2paradies, p2panda, p2parachute: hallo was geht!</h1>

      <p>create an event ^^</p>

      <form>
        <div>
          <p>
            <label>Eventtitle: </label>
            <input type="text" name="eventtitle" />
          </p>
          <p>
            <label>Description (optional): </label>
            <textarea name="description">what's the plan?</textarea>
          </p>
          <p>
            <label>start on:</label>
            <input type="date" name="event-start" value={date}></input>
          </p>
          <p>
            <label>end on:</label>
            <input type="date" name="event-end" value={date}></input>
          </p>
          <input type="submit" value="Submit" />
        </div>
      </form>

      <p>
        <Link to="/">back to landing page</Link>
      </p>
    </div>
  );
}
