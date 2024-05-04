import { useState } from "react";
import { NavLink } from "react-router-dom";
import {searchUser} from '../../api/user'

export const Timeline = ({ fetchPosts, timelineData }) => {
  const [searchQuery, setsearchQuery] = useState();
  const [searchResult, setsearchResult] = useState([]);
  const video = [
    "mp4",
    "avi",
    "mov",
    "mkv",
    "wmv",
    "flv",
    "webm",
    "mpeg",
    "mpg",
    "3gp",
    "m4v",
    "ogg",
  ];

  const handleSearchInput = (e)=>{
    console.log(e.target.value);
    setsearchQuery(e.target.value);
  }
  const searchClick = async()=>{
    try{
      const searchUserResult = await searchUser(searchQuery);
      console.log(searchUserResult);
      setsearchResult(searchUserResult);
    }
    catch(err){
      alert(err.message)
    }
  }

  
  return (
    <>
      <header className="header">
        <div className="container">
          <form className="my-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search.."
                onChange={(e)=> handleSearchInput(e)}
              />
              <span className="input-group-text" onClick={searchClick}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.7871 22.7761L17.9548 16.9437C19.5193 15.145 20.4665 12.7982 20.4665 10.2333C20.4665 4.58714 15.8741 0 10.2333 0C4.58714 0 0 4.59246 0 10.2333C0 15.8741 4.59246 20.4665 10.2333 20.4665C12.7982 20.4665 15.145 19.5193 16.9437 17.9548L22.7761 23.7871C22.9144 23.9255 23.1007 24 23.2816 24C23.4625 24 23.6488 23.9308 23.7871 23.7871C24.0639 23.5104 24.0639 23.0528 23.7871 22.7761ZM1.43149 10.2333C1.43149 5.38004 5.38004 1.43681 10.2279 1.43681C15.0812 1.43681 19.0244 5.38537 19.0244 10.2333C19.0244 15.0812 15.0812 19.035 10.2279 19.035C5.38004 19.035 1.43149 15.0865 1.43149 10.2333Z"
                    fill="var(--primary)"
                  />
                </svg>
              </span>
            </div>
          </form>
        </div>
      </header>
      <div className="page-content">
        <div className="content-inner pt-0">
          <div className="container bottom-content">
            <div className="tab-content" id="myTabContent3">
              <div
                className="tab-pane fade show active"
                id="home-tab-pane3"
                role="tabpanel"
                aria-labelledby="home-tab"
                tabIndex="0"
              >
              {searchResult?.length === 0?<><h5>No result found</h5></>:<><div className="row">
                  {searchResult
                    .map((item, index) => (
                      <div className="col-md-4" key={index}>
                        <div
                          className="dz-lightgallery style-2 mt-3"
                          id="lightgallery"
                        >
                          <NavLink
                            to="/explore"
                            id="galley-timeline"
                            className="gallery-box"
                            data-lg-id={item?.id}
                          >
                            <div class="card">
                              {item?.avatar ? <img src={item?.avatar} alt="Avatar" style={{width:'100%'}} /> : <></>}
                              <div class="container">
                                <h4><b>{item.firstname + " " + item.lastname}</b></h4>
                                <p className="username">username: {item.username}</p>
                                <p>Architect & Engineer</p>
                                <span className="location">                                <i class="fa-solid fa-location-dot"></i> <p>{item?.city + " "+ item?.country}</p>
</span>
                              </div>
                            </div>
                          </NavLink>
                        </div>
                      </div>
                    ))}
                </div></>}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
