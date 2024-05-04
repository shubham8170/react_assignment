import { Link } from "react-router-dom";
import {handlePostComments, getPostDetails } from '../../../api/post'
import { Comment } from "../../CommentWrapper/Comment";
import { Footer } from "../../CommentWrapper/Footer";

import { useState } from "react";

export const Comments = ({postId, comments}) => {
  console.log(comments);
  // useState
  // const [comments, setcomments] = useState([])
  const [isShowComment, setisShowComment] = useState(false);
  const [comment, setcomment] = useState("");

  const handleCommentUI=()=>{
    setisShowComment(!isShowComment);
    if(isShowComment){
    getPostDetails(postId).then((res)=>{
      // setcomments(res?.data?.comments);
    })
  }
  }

  const handleComment = (comment) => {
    handlePostComments(postId, comment).then((data) => {
    }).catch((err) => {
      console.error(err.message);
    })

  }
  return (<>

<div className='action-btn bg-secondary' onClick={handleCommentUI}>
      <i className='fa-solid fa-comment fill-icon'></i>
      <h6 className='font-14 mb-0 ms-2'>{comments?.length}</h6>
    </div>
    {isShowComment ? <><Comment comments={comments} /> 
     <Footer handleComment={handleComment} />
     </> : <></>
    }
  </>
  );
};
