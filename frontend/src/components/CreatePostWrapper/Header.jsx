import { Link } from "react-router-dom";

export const Header = ({ loading }) => {
  return (
    <header className="header bg-white">
      <div className="container">
        <div className="main-bar">
          <div className="left-content">
            <Link to="/" className="back-btn">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h4 className="title mb-0">Create Post</h4>
          </div>
          <div className="mid-content"></div>
          <div className="right-content">
            <button
              disabled={loading}
              style={{ outline: "none", border: 0 }}
              id="post-btn"
              className="post-btn"
              type="submit"
            >
              POST
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
