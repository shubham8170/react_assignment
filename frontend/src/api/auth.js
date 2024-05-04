import axios from "axios";
import config from "./config";
import { debounce } from "lodash";
import { ToastContainer, toast } from 'react-toastify';

const url = config.BASE_URL + "/auth";
// toast.configure();
export const login = (values) => {
  return axios
    .post(url + "/login", values)
    .then((res) => {
      console.log(res, "reponse");
      return res?.data;
    })
    .catch((err) => {
      console.log(err);
      toast.error(err?.response?.data?.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000
      });
      // return err;
    });
};

export const googleAuth = (values) => {
  return axios
    .post(url + "/login/google", values)
    .then((res) => {
      console.log(res, "reponse");
      return res?.data;
    })
    .catch((err) => {
      console.log(err);
      toast.error(err?.response?.data?.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000
      });
      return err;
    });
};

export const signup = (values) => {
  return axios
    .post(url + "/register", values)
    .then((res) => {
      return res?.data;
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message || err?.response?.data?.errors[0]?.msg, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000
      });
      return err;
    });
};

export const googleLogin = () => {
  return axios.get(config.GOOGLE_URL + "/profile").then((res) => {});
};

export const avatarUpload = (values) => {
  return axios
    .post(config.BASE_URL + "/upload", values)
    .then((res) => {
      return res.data?.data?.Location;
    })
    .catch((err) => {
      return err;
    });
};
export const editAvatar = (values) => {
  return axios
    .post(config.BASE_URL + "/upload", values)
    .then((res) => {
      return res.data?.data?.Location;
    })
    .catch((err) => {
      return err;
    });
};


export const debouncedUserName = debounce((e) => {
  return axios
    .get("http://13.48.59.123:5001/api/users")
    .then((res) => {
      const names = res.data?.data?.userData.map((item) => item?.userName);
      const result = names.includes(e.target.value);
      return result;
    })
    .catch((err) => console.log(err));
}, 300);
