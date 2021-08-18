import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { apiUrl } from './config.js';

import Router from './routes/Router.js';
import RouterPublic from './routes/RouterPublic.js';

import Spinner from './components/Spinner.js';

const App = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async (accessToken) => {
      try {
        const response = await axios({
          method: 'get',
          url: `${apiUrl}/api/v1/admin/auth/me`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        // console.log(response.data);
        localStorage.setItem('token', response.data.accessToken);
        setUser({
          id: response.data.data.id,
          email: response.data.data.email
        });

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    const accessToken = localStorage.getItem('token');

    if (accessToken) {
      getUser(accessToken);
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <div style={loadingPageStyle}>
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {
        user && user.id
          ? <Router
              user={user}
              setUser={setUser}
            />
          : <RouterPublic
              setUser={setUser}
            />
      }
    </div>
  );
};

const loadingPageStyle = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

export default App;
