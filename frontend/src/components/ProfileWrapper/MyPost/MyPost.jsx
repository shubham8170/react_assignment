import { useState } from "react";
import { NavLink } from "react-router-dom";

export const MyPost = ({ postData }) => {
  const [grid, setGrid] = useState(true);
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

  const handleGrid = () => {
    setGrid(true);
  };
  const handleColumn = () => {
    setGrid(false);
  };
  console.log(postData);

  const profileData = [
    {
      images: postData
        .filter((i) => i?.file)
        .map((item) => item.file),
    },
  ];
  return (
    <>
      <div className="title-bar my-2">
        <h6 className="mb-0">My Posts</h6>
        <div className="dz-tab style-2">
          <ul className="nav nav-tabs" id="myTab3" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${grid && "active"}`}
                onClick={handleGrid}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 3H3V10H10V3Z"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    strokeOpacity="0.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 3H14V10H21V3Z"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    strokeOpacity="0.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 14H14V21H21V14Z"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    strokeOpacity="0.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 14H3V21H10V14Z"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    strokeOpacity="0.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${!grid && "active"}`}
                onClick={handleColumn}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 6H21"
                    stroke="var(--primary)"
                    strokeOpacity="0.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 12H21"
                    stroke="var(--primary)"
                    strokeOpacity="0.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 18H21"
                    stroke="var(--primary)"
                    strokeOpacity="0.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 6H3.01"
                    stroke="var(--primary)"
                    strokeOpacity="0.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 12H3.01"
                    stroke="var(--primary)"
                    strokeOpacity="0.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 18H3.01"
                    stroke="var(--primary)"
                    strokeOpacity="0.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="tab-content" id="myTabContent3">
  {grid ? (
    <div
      className="tab-pane fade show active"
      id="home-tab-pane3"
      role="tabpanel"
      aria-labelledby="home-tab"
      tabIndex="0"
    >
      {profileData.map((tab, index) => (
        <div className="dz-lightgallery style-2" key={index} id={`lightgallery-${index}`}>
          {tab.images.map((image, imgIndex) => (
            <a className="gallery-box" href={image} key={imgIndex}>
              <NavLink to="/user-post">
                <img src={image} alt="image" />
              </NavLink>
            </a>
          ))}
        </div>
      ))}
    </div>
  ) : (
    <div
      className="tab-pane fade show active"
      id="profile-tab-pane3"
      role="tabpanel"
      aria-labelledby="profile-tab"
      tabIndex="0"
    >
      {profileData.map((tab, index) => (
        <div className="dz-lightgallery" key={index} id={`lightgallery-2-${index}`}>
          {tab.images.map((image, imgIndex) => (
            <a className="gallery-box" href={image} key={imgIndex}>
              <NavLink to="/user-post">
                {image && video.includes(image.split('.').pop()) ? (
                  <video src={image} autoPlay muted style={{ width: '100%' }} />
                ) : (
                  <img src={image} alt="image" />
                )}
              </NavLink>
            </a>
          ))}
        </div>
      ))}
    </div>
  )}
</div>

    </>
  );
};
