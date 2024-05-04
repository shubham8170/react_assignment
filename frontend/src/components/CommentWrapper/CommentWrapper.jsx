import { useEffect, useState } from 'react';
import { Comment } from './Comment';
import { Footer } from './Footer';
import { Header } from './Header';
import { handlePostComments, getPostDetails } from '../../api';
import { useParams } from 'react-router-dom';

export const CommentWrapper = () => {
  const [comments, setcomments] = useState([])
  const { id } = useParams();

  useEffect(() => {
    getPostDetails(id).then((res)=>{
      setcomments(res?.data?.comments);
    })
  }, [])
  const handleComment = (comment) => {
    handlePostComments(id, comment).then((data) => {
    }).catch((err) => {
      console.error(err.message);
    })

  }
  return (
    <>
      <Header />
      <Comment comments={comments} />
      <Footer handleComment={handleComment} />
    </>
  );
};
