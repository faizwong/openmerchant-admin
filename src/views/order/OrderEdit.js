import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';

import { apiUrl } from '../../config.js';
import Spinner from '../../components/Spinner.js';

const OrderEdit = () => {
  const { orderId } = useParams();
  const history = useHistory();

  const [dataLoading, setDataLoading] = useState(true);

  const [id, setId] = useState('');
  const [status, setStatus] = useState('');
  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const source = axios.CancelToken.source();
    const getData = async (accessToken) => {
      try {
        const response = await axios({
          method: 'get',
          url: `${apiUrl}/api/v1/admin/orders/${orderId}`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          cancelToken: source.token
        });

        const { order } = response.data.data;

        setId(order.id);
        setStatus(order.status);
        setCarrier(order.carrier);
        setTrackingNumber(order.trackingNumber);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitError('');
      setSubmitLoading(true);

      const accessToken = localStorage.getItem('token');

      const response = await axios({
        method: 'put',
        url: `${apiUrl}/api/v1/admin/orders/${id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: {
          status: status,
          carrier: carrier,
          trackingNumber: trackingNumber,
        }
      });

      const savedOrder = response.data.data;

      setSubmitLoading(false);
      history.push(`/orders/${savedOrder.id}`);
    } catch (error) {
      setSubmitError(error.response.data.message);
      setSubmitLoading(false);
    }
  };

  const statusOptions = [
    {
      value: 'preparing_for_shipment',
      name: 'Preparing for shipment'
    },
    {
      value: 'shipped',
      name: 'Shipped'
    },
    {
      value: 'canceled',
      name: 'Canceled'
    }
  ];

  const carrierOptions = [
    {
      value: '',
      name: ''
    },
    {
      value: 'citylinkexpress',
      name: 'City-Link Express'
    },
    {
      value: 'fmx',
      name: 'FMX'
    },
    {
      value: 'ninjavan-my',
      name: 'Ninja Van Malaysia'
    },
    {
      value: 'skynet',
      name: 'SkyNet Malaysia'
    },
    {
      value: 'jtexpress',
      name: 'J&T EXPRESS MALAYSIA'
    }
  ];

  const handleNavigateBack = () => {
    history.goBack();
  };

  const handleInputStatus = (e) => {
    setStatus(e.target.value);
  };

  const handleInputCarrier = (e) => {
    setCarrier(e.target.value);
  };

  const handleInputTrackingNumber = (e) => {
    setTrackingNumber(e.target.value);
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
        <p className='is-size-3'>Edit Order</p>
      </div>

      <form onSubmit={handleSubmit}>

        <div className='field'>
          <label className='label'>Status</label>
          <div className='control'>
            <div className='select'>
              <select value={status} onChange={handleInputStatus}>
                {
                  statusOptions.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.name}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>
        </div>

        <div className='field'>
          <label className='label'>Carrier</label>
          <div className='control'>
            <div className='select'>
              <select value={carrier} onChange={handleInputCarrier}>
                {
                  carrierOptions.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.name}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>
        </div>

        <div className='field'>
          <label className='label'>Tracking number</label>
          <div className='control'>
            <input
              value={trackingNumber}
              onChange={handleInputTrackingNumber}
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
}

export default OrderEdit;
