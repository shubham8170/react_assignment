import React from 'react';
import ReactDOM from 'react-dom'; // Correct import
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from './Redux/store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));

const AppWithOAuth = () => ( // Wrap JSX within a function or component
  <React.StrictMode>
    <GoogleOAuthProvider clientId="597509502102-7qklrhmti8savjbpff0qsag91j5jdgcq.apps.googleusercontent.com">
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

root.render(<AppWithOAuth />); // Render the component
