import { Header } from './Header';
import { Media } from './Media';
import { Likes } from './Likes';
import { Comments } from './Comments';
import { Share } from './Share';

export const Post = ({ postData, setPostData, fetchPosts }) => {
  console.log('postData ', postData);
  return (
    <div id='post-area' className='post-area'>
      {postData &&
        typeof postData &&
        postData.map((item, index) => (
          <div key={index} className='post-card'>
            <Header
              fetchPosts={fetchPosts}
              time={item?.createdAt}
              userId={item?.userId}
              postId={item?._id}
            />
            <p className='text-black'>{item?.text}</p>
            <div className='dz-media'>
              {item?.file && <Media src={item?.file} />}
              <div className='post-meta-btn'>
                <ul>
                  <li>
                    <Likes
                      postData={postData}
                      index={index}
                      setPostData={setPostData}
                      post_id={item?._id}
                      likes={item?.likes}
                    />
                  </li>
                  <li>
                    <Comments postId={item._id} comments = {item?.comments} />
                  </li>
                  <li>
                    <Share />
                  </li>

                  {/* <!-- Dynamically Added Elements --> */}
                  <div id='dynamicElements'>
                    {/* <!-- Dynamically added elements will be inserted here --> */}
                  </div>
                </ul>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
