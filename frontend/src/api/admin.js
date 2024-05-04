import axios from "axios";
import config from "./config";
import { ToastContainer, toast } from 'react-toastify';
const token = localStorage.getItem('admintoken');
const adminId = localStorage.getItem('adminid')?.replace(/"/g, '');
const apiConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const url = config.BASE_URL;
// toast.configure();
export const login = (values) => {
  return axios
    .post(url + "/admin/login", values)
    .then((res) => {
      console.log(res, "reponse");
      return res?.data?.data;
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
    .post(url + "/admin/register", values)
    .then((res) => {
      return res?.data?.data;
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message || err?.response?.data?.errors[0]?.msg, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000
      });
      return err;
    });
};

export const getusers = (pageNo) => {
  return axios
    .get(url + `/admin/userdetail?page=${pageNo}&limit=10`, apiConfig)
    .then((res) => {
      return res?.data?.data;
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message || err?.response?.data?.errors[0]?.msg, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000
      });
      return err;
    });
};

export const suspendUser = (userId) => {
  return axios
    .patch(url + `/admin/suspenduser/${userId}`, apiConfig)
    .then((res) => {
      toast.success(res?.data.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000
      });
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message || err?.response?.data?.errors[0]?.msg, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000
      });
      return err;
    });
};

export const getContest = () => {
  return axios
    .get(url + `/contest/getcontest`, apiConfig)
    .then((res) => {
      return res?.data?.data;
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message || err?.response?.data?.errors[0]?.msg, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000
      });
      return err;
    });
};

export const getExpiredContest = () => {
  return axios
    .get(url + `/contest/getexpiredcontest`, apiConfig)
    .then((res) => {
      return res?.data?.data;
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message || err?.response?.data?.errors[0]?.msg, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000
      });
      return err;
    });
};

export const createContest = (data) => {
  return axios
    .post(url + `/contest/create`,data, apiConfig)
    .then((res) => {
      toast.success(res?.data?.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000
      });
      return res?.data?.data;
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message || err?.response?.data?.errors[0]?.msg, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000
      });
      return err;
    });
};
