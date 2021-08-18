import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';

import { apiUrl } from '../../config.js';
import Spinner from '../../components/Spinner.js';

const DiscountCodeEdit = () => {
  const { discountCodeId } = useParams();
  const history = useHistory();

  const [dataLoading, setDataLoading] = useState(true);

  const [id, setId] = useState('');
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [isActive, setIsActive] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const source = axios.CancelToken.source();
    const getData = async (accessToken) => {
      try {
        const response = await axios({
          method: 'get',
          url: `${apiUrl}/api/v1/admin/discount-codes/${discountCodeId}`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          cancelToken: source.token
        });

        const { discountCode } = response.data.data;

        setId(discountCode.id);
        setCode(discountCode.code);
        setDiscountPercentage(discountCode.discountPercentage);
        setIsActive(discountCode.isActive);

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

  const handleInputCode = (e) => {
    setCode(e.target.value);
  };

  const handleInputDiscountPercentage = (e) => {
    setDiscountPercentage(e.target.value);
  };

  const handleInputIsActive = (e) => {
    if (e.target.value === 'true') {
      setIsActive(true);
    } else if (e.target.value === 'false') {
      setIsActive(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitError('');
      setSubmitLoading(true);

      const accessToken = localStorage.getItem('token');

      const response = await axios({
        method: 'put',
        url: `${apiUrl}/api/v1/admin/discount-codes`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: {
          code: code,
          discountPercentage: discountPercentage,
          isActive: isActive
        }
      });

      const savedDiscountCode = response.data.data;

      setSubmitLoading(false);
      history.push(`/discount-codes/${savedDiscountCode.id}`);
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
        <p className='is-size-3'>Edit DiscountCode</p>
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
          <label className='label'>code</label>
          <div className='control'>
            <input
              value={code}
              onChange={handleInputCode}
              type='text'
              className='input'
            />
          </div>
        </div>

        <div className='field'>
          <label className='label'>discountPercentage</label>
          <div className='control'>
            <input
              value={discountPercentage}
              onChange={handleInputDiscountPercentage}
              type='text'
              className='input'
            />
          </div>
        </div>

        <div className='field'>
          <label className='label'>isActive</label>
          <div className='control'>
            <div className='select'>
              <select value={isActive} onChange={handleInputIsActive}>
                <option value={true}>true</option>
                <option value={false}>false</option>
              </select>
            </div>
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

export default DiscountCodeEdit;
