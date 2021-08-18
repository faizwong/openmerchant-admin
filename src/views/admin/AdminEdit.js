import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';

import { apiUrl } from '../../config.js';
import Spinner from '../../components/Spinner.js';

const AdminEdit = () => {
  const { adminId } = useParams();
  const history = useHistory();

  const [dataLoading, setDataLoading] = useState(true);

  const [id, setId] = useState('');
  const [userId, setUserId] = useState('');

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const source = axios.CancelToken.source();
    const getData = async (accessToken) => {
      try {
        const response = await axios({
          method: 'get',
          url: `${apiUrl}/api/v1/admin/admins/${adminId}`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          cancelToken: source.token
        });

        const { admin } = response.data.data;

        setId(admin.id);
        setUserId(admin.UserId);

        setDataLoading(false);
      } catch (error) {
        console.error(error);
        setDataLoading(false);
      }
    };

    const accessToken = localStorage.getItem('token');

    if (accessToken) {
      getData(accessToken);
    }

    return () => {
      source.cancel('Cancelling in cleanup');
    };
  // eslint-disable-next-line
  }, []);

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
        method: 'put',
        url: `${apiUrl}/api/v1/admin/admins/${id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: {
          UserId: userId
        }
      });

      const savedAdmin = response.data.data;

      setSubmitLoading(false);
      history.push(`/admins/${savedAdmin.id}`);
    } catch (error) {
      setSubmitError(error.response.data.message);
      setSubmitLoading(false);
    }
  };

  if (dataLoading) {
    return <Spinner />;
  }

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
        <p className='is-size-3'>Edit Admin</p>
      </div>

      <form onSubmit={handleSubmit}>

        <div className='field'>
          <label className='label'>id</label>
          <div className='control'>
            <input
              value={id}
              type='text'
              className='input'
              readOnly
              disabled
            />
          </div>
        </div>

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

export default AdminEdit;
