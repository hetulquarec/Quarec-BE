import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [uData, setUData] = useState([]);

  const val = async () => {
    try {
      const res = await fetch("/gallery", {
        method: "GET",
        headers: {
          Accept: "appllication/json",
          "Content-Type": "form-data",
        },
        credentials: "include",
      }).then((response) => setUData(response));

      const data = res.json();
      console.log(data);

      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (err) {}
  };
  const ren = () => {
    val();
  };
  useEffect(() => {
    ren();
  }, []);
  console.log("uData**********************", uData && uData);

  return (
    <div className="App">
      {uData &&
        uData.map((e) => {
          return (
            <img src  = {e.gallery } />
            // console.log("--------e------", e)
          );
        })}
    </div>
  );
}

export default App;
