import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { apiUrl } from '../../config.js';

const DiscountCodeAdd = () => {
  const history = useHistory();

  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [isActive, setIsActive] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleNavigateBack = () => {
    history.goBack();
  };

  const handleInputCode = (e) => {
    if (e.currentTarget.value.includes(" ")) {
      e.currentTarget.value = e.currentTarget.value.replace(/\s/g, "");
    }
    setCode(e.target.value.toUpperCase());
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
        method: 'post',
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

      const newDiscountCode = response.data.data;

      setSubmitLoading(false);
      history.push(`/discount-codes/${newDiscountCode.id}`);
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
        <p className='is-size-3'>Add DiscountCode</p>
      </div>

      <form onSubmit={handleSubmit}>

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

export default DiscountCodeAdd;
