import React, { useState } from 'react';
import axios from 'axios';

import { apiUrl } from '../../config.js';

const SignIn = (props) => {
  const { setUser } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitError('');
      setLoading(true);

      const response = await axios({
        method: 'post',
        url: `${apiUrl}/api/v1/admin/auth/sign-in`,
        data: {
          email: email,
          password: password
        }
      });

      setLoading(false);

      localStorage.setItem('token', response.data.accessToken);
      setUser({
        id: response.data.data.id,
        email: response.data.data.email
      });
      // history.push('/');
    } catch (error) {
      console.error(error);
      if (error && error.response && error.response.data && error.response.data.message) {
        setSubmitError(error.response.data.message);
      } else {
        setSubmitError('Something went wrong');
      }
      setLoading(false);
    }
  };

  const handleInputEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleInputPassword = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div style={loginContainerStyle}>
      <p className='is-size-3 mb-4'>Sign In</p>
      <form onSubmit={handleSubmit}>
        <div className='field'>
          <label className='label'>Email</label>
          <div className='control'>
            <input
              value={email}
              onChange={handleInputEmail}
              type='email'
              className='input'
            />
          </div>
        </div>
        <div className='field'>
          <label className='label'>Password</label>
          <div className='control'>
            <input
              value={password}
              onChange={handleInputPassword}
              type='password'
              className='input'
            />
          </div>
        </div>
        {
          submitError !== '' &&
          <div className='field'>
            <p className="help is-danger">{submitError}</p>
          </div>
        }
        <div className='field is-grouped'>
          <div className='control'>
            <button
              disabled={loading}
              type='submit'
              className={`button is-link ${loading && 'is-loading'}`}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const loginContainerStyle = {
  width: '400px',
  margin: 'auto',
  marginTop: '100px'
};

export default SignIn;
