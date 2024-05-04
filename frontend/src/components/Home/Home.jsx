import { getAllUser, getPosts } from '../../api';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ShareExplore } from '../ExploreWraper/ShareExplore';
import { Post } from './Post';
import { StorySection } from './StorySection';
import { useEffect, useState } from 'react';
import { getContest } from '../../api/contest'
import './Home.css'

// import for card design
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardHeader,
  MDBCardFooter,
  MDBBtn
} from 'mdb-react-ui-kit';


export const Home = () => {
  const [postData, setPostData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [contestList, setcontestList] = useState([]);
  const navigate = useNavigate();


  const fetchPosts = () => {
    let userId;
    if (
      localStorage.getItem('@twinphy-user') &&
      localStorage.getItem('@twinphy-user') !== 'undefined'
    )
      userId = localStorage.getItem('@twinphy-user');

    const currentUser =
      localStorage.getItem('@twinphy-user')

    const followingUser =
      localStorage.getItem('@twinphy-user')


    getPosts()
      .then((res) => {
        setPostData(
          res?.data?.data
        );
      })
      .catch((err) => console.log(err));
  };

  const fetchContest = () => {
    getContest().then((data) => {
      setcontestList(data);
    })
  }

  const navigatePost =(contestId)=>{
    // to='/create-post/post'
     navigate(`/create-post/${contestId}`)
  }

  useEffect(() => {
    fetchPosts();
    fetchContest();

    getAllUser()
      .then((res) => setUserData(res?.data?.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className='page-content'>
      <div className='content-inner pt-0'>
        <div className='container bottom-content'>
          {/* <StorySection /> */}
          <div className='contest'>
            {contestList?.length > 0 ? (
              contestList.map((data, index) => (
                <MDBCard alignment='left' key={index}>
                  <MDBCardHeader>Contest</MDBCardHeader>
                  <MDBCardBody>
                    <MDBCardTitle>{data.contestName}</MDBCardTitle>
                    <MDBCardText>{data.contestDescription}</MDBCardText>
                    <MDBCardText> Total number of rounds {data.contestTotalround}</MDBCardText>
                    <MDBBtn onClick={(e)=>navigatePost(data._id)}>Participate Now</MDBBtn>
                  </MDBCardBody>
                  <MDBCardFooter className='text-muted'>Expired at : {new Date(data.expireAt).toLocaleString()}</MDBCardFooter>
                </MDBCard>
              ))
            ) : (
              <></>
            )}

          </div>
          <Post
            postData={postData}
            setPostData={setPostData}
            fetchPosts={fetchPosts}
          />
          <ShareExplore userData={userData} />
        </div>
      </div>
    </div>
  );
};
