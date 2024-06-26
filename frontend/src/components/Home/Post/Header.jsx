import { Link } from "react-router-dom";
import moment from "moment";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { useEffect, useState } from "react";
import { reportPost, blockUser } from "../../../api";
import { blankImage } from "../../../utils";
import {getSingleUser} from '../../../api/user'

export const Header = ({ time, userId, postId, fetchPosts }) => {
  const currentTime = moment(time).fromNow();

  const [showReportModal, setShowReportModal] = useState(false);
  const [description, setDescription] = useState("");
  const [userData, setuserData] = useState()

  const getuserDetails=()=>{
    getSingleUser(userId).then((data)=>{
      console.log(data);
      setuserData(data)
    })
  }
  useEffect(() => {
    getuserDetails()
  }, [])

  const toggleReportModal = () => {
    setShowReportModal(!showReportModal);
  };

  const user_id = localStorage.getItem("@twinphy-user")

  const handleDescription = (e) => {
    e.preventDefault();
    reportPost(postId, description, user_id)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const handleBlock = (id) => {
    console.log(id, "userData");
    blockUser(id)
      .then((res) => {
        if (res.response) {
          alert(res?.response?.data?.message);
          return;
        }
        const storedData = localStorage.getItem("@twinphy-user")
        storedData.blocked = res?.data;

        localStorage.setItem("@twinphy-user", JSON.stringify(storedData));
        fetchPosts();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="top-meta">
      <div className="d-flex justify-content-between align-items-start">
        <Link to={`/user-profile/${userData?._id}`} className="media media-40">
          <img
            className="rounded"
            src={userData?.avatar ? userData?.avatar : blankImage}
            alt="/"
          />
        </Link>
        <div className="meta-content ms-3">
          <h6 className="title mb-0">
            <Link to={`/user-profile/${userData?.firstname}`}>
              {userData?.firstname + " " + userData?.lastname}
            </Link>
          </h6>
          <ul className="meta-list">
            <li>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.25 5.83331C12.25 9.91665 7 13.4166 7 13.4166C7 13.4166 1.75 9.91665 1.75 5.83331C1.75 4.44093 2.30312 3.10557 3.28769 2.121C4.27226 1.13644 5.60761 0.583313 7 0.583313C8.39239 0.583313 9.72774 1.13644 10.7123 2.121C11.6969 3.10557 12.25 4.44093 12.25 5.83331Z"
                  stroke="black"
                  strokeOpacity="0.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 7.58331C7.9665 7.58331 8.75 6.79981 8.75 5.83331C8.75 4.86681 7.9665 4.08331 7 4.08331C6.0335 4.08331 5.25 4.86681 5.25 5.83331C5.25 6.79981 6.0335 7.58331 7 7.58331Z"
                  stroke="black"
                  strokeOpacity="0.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {userData?.city + ", " + userData?.country}
            </li>
            <li>{currentTime}</li>
          </ul>
        </div>
        <div className="dropdown">
          <button
            className="item-content item-link"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{
              background: "none",
              border: "none",
            }}
          >
            <BsThreeDotsVertical />
          </button>

          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li>
              <button className="dropdown-item" onClick={toggleReportModal}>
                Report Post
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleBlock(userData._id)}
              >
                Block
              </button>
            </li>
          </ul>
          <div
            className={`modal ${showReportModal ? "show d-block" : ""}`}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Report Post</h5>
                  <AiOutlineClose
                    onClick={toggleReportModal}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className="modal-body">
                  <form onSubmit={handleDescription}>
                    <div className="form-group">
                      <label htmlFor="reportDescription">
                        Report Description
                      </label>
                      <textarea
                        className="form-control"
                        id="reportDescription"
                        rows="4"
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={toggleReportModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={toggleReportModal}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
