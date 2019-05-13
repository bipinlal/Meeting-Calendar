import React, { Component } from "react";
import "./App.css";
import Meeting from "./Components/Meeting-Calender";
export default class App extends Component {
  constructor(props) {
    super(props);

  }
 
  render() {
    
    return (
      <>
      <Meeting/>        
      </>
    );
  }
}
