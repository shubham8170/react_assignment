import axios from "axios";
import config from "./config";
import { ToastContainer, toast } from 'react-toastify';

const token = localStorage.getItem('@twinphy-token')
console.log('config.BASE_URL  ', config.BASE_URL );
// const url = config.BASE_URL + "/"+ userId;
const url = config.BASE_URL + "/auth/users";
const apiConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const getAllUser = () => {
  return config.makeRequest(() => {
    return axios
      .get(url, apiConfig)
      .then((res) => res)
      .catch((err) => console.log(err));
  });
};

export const getSingleUser = (userid="") => {
  return config.makeRequest(() => {
    const userId = userid.length>0? userid: localStorage.getItem("@twinphy-user")?.replace(/"/g, '');
    const url = config.BASE_URL + `/auth/${userId}`;
    return axios
      .get(url , apiConfig)
      .then((res) => {
       return res?.data?.data
      })
      .catch((err) => console.log(err));
  });
};

export const updateUser = (value) => {
  const url = config.BASE_URL + "/auth";

  return config.makeRequest(() => {
    const userId = localStorage.getItem("@twinphy-user")?.replace(/"/g, '');;
    const token = localStorage.getItem("@twinphy-token");

    const headers = {
      Authorization: `JWT ${token}`,
    };

    return axios
      .patch(url + `/${userId}`, value, { headers })
      .then((res) => res?.data?.data)
      .catch((err) => console.log(err));
  });
};

export const updateUsername = (value) => {
  const url = config.BASE_URL + "/auth/changeusername";

  return config.makeRequest(() => {
    const userId = localStorage.getItem("@twinphy-user")?.replace(/"/g, '');;
    const token = localStorage.getItem("@twinphy-token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return axios
      .patch(url, value, apiConfig)
      .then((res) => {
        toast.success(res?.data?.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000
        });
        return res?.data?.data;
      })
      .catch((err) => {
        console.error(err);
        toast.error(err?.response?.data?.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000
        });
      });
  });
};

export const searchUser=(name)=>{
  const url = config.BASE_URL + "/auth/search";
  return config.makeRequest(() => {
    const userId =localStorage.getItem("@twinphy-user");
    const token = localStorage.getItem("@twinphy-token");
    const headers = {
      Authorization: `JWT ${token}`,
    };
    const data = {
      username: name
    };
    return axios
      .post(url, data, { headers })
      .then((res) => {
      console.log(res);
      return res?.data?.search
      })
      .catch((err) => {
        return err;
      });
  });
}

export const blockUser=(block_user_id)=>{
  return config.makeRequest(() => {
    const userId =localStorage.getItem("@twinphy-user");
    const token = localStorage.getItem("@twinphy-token");

    const headers = {
      Authorization: `JWT ${token}`,
    };

    const data = {
      block_user_id
    };

    return axios
      .patch(url + `/block/${userId}`, data, { headers })
      .then((res) => res?.data)
      .catch((err) => {
        return err;
      });
  });
}

export const followUser=(follow_user_id)=>{
  return config.makeRequest(() => {
    const userId = localStorage.getItem("@twinphy-user")?.replace(/"/g, '');
    const token = localStorage.getItem("@twinphy-token");

    const data ={
      followerId:userId,
      followingId:follow_user_id,
      followerName:"me"
  }
  const url = config.BASE_URL + `/follow/followrequest/${userId}`
    return axios
      .post(url, data, apiConfig)
      .then((res) => res?.data)
      .catch((err) => {
        return err;
      });
  });
}

export const getWeather=  ()=>{
  return config.makeRequest(() => {
      return axios
      .get("https://api.weatherapi.com/v1/current.json?key=867ac05f4f8b42fb93d172436240105 &q=Kolkata&aqi=no")
      .then((res) => res?.data)
      .catch((err) => {
        return err;
      });
  });
}

export const getGitProject = (username, token)=>{
  const headers =   {Authorization: `token ${token}`}
  return axios
  .get(`https://api.github.com/users/${username}/repos`, { headers })
  .then((res) => res?.data)
  .catch((err) => {
    return err;
  });
}
