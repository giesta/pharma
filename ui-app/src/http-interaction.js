import axios from "axios";

const instance = axios.create({
  baseURL: "https://rxnav.nlm.nih.gov/REST",
  headers: {
    "Content-type": "application/json",
  }
});
export default instance;