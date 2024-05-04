import { Link } from 'react-router-dom';

export const Forget = () => {
  return (
    <div className='content-body'>
      <div className='container vh-100'>
        <div className='welcome-area'>
          <div
            className='bg-image bg-image-overlay'
            style={{ backgroundImage: "url('assets/images/login/pic6.jpg')" }}
          ></div>
          <div className='join-area h-50'>
            <div className='started'>
              <h1 className='title'>Forgot Password</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor
              </p>
            </div>
            <form>
              <div className='input-group form-item input-select'>
                <span className='input-group-text'>
                  <select className='form-control custom-image-select-2 image-select'>
                    <option data-thumbnail='assets/images/flags/australia.png'>
                      +61
                    </option>
                    <option data-thumbnail='assets/images/flags/india.png'>
                      +91
                    </option>
                    <option data-thumbnail='assets/images/flags/uae.png'>
                      +971
                    </option>
                    <option data-thumbnail='assets/images/flags/us.png'>
                      +1
                    </option>
                  </select>
                </span>
                <input
                  type='number'
                  className='form-control'
                  placeholder='Phone Number'
                />
              </div>
            </form>
            <div className='seprate-box mb-3'>
              <Link to='/login' className='back-btn'>
                <svg
                  width='10'
                  height='16'
                  viewBox='0 0 10 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M4.40366 8L9.91646 2.58333L7.83313 0.499999L0.333132 8L7.83313 15.5L9.91644 13.4167L4.40366 8Z'
                    fill='white'
                  />
                </svg>
              </Link>
              <a href='otp-confirm.html' className='btn btn-primary btn-block'>
                NEXT
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
