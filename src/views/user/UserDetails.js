import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  useHistory,
  useParams
} from 'react-router-dom';

import { apiUrl } from '../../config.js';
import Spinner from '../../components/Spinner.js';

const UserDetails = () => {
  const { userId } = useParams();
  const history = useHistory();

  const [dataLoading, setDataLoading] = useState(true);
  const [detailsData, setDetailsData] = useState({});

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [tabKey, setTabKey] = useState('details');
  const tabs = [
    {
      key: 'details',
      name: 'Details'
    }
  ];

  useEffect(() => {
    const source = axios.CancelToken.source();
    const getData = async (accessToken) => {
      try {
        const response = await axios({
          method: 'get',
          url: `${apiUrl}/api/v1/admin/users/${userId}`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          cancelToken: source.token
        });

        const { user } = response.data.data;

        // console.log(response.data.data);

        const dataForDetails = {
          id: user.id,
          email: user.email
        };

        setDetailsData(dataForDetails);

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

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      const accessToken = localStorage.getItem('token');

      await axios({
        method: 'delete',
        url: `${apiUrl}/api/v1/admin/users/${detailsData.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      history.push('/users');

      setDeleteLoading(false);
    } catch (error) {
      setDeleteLoading(false);
    }
  };

  const handleOpenDeleteModal = () => {
    setDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
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
        <p className='is-size-3'>User Details</p>
      </div>

      <div className='block'>
        <div className='tabs'>
          <ul>
            {
              tabs.map((item) => (
                <li
                  key={item.key}
                  onClick={() => { setTabKey(item.key); }}
                  className={tabKey === item.key ? 'is-active' : ''}
                >
                  {/* eslint-disable-next-line */}
                  <a>{item.name}</a>
                </li>
              ))
            }
          </ul>
        </div>
      </div>

      {
        tabKey === 'details' &&
          <div>
            <div className='block'>
              <div className='buttons'>
                <button
                  onClick={handleOpenDeleteModal}
                  className='button is-danger'
                >
                  Delete
                </button>
              </div>
            </div>

            <div className='block'>
              <p className='has-text-weight-bold'>id</p>
              <p>{detailsData.id}</p>
            </div>

            <div className='block'>
              <p className='has-text-weight-bold'>email</p>
              <p>{detailsData.email}</p>
            </div>

            <div className={`modal ${deleteModal && 'is-active'}`}>
              <div className='modal-background' />
              <div className='modal-card'>
                <header className='modal-card-head'>
                  <p className='modal-card-title'>Warning</p>
                  <button
                    onClick={handleCloseDeleteModal}
                    type='button'
                    className='delete'
                    disabled={deleteLoading}
                  />
                </header>
                <section className='modal-card-body'>
                  <p>Are you sure you want to delete?</p>
                </section>
                <footer className='modal-card-foot'>
                  <button
                    onClick={handleDelete}
                    className={`button is-danger ${deleteLoading ? 'is-loading' : ''}`}
                    disabled={deleteLoading}
                  >
                    Confirm delete
                  </button>
                  <button
                    onClick={handleCloseDeleteModal}
                    type='button'
                    className='button'
                    disabled={deleteLoading}
                  >
                    Cancel
                  </button>
                </footer>
              </div>
            </div>

          </div>
      }
    </div>
  );
};

export default UserDetails;
