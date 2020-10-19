import React from "react";
import { Link } from "react-router-dom";

export default function CreateEvents() {
  return (
    <div>
      <h1>p2paradies, p2panda, p2parachute: hallo was geht!</h1>

      <p>create an event ^^</p>

      <form>
        <label>
          Eventtitle:
          <input type="text" name="event" />
        </label>
        <input type="submit" value="Submit" />
      </form>

      <p>
        <Link to="/">back to landing page</Link>
      </p>
    </div>
  );
}
