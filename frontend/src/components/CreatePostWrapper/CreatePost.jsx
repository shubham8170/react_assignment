import { useEffect, useState } from "react";
import { getSingleUser } from "../../api";
import config from "../../api/config";

export const CreatePost = ({setText}) => {
  const [userName, setUserName] = useState(null); // Initial state is set to null

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  useEffect(() => {
    getSingleUser()
      .then((res) => {
        console.log(res);
        setUserName(res);
        console.log('userName ', userName);
      })
      .catch((err) => {
        console.log(err);
        setUserName(null);
      });
  }, []);
  

      
  return (
    <div className='page-content'>
      <div className='container'>
        <div className='post-profile'>
          <div className='left-content'>
            <div className='media media-50 rounded-circle'>
              <img id='pic' src={userName?.avatar} alt='profile' />
            </div>
            <div className='ms-2'>
              <h6 id='name' className='mb-1'>
                {userName?.firstname + " " + userName?.lastname}
              </h6>
            </div>
          </div>
        </div>
        <div className='post-content-area'>
          <textarea
            id='caption'
            className='form-control'
            placeholder="What's on your mind?"
            onChange={handleTextChange}
          ></textarea>
        </div>
      </div>
    </div>
  );
};
