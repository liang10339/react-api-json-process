import axios from "axios";

export default axios.create({
  baseURL: "https://statsinsight-code-interview.herokuapp.com/get/Get_Balls_CI",
  headers: {
    "Content-type": "application/json"
  }
});