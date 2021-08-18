import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';

import { apiUrl } from '../../config.js';

const AdminAdd = () => {
  const history = useHistory();
  const location = useLocation();

  const parentId = location.state && location.state.parentId ? location.state.parentId : '';

  const [userId, setUserId] = useState(parentId);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleNavigateBack = () => {
    history.goBack();
  };

  const handleInputUserId = (e) => {
    setUserId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitError('');
      setSubmitLoading(true);

      const accessToken = localStorage.getItem('token');

      const response = await axios({
        method: 'post',
        url: `${apiUrl}/api/v1/admin/admins`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: {
          UserId: userId
        }
      });

      const newAdmin = response.data.data;

      setSubmitLoading(false);
      history.push(`/admins/${newAdmin.id}`);
    } catch (error) {
      setSubmitError(error.response.data.message);
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <div className='block'>
        <button
          onClick={handleNavigateBack}
          type='button'
          className='button is-small'
        >
          Back
        </button>
      </div>

      <div className='block'>
        <p className='is-size-3'>Add Admin</p>
      </div>

      <form onSubmit={handleSubmit}>

        <div className='field'>
          <label className='label'>UserId</label>
          <div className='control'>
            <input
              value={userId}
              onChange={handleInputUserId}
              type='text'
              className='input'
            />
          </div>
        </div>

        <div className='field is-grouped'>
          <div className='control buttons'>
            <button
              disabled={submitLoading}
              type='submit'
              className={`button is-link ${submitLoading && 'is-loading'}`}
            >
              Submit
            </button>
            <button
              type='button'
              className='button'
              onClick={handleNavigateBack}
            >
              Cancel
            </button>
          </div>
        </div>

      </form>

      {
        submitError !== '' &&
        <div className='mt-5'>
          <div className='message is-danger'>
            <div className='message-body'>{submitError}</div>
          </div>
        </div>
      }

    </div>
  );
};

export default AdminAdd;
