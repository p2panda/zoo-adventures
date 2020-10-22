import React from "react";
import { Link } from "react-router-dom";

export default function EventDetails() {
  return (
    <div>
      <h3>pandaparty</h3>
      <p>let's party like pandas would!</p>
      <p>starting: tomorrow</p>
      <p>
        <Link to="/">back to eventslisting</Link>
      </p>
    </div>
  );
}
