import { useEffect, useState } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { Message } from './Message';
import { VideoCall } from './VideoCall';
import { fetchMessages } from '../../api';
import { getSingleUser } from '../../api/user'
import { blankImage } from "../../utils";


export const MessageWrapper = () => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    fetchMessages(window.location.pathname.split('/')[2]).then((res) =>
      setMessages(res)
    );
  }, []);
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem('@twinphy-user')
  );
  const receiverId = window.location.pathname.split('/')[2];
  useEffect(() => {
    getSingleUser(receiverId).then((data)=>setUserInfo(data))
  }, [])
  

  return (
    <>
      <Header
        title= {userInfo ? `${userInfo.firstname} ${userInfo.lastname}` : ''}
        src={
          userInfo?.avatar ? userInfo?.avatar : blankImage
        }
      />
      {/* <Message messages={messages} /> */}
      <Footer receiver={messages[0]?.receiver?._id} setMessages={setMessages} />
      <VideoCall />
    </>
  );
};
