import axios from 'axios';
const GOOGLE_URL=process.env.REACT_APP_ENV === 'local'
? 'https://twinphycontest.web.app'
: 'https://twinphycontest.web.app';

const BASE_URL =
  process.env.REACT_APP_ENV === "local"
    ? "http://localhost:8080/api" : "http://localhost:8080/api"

// const BASE_URL =
//   process.env.REACT_APP_ENV === "local"
//     ? "https://3586-103-215-224-141.ngrok-free.app" : "https://3586-103-215-224-141.ngrok-free.app"

  //   const BASE_URL =
  // process.env.REACT_APP_ENV === "local"
  //   ? "https://busy-puce-jellyfish-veil.cyclic.app/api" : "https://busy-puce-jellyfish-veil.cyclic.app/api"
  // : "https://13.48.59.123/api";
const makeRequest = async (fn) => {
  return axios
    .get(BASE_URL + "/auths", {
      headers: {
        Authorization: `JWT ${localStorage.getItem("@twinphy-token")}`,
      },
    })
    .then((res) => {
      localStorage.setItem("@twinphy-token", res?.data?.data?.token);
      return fn();
    })
    .catch(() => fn());
};

const config = {
  GOOGLE_URL,
  BASE_URL,
  makeRequest,
};

export default config;
