import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  useHistory,
  useParams
} from 'react-router-dom';

import { apiUrl } from '../../config.js';
import { formatCurrency, formatDate } from '../../utils';
import Spinner from '../../components/Spinner.js';

const OrderDetails = () => {
  const { orderId } = useParams();
  const history = useHistory();

  const [dataLoading, setDataLoading] = useState(true);
  const [detailsData, setDetailsData] = useState({});

  const [shipModal, setShipModal] = useState(false);
  const [shipLoading, setShipLoading] = useState(false);
  const [shipError, setShipError] = useState(null);

  const [cancelModal, setCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  const carrierOptions = [
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
  const [carrier, setCarrier] = useState(carrierOptions[0].value);
  const [trackingNumber, setTrackingNumber] = useState('');

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

        const dataForDetails = {
          id: order.id,
          name: order.name,
          email: order.email,
          phoneNumber: order.phoneNumber,
          addressLine1: order.addressLine1,
          addressLine2: order.addressLine2,
          city: order.city,
          state: order.state,
          postalCode: order.postalCode,
          country: order.country,
          carrier: order.carrier,
          trackingNumber: order.trackingNumber,
          productName: order.productName,
          subtotal: order.subtotal,
          discount: order.discount,
          total: order.total,
          discountCode: order.discountCode,
          discountPercentage: order.discountPercentage,
          stripePaymentIntentId: order.stripePaymentIntentId,
          status: order.status,
          orderPlacedAt: order.orderPlacedAt,
          paymentCompletedAt: order.paymentCompletedAt,
          shippedAt: order.shippedAt,
          canceledAt: order.canceledAt
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

  const handleShip = async () => {
    try {
      setShipError(null);
      setShipLoading(true);

      const accessToken = localStorage.getItem('token');

      await axios({
        method: 'post',
        url: `${apiUrl}/api/v1/admin/orders/ship/${detailsData.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: {
          carrier: carrier,
          trackingNumber: trackingNumber
        }
      });

      const response = await axios({
        method: 'get',
        url: `${apiUrl}/api/v1/admin/orders/${orderId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const { order } = response.data.data;

      const dataForDetails = {
        id: order.id,
        name: order.name,
        email: order.email,
        phoneNumber: order.phoneNumber,
        addressLine1: order.addressLine1,
        addressLine2: order.addressLine2,
        city: order.city,
        state: order.state,
        postalCode: order.postalCode,
        country: order.country,
        carrier: order.carrier,
        trackingNumber: order.trackingNumber,
        productName: order.productName,
        subtotal: order.subtotal,
        discount: order.discount,
        total: order.total,
        discountCode: order.discountCode,
        discountPercentage: order.discountPercentage,
        stripePaymentIntentId: order.stripePaymentIntentId,
        status: order.status,
        orderPlacedAt: order.orderPlacedAt,
        paymentCompletedAt: order.paymentCompletedAt,
        shippedAt: order.shippedAt,
        canceledAt: order.canceledAt
      };

      setDetailsData(dataForDetails);

      setShipLoading(false);
      setShipModal(false);
    } catch (error) {
      setShipError(error.response.data.message);
      setShipLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setCancelError(null);
      setCancelLoading(true);

      const accessToken = localStorage.getItem('token');

      await axios({
        method: 'post',
        url: `${apiUrl}/api/v1/admin/orders/cancel/${detailsData.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const response = await axios({
        method: 'get',
        url: `${apiUrl}/api/v1/admin/orders/${orderId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const { order } = response.data.data;

      const dataForDetails = {
        id: order.id,
        name: order.name,
        email: order.email,
        phoneNumber: order.phoneNumber,
        addressLine1: order.addressLine1,
        addressLine2: order.addressLine2,
        city: order.city,
        state: order.state,
        postalCode: order.postalCode,
        country: order.country,
        carrier: order.carrier,
        trackingNumber: order.trackingNumber,
        productName: order.productName,
        subtotal: order.subtotal,
        discount: order.discount,
        total: order.total,
        discountCode: order.discountCode,
        discountPercentage: order.discountPercentage,
        stripePaymentIntentId: order.stripePaymentIntentId,
        status: order.status,
        orderPlacedAt: order.orderPlacedAt,
        paymentCompletedAt: order.paymentCompletedAt,
        shippedAt: order.shippedAt,
        canceledAt: order.canceledAt
      };

      setDetailsData(dataForDetails);

      setCancelLoading(false);
      setCancelModal(false);
    } catch (error) {
      setCancelError(error.response.data.message);
      setCancelLoading(false);
    }
  };

  const handleNavigateBack = () => {
    history.goBack();
  };

  const handleOpenShipModal = () => {
    setShipModal(true);
  };

  const handleCloseShipModal = () => {
    setShipModal(false);
  };

  const handleInputCarrier = (e) => {
    setCarrier(e.target.value);
  };

  const handleInputTrackingNumber = (e) => {
    setTrackingNumber(e.target.value);
  };

  const handleOpenCancelModal = () => {
    setCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    setCancelModal(false);
  };

  const handleNavigateEdit = () => {
    history.push(`/orders/${detailsData.id}/edit`);
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

      <div className='block is-flex is-justify-content-space-between is-align-items-center'>
        <p className='is-size-3'>Order Details</p>
        <button
          className='button is-link'
          onClick={handleOpenShipModal}
          disabled={detailsData.status !== 'preparing_for_shipment'}
        >
          <span className='icon'>
            <i className='lni lni-delivery' />
          </span>
          <span>Ship</span>
        </button>
      </div>

      <div>

        <div className='block card is-shadowless'>
          <div className='card-content'>

            <div className='columns'>
              
              <div className='column is-half'>
                <p className='has-text-grey'>Order ID</p>
                <p className='is-size-4 has-text-weight-bold'>{detailsData.id}</p>
              </div>

              <div className='column is-half'>
                <p className='has-text-grey'>Stripe PaymentIntent ID</p>
                {
                  detailsData.stripePaymentIntentId ?
                  <p>{detailsData.stripePaymentIntentId}</p> :
                  <p className='has-text-grey-light'>Not available</p>
                }
              </div>

            </div>
          </div>
        </div>

        <div className='block card is-shadowless'>
          <div className='card-content'>
            
            <div className='tags are-medium'>
              <span
                className={`tag ${detailsData.status === 'awaiting_payment' ? 'is-warning' : ''}`}
              >
                Awaiting payment
              </span>
              <span
                className={`tag ${detailsData.status === 'preparing_for_shipment' ? 'is-info' : ''}`}
              >
                Preparing for shipment
              </span>
              <span
                className={`tag ${detailsData.status === 'shipped' ? 'is-success' : ''}`}
              >
                Shipped
              </span>
              <span
                className={`tag ${detailsData.status === 'canceled' ? 'is-danger' : ''}`}
              >
                Canceled
              </span>
            </div>

          </div>
        </div>

        <div className='block card is-shadowless'>
          <div className='card-content'>

            <div className='columns'>
              <div className='column is-half'>
                
                <div className='columns'>
                  <div className='column is-one-quarter'>
                    <p className='has-text-grey'>Name</p>
                  </div>
                  <div className='column is-three-quarters'>
                    <p>{detailsData.name}</p>
                  </div>
                </div>

                <div className='columns'>
                  <div className='column is-one-quarter'>
                    <p className='has-text-grey'>Email</p>
                  </div>
                  <div className='column is-three-quarters'>
                    <p>{detailsData.email}</p>
                  </div>
                </div>

                <div className='columns'>
                  <div className='column is-one-quarter'>
                    <p className='has-text-grey'>Phone number</p>
                  </div>
                  <div className='column is-three-quarters'>
                    <p>{detailsData.phoneNumber}</p>
                  </div>
                </div>

              </div>
              <div className='column is-half'>
                <p className='has-text-grey'>Address</p>
                <p>{detailsData.addressLine1}</p>
                <p>{detailsData.addressLine2}</p>
                <p>{detailsData.city}</p>
                <p>{detailsData.state} {detailsData.postalCode}</p>
                <p>{detailsData.country}</p>
              </div>
            </div>

          </div>
        </div>

        <div className='block card is-shadowless'>
          <div className='card-content'>

            <div className='columns is-variable is-5'>
              
              <div className='column is-two-thirds'>
                
                <div className='is-flex is-justify-content-space-between is-align-items-center'>
                  <p className='has-text-grey'>Item</p>
                  <p>{detailsData.productName}</p>
                </div>

                <hr className='my-3'/>

                <div className='is-flex is-justify-content-space-between is-align-items-center'>
                  <p className='has-text-grey'>Subtotal</p>
                  <p>{formatCurrency(detailsData.subtotal)}</p>
                </div>

                <div className='is-flex is-justify-content-space-between is-align-items-center'>
                  <p className='has-text-grey'>Discount</p>
                  <p>-{formatCurrency(detailsData.discount)}</p>
                </div>

                <hr className='my-3'/>

                <div className='is-flex is-justify-content-space-between is-align-items-center'>
                  <p className='has-text-weight-bold'>Total</p>
                  <p className='has-text-weight-bold'>{formatCurrency(detailsData.total)}</p>
                </div>

              </div>

              <div className='column is-one-third'>
                
                <div className='block'>
                  <p className='has-text-grey'>Discount code</p>
                  {
                    detailsData.discountCode ?
                    <p>{detailsData.discountCode}</p> :
                    <p className='has-text-grey-light'>Not available</p>
                  }
                </div>

                <div className='block'>
                  <p className='has-text-grey'>Discount percentage</p>
                  {
                    detailsData.discountPercentage ?
                    <p>{detailsData.discountPercentage}</p> :
                    <p className='has-text-grey-light'>Not available</p>
                  }
                </div>

              </div>

            </div>

          </div>
        </div>

        <div className='block card is-shadowless'>
          <div className='card-content'>

            <div className='columns'>
              <div className='column is-half'>
                <div className='block'>
                  <p>Order placed</p>
                  {
                    detailsData.orderPlacedAt ?
                    <p className='has-text-grey'>{formatDate(detailsData.orderPlacedAt)}</p> :
                    <p className='has-text-grey-light'>Not available</p>
                  }
                </div>

                <div className='block'>
                  <p>Payment completed</p>
                  {
                    detailsData.paymentCompletedAt ?
                    <p className='has-text-grey'>{formatDate(detailsData.paymentCompletedAt)}</p> :
                    <p className='has-text-grey-light'>Not available</p>
                  }
                </div>

                <div className='block'>
                  <p>Order shipped</p>
                  {
                    detailsData.shippedAt ?
                    <p className='has-text-grey'>{formatDate(detailsData.shippedAt)}</p> :
                    <p className='has-text-grey-light'>Not available</p>
                  }
                </div>

                <div className='block'>
                  <p>Order canceled</p>
                  {
                    detailsData.canceledAt ?
                    <p className='has-text-grey'>{formatDate(detailsData.canceledAt)}</p> :
                    <p className='has-text-grey-light'>Not available</p>
                  }
                </div>
              </div>

              <div className='column is-half'>
                <div className='block'>
                  <p className='has-text-grey'>Carrier</p>
                  {
                    detailsData.carrier ?
                    <p>{detailsData.carrier}</p> :
                    <p className='has-text-grey-light'>Not available</p>
                  }
                </div>
                <div className='block'>
                  <p className='has-text-grey'>Tracking number</p>
                  {
                    detailsData.trackingNumber ?
                    <p>{detailsData.trackingNumber}</p> :
                    <p className='has-text-grey-light'>Not available</p>
                  }
                </div>
              </div>
            </div>
            
            

          </div>
        </div>

        <div className='block card is-shadowless'>
          <div className='card-content'>

            <div className='has-background-white-bis px-5 py-3 block'>
              <div className='is-flex is-justify-content-space-between is-align-items-center'>
                <p className='has-text-danger-dark'>Cancel order</p>
                <button
                  className='button is-danger'
                  onClick={handleOpenCancelModal}
                  disabled={detailsData.status === 'canceled'}
                >
                  Cancel order
                </button>
              </div>
            </div>

            <div className='has-background-white-bis px-5 py-3 block'>
              <div className='is-flex is-justify-content-space-between is-align-items-center'>
                <p className='has-text-danger-dark'>Manually edit order</p>
                <button
                  onClick={handleNavigateEdit}
                  className='button is-danger is-outlined'
                >
                  Manual edit
                </button>
              </div>
            </div>

          </div>
        </div>

        <div className={`modal ${shipModal && 'is-active'}`}>
          <div className='modal-background' />
          <div className='modal-card'>
            <header className='modal-card-head'>
              <p className='modal-card-title'>Ship</p>
              <button
                onClick={handleCloseShipModal}
                type='button'
                className='delete'
                disabled={shipLoading}
              />
            </header>
            <section className='modal-card-body'>
              <form>

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

                {
                  shipError &&
                  <div className='field'>
                    <p className="help is-danger">{shipError}</p>
                  </div>
                }

              </form>
            </section>
            <footer className='modal-card-foot'>
              <button
                onClick={handleShip}
                className={`button is-link ${shipLoading ? 'is-loading' : ''}`}
                disabled={shipLoading}
              >
                Confirm ship
              </button>
              <button
                onClick={handleCloseShipModal}
                type='button'
                className='button'
                disabled={shipLoading}
              >
                Cancel
              </button>
            </footer>
          </div>
        </div>

        <div className={`modal ${cancelModal && 'is-active'}`}>
          <div className='modal-background' />
          <div className='modal-card'>
            <header className='modal-card-head'>
              <p className='modal-card-title'>Warning</p>
              <button
                onClick={handleCloseCancelModal}
                type='button'
                className='delete'
                disabled={cancelLoading}
              />
            </header>
            <section className='modal-card-body'>
              <div className='block'>
                <p>Are you sure you want to cancel order?</p>
              </div>

              {
                cancelError &&
                <div className='block'>
                  <p className='help is-danger'>{cancelError}</p>
                </div>
              }

            </section>
            <footer className='modal-card-foot'>
              <button
                onClick={handleCancel}
                className={`button is-danger ${cancelLoading ? 'is-loading' : ''}`}
                disabled={cancelLoading}
              >
                Confirm cancel
              </button>
              <button
                onClick={handleCloseCancelModal}
                type='button'
                className='button'
                disabled={cancelLoading}
              >
                Cancel
              </button>
            </footer>
          </div>
        </div>

      </div>

    </div>
  );
};


export default OrderDetails;
