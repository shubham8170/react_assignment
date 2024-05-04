import { Link } from 'react-router-dom';

export const Header = ({ title, src }) => {
  return (
    <header className='header bg-white'>
      <div className='container'>
        <div className='main-bar'>
          <div className='left-content'>
            <Link to='/chat' className='back-btn'>
              <i className='fa-solid fa-arrow-left'></i>
            </Link>
            <div className='media me-3 media-35 rounded-circle'>
              <img src={src} alt='/' />
            </div>
            <h5 className='mb-0'>{title}</h5>
          </div>
          <div className='mid-content'></div>
          <div className='right-content'>
            <span
              className='text-dark font-20'
              dataBsToggle='modal'
              dataBsTarget='#exampleModal1'
            >
              <i className='fa-solid fa-video'></i>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
