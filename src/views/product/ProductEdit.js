import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import MDEditor, { commands } from '@uiw/react-md-editor';

import { apiUrl } from '../../config.js';
import CustomCurrencyInput from '../../components/CustomCurrencyInput.js';
import Spinner from '../../components/Spinner.js';

const ProductAdd = () => {
  const { productId } = useParams();
  const history = useHistory();

  const [dataLoading, setDataLoading] = useState(true);

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [regularPrice, setRegularPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const source = axios.CancelToken.source();
    const getData = async (accessToken) => {
      try {
        const response = await axios({
          method: 'get',
          url: `${apiUrl}/api/v1/admin/products/${productId}`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          cancelToken: source.token
        });

        const { product } = response.data.data;

        setId(product.id);
        setName(product.name);
        setRegularPrice(product.regularPrice);
        setSalePrice(product.salePrice);
        setShortDescription(product.shortDescription);
        setLongDescription(product.longDescription);
        setIsAvailable(product.isAvailable);
        setIsPublic(product.isPublic);

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

  const handleInputName = (e) => {
    setName(e.target.value);
  };

  const handleInputRegularPrice = useCallback((value) => {
    setRegularPrice(value);
  }, []);

  const handleInputSalePrice = useCallback((value) => {
    setSalePrice(value);
  }, []);

  const handleInputIsAvailable = (e) => {
    if (e.target.value === 'true') {
      setIsAvailable(true);
    } else if (e.target.value === 'false') {
      setIsAvailable(false);
    }
  };

  const handleInputIsPublic = (e) => {
    if (e.target.value === 'true') {
      setIsPublic(true);
    } else if (e.target.value === 'false') {
      setIsPublic(false);
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
        url: `${apiUrl}/api/v1/admin/products/${id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: {
          name: name,
          regularPrice: regularPrice,
          salePrice: salePrice,
          shortDescription: shortDescription,
          longDescription: longDescription,
          isAvailable: isAvailable,
          isPublic: isPublic
        }
      });

      const savedProduct = response.data.data;

      setSubmitLoading(false);
      history.push(`/products/${savedProduct.id}`);
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
        <p className='is-size-3'>Edit Product</p>
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
          <label className='label'>name</label>
          <div className='control'>
            <input
              value={name}
              onChange={handleInputName}
              type='text'
              className='input'
            />
          </div>
        </div>

        <div className='field'>
          <label className='label'>regularPrice</label>
          <div className='control'>
            <CustomCurrencyInput
              value={regularPrice}
              onValueChange={handleInputRegularPrice}
              className='input'
            />
          </div>
        </div>

        <div className='field'>
          <label className='label'>salePrice</label>
          <div className='control'>
            <CustomCurrencyInput
              value={salePrice}
              onValueChange={handleInputSalePrice}
              className='input'
            />
          </div>
        </div>

        <div className='field'>
          <label className='label'>isAvailable</label>
          <div className='control'>
            <div className='select'>
              <select value={isAvailable} onChange={handleInputIsAvailable}>
                <option value={true}>true</option>
                <option value={false}>false</option>
              </select>
            </div>
          </div>
        </div>

        <div className='field'>
          <label className='label'>isPublic</label>
          <div className='control'>
            <div className='select'>
              <select value={isPublic} onChange={handleInputIsPublic}>
                <option value={true}>true</option>
                <option value={false}>false</option>
              </select>
            </div>
          </div>
        </div>

        <div className='field'>
          <label className='label'>shortDescription</label>
          <MDEditor
            value={shortDescription}
            onChange={setShortDescription}
            height={200}
            commands={[
              commands.bold,
              commands.italic,
              commands.strikethrough,
              commands.group([commands.title1, commands.title2, commands.title3, commands.title4, commands.title5, commands.title6], {
                name: 'title',
                groupName: 'title',
                buttonProps: { 'aria-label': 'Insert title'}
              }),
              commands.hr,
              commands.divider,
              commands.link,
              commands.quote,
              commands.code,
              commands.image,
              commands.unorderedListCommand,
              commands.orderedListCommand,
              commands.checkedListCommand
            ]}
          />
        </div>

        <div className='field'>
          <label className='label'>longDescription</label>
          <MDEditor
            value={longDescription}
            onChange={setLongDescription}
            height={500}
            commands={[
              commands.bold,
              commands.italic,
              commands.strikethrough,
              commands.group([commands.title1, commands.title2, commands.title3, commands.title4, commands.title5, commands.title6], {
                name: 'title',
                groupName: 'title',
                buttonProps: { 'aria-label': 'Insert title'}
              }),
              commands.hr,
              commands.divider,
              commands.link,
              commands.quote,
              commands.code,
              commands.image,
              commands.unorderedListCommand,
              commands.orderedListCommand,
              commands.checkedListCommand
            ]}
          />
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

export default ProductAdd;
