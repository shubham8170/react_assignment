import { useEffect, useState } from "react";
import { Follower, Following } from "../Friends";
import { MyPost } from "../MyPost";
import { followUser, getSinglePosts } from "../../../api";
import {handleGetFollower, handleGetFollowing} from '../../../api/post'

export const SocialBar = () => {
  const [postData, setPostData] = useState([]);
  const currentUser = localStorage.getItem("@twinphy-user");
  const [follower, setfollower] = useState();
  const [following, setfollowing] = useState()
  const fetchPosts = () => {
    getSinglePosts()
      .then((res) => {
        setPostData(
          res?.data?.data
        );
      })
      .catch((err) => console.log(err));
  };

  const handleFollower = () => {
    setTab({
      post: false,
      followers: true,
      following: false,
    });
  };

  const getFollower = () => {
    // setTab({
    //   post: false,
    //   followers: true,
    //   following: false,
    // });
    handleGetFollower().then((data)=>{
      console.log(data);
      setfollower(data)
    }) 
  };

  const getFollowing = () => {
    // setTab({
    //   post: false,
    //   followers: true,
    //   following: false,
    // });
    handleGetFollowing().then((data)=>{
      console.log(data);
      setfollowing(data)
    }) 
  };

  useEffect(() => {
    fetchPosts();
    getFollower();
    getFollowing();
  }, []);

  const [tab, setTab] = useState({
    post: true,
    followers: false,
    following: false,
  });


  const handlePost = () => {
    setTab({
      post: true,
      followers: false,
      following: false,
    });
  };

 

  const handleFollowing = () => {
    setTab({
      post: false,
      followers: false,
      following: true,
    });
  };

  const handleFollowUser = (user) => {
    followUser(user)
      .then((res) => {
        const storedData = localStorage.getItem("@twinphy-user");
        storedData.followings = res?.data?.followings;
        storedData.followers = res?.data?.followers;
        localStorage.setItem("@twinphy-user", JSON.stringify(storedData));
        fetchPosts();
      })
      .catch((err) => console.log(err));
  };

  const userId =localStorage.getItem("@twinphy-user");

  return (
    <>
      <div className="social-bar">
        <ul className="nav" role="tablist">
          <li className="nav-item">
            <button
              className={`nav-link ${tab?.post && "active"}`}
              onClick={handlePost}
            >
              <h4>{postData?.length}</h4>
              <span>Post</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${tab?.followers && "active"}`}
              onClick={handleFollower}
            >
              <h4>{follower?.length}</h4>
              <span>Follower</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${tab?.following && "active"}`}
              onClick={handleFollowing}
            >
              <h4>{following?.length}</h4>
              <span>Following</span>
            </button>
          </li>
        </ul>
      </div>
      <div className="tab-content" id="tab-tabContent">
        {/* <!-- Tab Content for "Post" --> */}
        {tab?.post && (
          <div className="tab-pane active">
            <MyPost postData={postData} />
          </div>
        )}

        {tab?.followers && (
          <div className="tab-pane active">
            <Follower
              followers={follower}
              handleFollowUser={handleFollowUser}
            />
          </div>
        )}
        {tab?.following && (
          <div className="tab-pane active">
            <Following
              followings={following}
              handleFollowUser={handleFollowUser}
            />
          </div>
        )}
      </div>
    </>
  );
};
