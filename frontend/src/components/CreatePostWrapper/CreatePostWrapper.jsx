import { useState } from 'react';
import { CreatePost } from './CreatePost';
import { Footer } from './Footer';
import { Header } from './Header';
import './style.css';
import { handleAddPost } from '../../api/post';
import { avatarUpload } from '../../api';
import { useNavigate, useParams } from 'react-router-dom';

export const CreatePostWrapper = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [mediaUrls, setMediaUrls] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const handlePost = (e) => {
    setLoading(true);
    e.preventDefault();
    const userId = localStorage.getItem('@twinphy-user');
    const formData = new FormData(e.currentTarget);
    if (formData.get('avatar')?.size > 0) {
      avatarUpload(formData).then((res) => {
        setTimeout(() => {
          handleAddPost({ text, file: res, id: userId })
          .then(() => {
            setLoading(false);
            navigate('/');
          })
          .catch(() => {
            setLoading(false);
            alert('Error');
          });
        }, 2000);
       
      });
    } else {
      handleAddPost({ text, id: userId, contestId: id })
        .then(() => {
          setLoading(false);
          navigate('/');
        })
        .catch(() => {
          setLoading(false);
          alert('Error');
        });
    }
  };

  return (
    <form onSubmit={handlePost}>
      <Header loading={loading} />
      <CreatePost setText={setText} />
      <Footer setMediaUrls={setMediaUrls} mediaUrls={mediaUrls} />
    </form>
  );
};
