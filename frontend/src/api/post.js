import axios from "axios";
import config from "./config";
import { ToastContainer, toast } from 'react-toastify';

const token = localStorage.getItem('@twinphy-token');
const userId = localStorage.getItem('@twinphy-user')?.replace(/"/g, '');
const url = config.BASE_URL + "/post/getposts";
const apiConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const getSinglePosts = () => {
  return config.makeRequest(() => {
    return axios
      .get(`${url}/${localStorage.getItem("@twinphy-user")}`)
      .then((res) => res)
      .catch((err) => console.log(err));
  });
};

export const handleAddPost = (values) => {
  const url = config.BASE_URL + `/post/addpost/${userId}`;
  return config.makeRequest(() => {
    return axios
      .post(url,values,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Response:", res.data);
        return res.data;
      })
      .catch((error) => {
        console.error("Error:", error);
        throw error;
      });
  });
};

export const getPosts = () => {
  return config.makeRequest(() => {
    return axios 
      .get(url, apiConfig)
      .then((res) => res)
      .catch((err) => console.log(err));
  });
};
export const reportPost = (postId, description, user_id) => {
  return config.makeRequest(() => {
    return axios
      .post(`${config.BASE_URL}/reports/${postId}`, { description, user_id })
      .then((res) => {
        console.log(res.data);
        return res.data;
      })
      .catch((err) => console.log(err));
  });
};


export const handlePostLikes=(post_id, user_id)=>{
  const url = config.BASE_URL + `/post/like/`;
  const value = {postId:post_id, userId};
  return config.makeRequest(()=>{
    return axios 
    .post(url,value,apiConfig)
    .then((res)=>{
      console.log(res?.data);
      return res?.data
    })
    .catch((err)=>console.log(err))
  })
}

export const handleGetFollower = ()=>{
  const url = config.BASE_URL + `/follow/getfollower/`;
  return config.makeRequest(()=>{
    return axios 
    .get(url,apiConfig)
    .then((res)=>{
      // console.log(res?.data?.data);
      return res?.data?.data
    })
    .catch((err)=>console.log(err))
  })
}

export const handlePostComments=(post_id, comment)=>{
  const url = config.BASE_URL + `/post/comment/`;
  const value = {postId:post_id, comment:comment };
  return config.makeRequest(()=>{
    return axios 
    .post(url,value,apiConfig)
    .then((res)=>{
      console.log(res?.data);
      return res?.data
    })
    .catch((err)=>{
      toast.error(err?.response?.data?.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000
      });
    })
  })
}

export const getPostDetails=(post_id)=>{
  const url = config.BASE_URL + `/post/postdetail/${post_id}`;
  return config.makeRequest(()=>{
    return axios 
    .get(url,apiConfig)
    .then((res)=>{
      console.log(res?.data);
      return res?.data
    })
    .catch((err)=>{
      toast.error(err?.response?.data?.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000
      });
    })
  })
}

export const handleGetFollowing = ()=>{
  const url = config.BASE_URL + `/follow/getfollowing/`;
  return config.makeRequest(()=>{
    return axios 
    .get(url,apiConfig)
    .then((res)=>{
      // console.log(res?.data?.data);
      return res?.data?.data
    })
    .catch((err)=>console.log(err))
  })
}