import axios from "axios";
var proxyUrl = "https://cors-anywhere.herokuapp.com/"
export default axios.create({
  baseURL: proxyUrl+"https://polastats.herokuapp.com/",
  headers: {
    "Content-type": "application/json"
  }
});