import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  useHistory,
  useParams
} from 'react-router-dom';
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';

import { apiUrl } from '../../config.js';
import { formatCurrency, formatDate } from '../../utils';
import Spinner from '../../components/Spinner.js';

const ProductDetails = () => {
  const { productId } = useParams();
  const history = useHistory();

  const [dataLoading, setDataLoading] = useState(true);
  const [detailsData, setDetailsData] = useState({});

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [changeImageModal, setChangeImageModal] = useState(false);
  const [changeImageLoading, setChangeImageLoading] = useState(false);
  const [changeImageError, setChangeImageError] = useState('');
  const [previewChangeImageName, setPreviewChangeImageName] = useState('');
  const [previewChangeImageUrl, setPreviewChangeImageUrl] = useState(null);
  const [selectedChangeImageFile, setSelectedChangeImageFile] = useState(null);

  const [addGalleryImageModal, setAddGalleryImageModal] = useState(false);
  const [addGalleryImageLoading, setAddGalleryImageLoading] = useState(false);
  const [addGalleryImageError, setAddGalleryImageError] = useState('');
  const [previewAddGalleryImageName, setPreviewAddGalleryImageName] = useState('');
  const [previewAddGalleryImageUrl, setPreviewAddGalleryImageUrl] = useState(null);
  const [selectedAddGalleryImageFile, setSelectedAddGalleryImageFile] = useState(null);

  const [deleteGalleryImageModal, setDeleteGalleryImageModal] = useState(false);
  const [deleteGalleryImageLoading, setDeleteGalleryImageLoading] = useState(false);
  const [deleteGalleryImageLoadingId, setDeleteGalleryImageLoadingId] = useState(null);
  const [deleteGalleryImageError, setDeleteGalleryImageError] = useState('');

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

        const dataForDetails = {
          id: product.id,
          name: product.name,
          shortDescription: product.shortDescription,
          longDescription: product.longDescription,
          regularPrice: product.regularPrice,
          salePrice: product.salePrice,
          isAvailable: product.isAvailable,
          isPublic: product.isPublic,
          imageFileName: product.imageFileName,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          GalleryImages: product.GalleryImages
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

  const handleNavigateEdit = () => {
    history.push(`/products/${detailsData.id}/edit`);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      const accessToken = localStorage.getItem('token');

      await axios({
        method: 'delete',
        url: `${apiUrl}/api/v1/admin/products/${detailsData.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      history.push('/products');

      setDeleteLoading(false);
    } catch (error) {
      setDeleteLoading(false);
    }
  };

  const handleUploadChangeImage = async () => {
    try {
      setChangeImageLoading(true);

      const accessToken = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('file', selectedChangeImageFile);

      const response = await axios({
        method: 'post',
        url: `${apiUrl}/api/v1/admin/products/${detailsData.id}/change-image`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      });

      const savedProduct = response.data.data;
      console.log(savedProduct);

      
      setPreviewChangeImageName('');
      setPreviewChangeImageUrl(null);
      setSelectedChangeImageFile(null);
      setDetailsData({
        ...detailsData,
        imageFileName: savedProduct.imageFileName
      });
      setChangeImageLoading(false);
      setChangeImageModal(false);
    } catch (error) {
      console.log(error.response.data.message);
      setChangeImageError(error.response.data.message);
      setChangeImageLoading(false);
    }
  };

  const handleUploadAddGalleryImage = async () => {
    try {
      setAddGalleryImageLoading(true);
      setAddGalleryImageError('');

      const accessToken = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('file', selectedAddGalleryImageFile);

      const response = await axios({
        method: 'post',
        url: `${apiUrl}/api/v1/admin/products/${detailsData.id}/add-gallery-image`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      });

      const savedProduct = response.data.data;
      // console.log(savedProduct);
      
      setPreviewAddGalleryImageName('');
      setPreviewAddGalleryImageUrl(null);
      setSelectedAddGalleryImageFile(null);
      setDetailsData({
        ...detailsData,
        GalleryImages: [...savedProduct.GalleryImages]
      });
      setAddGalleryImageLoading(false);
      setAddGalleryImageModal(false);
    } catch (error) {
      console.log(error.response.data.message);
      setAddGalleryImageError(error.response.data.message);
      setAddGalleryImageLoading(false);
    }
  };

  const handleDeleteGalleryImage = async (galleryImageId) => {
    try {
      setDeleteGalleryImageLoading(true);
      setDeleteGalleryImageLoadingId(galleryImageId);
      setDeleteGalleryImageError('');

      const accessToken = localStorage.getItem('token');

      const response = await axios({
        method: 'post',
        url: `${apiUrl}/api/v1/admin/products/${detailsData.id}/delete-gallery-image/${galleryImageId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const savedProduct = response.data.data;
      setDetailsData({
        ...detailsData,
        GalleryImages: [...savedProduct.GalleryImages]
      });
      setDeleteGalleryImageLoadingId(null);
      setDeleteGalleryImageLoading(false);
    } catch (error) {
      setDeleteGalleryImageError(error.response.data.message);
      setDeleteGalleryImageLoadingId(null);
      setDeleteGalleryImageLoading(false);
    }
  };

  const handleChangeImage = (e) => {
    e.preventDefault();
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      // console.log(file);
      const url = URL.createObjectURL(file);
      setSelectedChangeImageFile(file);
      setPreviewChangeImageUrl(url);
      setPreviewChangeImageName(file.name);
      setChangeImageError('');
    }
  };

  const handleAddGalleryImage = (e) => {
    e.preventDefault();
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      // console.log(file);
      const url = URL.createObjectURL(file);
      setSelectedAddGalleryImageFile(file);
      setPreviewAddGalleryImageUrl(url);
      setPreviewAddGalleryImageName(file.name);
      setAddGalleryImageError('');
    }
  };

  const handleOpenDeleteModal = () => {
    setDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
  };

  const handleOpenChangeImageModal = () => {
    setChangeImageModal(true);
  };

  const handleCloseChangeImageModal = () => {
    setChangeImageModal(false);
  };

  const handleOpenAddGalleryImageModal = () => {
    setAddGalleryImageModal(true);
  };

  const handleCloseAddGalleryImageModal = () => {
    setAddGalleryImageModal(false);
  };

  const handleOpenDeleteGalleryImageModal = () => {
    setDeleteGalleryImageModal(true);
  };

  const handleCloseDeleteGalleryImageModal = () => {
    setDeleteGalleryImageModal(false);
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
        <p className='is-size-3'>Product Details</p>
        <div className='buttons'>
          <button
            type='button'
            onClick={handleNavigateEdit}
            className='button is-link'
          >
            Edit
          </button>
          <button
            type='button'
            onClick={handleOpenDeleteModal}
            className='button is-danger'
          >
            Delete
          </button>
        </div>
      </div>

      <div>

        <div className='block card is-shadowless'>
          <div className='card-content'>

            <div className='columns'>
              
              <div className='column is-half'>
                <div className='block'>
                  <p className='has-text-grey'>ID</p>
                  <p>{detailsData.id}</p>
                </div>
                <div className='block'>
                  <p className='has-text-grey'>Name</p>
                  <p>{detailsData.name}</p>
                </div>
              </div>

              <div className='column is-half'>
                <p className='has-text-grey mb-3'>Image</p>
                <div style={{
                  width: '155px',
                  height: '155px',
                  border: 'solid 1px #dbdbdb',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <img src={detailsData.imageFileName} style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'contain'
                   }} alt='product'/>
                </div>
                <div>
                  <button
                    type='button'
                    className='button is-small mt-3 is-light'
                    onClick={handleOpenChangeImageModal}
                  >
                    Change image
                  </button>
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
                  <p className='has-text-grey'>Regular price</p>
                  <p>{formatCurrency(detailsData.regularPrice)}</p>
                </div>
                <div className='block'>
                  <p className='has-text-grey'>Sale price</p>
                  <p>{formatCurrency(detailsData.salePrice)}</p>
                </div>
              </div>

              <div className='column is-half'>
                <div className='block'>
                  <p className='has-text-grey'>isAvailable</p>
                  <p>{detailsData.isPublic.toString()}</p>
                </div>
                <div className='block'>
                  <p className='has-text-grey'>isPublic</p>
                  <p>{detailsData.isPublic.toString()}</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className='block card is-shadowless'>
          <div className='card-header is-flex is-align-items-center pr-3'>
            <p className='card-header-title'>Product Gallery</p>
            <button
              onClick={handleOpenDeleteGalleryImageModal}
              className='button is-small is-light'
              type='button'
            >
              <span className='icon'>
                <i className='lni lni-pencil'></i>
              </span>
              <span>Edit</span>
            </button>
          </div>
          <div className='card-content'>
            <div className='is-flex is-align-items-center is-flex-wrap-wrap'>
              {
                detailsData.GalleryImages.map((item) => (
                  <div key={item.imageFileName} style={{
                    width: '105px',
                    height: '105px',
                    marginRight: '0.75rem',
                    marginBottom: '0.75rem',
                    border: 'solid 1px #dbdbdb',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <img
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'contain'
                      }}
                      src={item.imageFileName}
                      alt='product gallery'
                    />
                  </div>
                ))
              }
              <div style={{
                width: '105px',
                height: '105px',
                marginRight: '0.75rem',
                marginBottom: '0.75rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <button
                  className='button is-light'
                  type='button'
                  onClick={handleOpenAddGalleryImageModal}
                >
                  <span className='icon'>
                    <i className='lni lni-plus'></i>
                  </span>
                </button>
              </div>
              
            </div>
            
          </div>
        </div>

        <div className='block card is-shadowless'>
          <div className='card-header'>
            <p className='card-header-title'>Short description</p>
          </div>
          <div className='card-content content'>
            {
              unified()
                .use(parse)
                .use(remark2react)
                .processSync(detailsData.shortDescription).result
            }
          </div>
        </div>

        <div className='block card is-shadowless'>
          <div className='card-header'>
            <p className='card-header-title'>Long description</p>
          </div>
          <div
            className='card-content content'
            style={{
              maxHeight: '500px',
              overflowY: 'scroll'
            }}
          >
            {
              unified()
                .use(parse)
                .use(remark2react)
                .processSync(detailsData.longDescription).result
            }
          </div>
        </div>

        <div className='block card is-shadowless'>
          <div className='card-content'>
            <div className='columns'>
              <div className='column is-half'>
                <div className='block'>
                  <p className='has-text-grey'>Created at</p>
                  <p>{formatDate(detailsData.createdAt)}</p>
                </div>
              </div>
              <div className='column is-half'>
                <div className='block'>
                  <p className='has-text-grey'>Updated at</p>
                  <p>{formatDate(detailsData.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`modal ${changeImageModal && 'is-active'}`}>
          <div className='modal-background' />
          <div className='modal-card'>
            <header className='modal-card-head'>
              <p className='modal-card-title'>Change product image</p>
              <button
                onClick={handleCloseChangeImageModal}
                type='button'
                className='delete'
                disabled={changeImageLoading}
              />
            </header>
            <section className='modal-card-body'>
              <div className='is-flex is-flex-direction-column is-justify-content-space-between is-align-items-center block'>
                <div style={{
                  width: '205px',
                  height: '205px',
                  border: 'solid 1px #dbdbdb',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {
                    previewChangeImageUrl &&
                    <img src={previewChangeImageUrl} alt='preview' style={{
                      width: '200px',
                      height: '200px',
                      objectFit: 'contain'
                    }}/>
                  }
                </div>
              </div>
              <form className='block'>
                <div className='file is-fullwidth has-name'>
                  <label className='file-label'>
                    <input onChange={handleChangeImage} className='file-input' type='file'/>
                    <span className='file-cta'>
                      <span className='file-icon'>
                        <i className='lni lni-upload'></i>
                      </span>
                      <span className='file-label'>Choose a file...</span>
                    </span>
                    <span className='file-name'>
                      {
                        previewChangeImageName !== '' ?
                        previewChangeImageName :
                        'No file selected...'
                      }
                    </span>
                  </label>
                </div>
              </form>
              {
                changeImageError &&
                <div className='block'>
                  <p className='help is-danger'>{changeImageError}</p>
                </div>
              }
            </section>
            <footer className='modal-card-foot'>
              <button
                onClick={handleUploadChangeImage}
                className={`button is-link ${changeImageLoading ? 'is-loading' : ''}`}
                disabled={changeImageLoading}
              >
                Confirm
              </button>
              <button
                onClick={handleCloseChangeImageModal}
                type='button'
                className='button'
                disabled={changeImageLoading}
              >
                Cancel
              </button>
            </footer>
          </div>
        </div>

        <div className={`modal ${addGalleryImageModal && 'is-active'}`}>
          <div className='modal-background' />
          <div className='modal-card'>
            <header className='modal-card-head'>
              <p className='modal-card-title'>Add image to product gallery</p>
              <button
                onClick={handleCloseAddGalleryImageModal}
                type='button'
                className='delete'
                disabled={addGalleryImageLoading}
              />
            </header>
            <section className='modal-card-body'>
              <div className='is-flex is-flex-direction-column is-justify-content-space-between is-align-items-center block'>
                <div style={{
                  width: '205px',
                  height: '205px',
                  border: 'solid 1px #dbdbdb',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {
                    previewAddGalleryImageUrl &&
                    <img src={previewAddGalleryImageUrl} alt='preview' style={{
                      width: '200px',
                      height: '200px',
                      objectFit: 'contain'
                    }}/>
                  }
                </div>
              </div>
              <form className='block'>
                <div className='file is-fullwidth has-name'>
                  <label className='file-label'>
                    <input onChange={handleAddGalleryImage} className='file-input' type='file'/>
                    <span className='file-cta'>
                      <span className='file-icon'>
                        <i className='lni lni-upload'></i>
                      </span>
                      <span className='file-label'>Choose a file...</span>
                    </span>
                    <span className='file-name'>
                      {
                        previewAddGalleryImageName !== '' ?
                        previewAddGalleryImageName :
                        'No file selected...'
                      }
                    </span>
                  </label>
                </div>
              </form>
              {
                addGalleryImageError &&
                <div className='block'>
                  <p className='help is-danger'>{addGalleryImageError}</p>
                </div>
              }
            </section>
            <footer className='modal-card-foot'>
              <button
                onClick={handleUploadAddGalleryImage}
                className={`button is-link ${addGalleryImageLoading ? 'is-loading' : ''}`}
                disabled={addGalleryImageLoading}
              >
                Confirm
              </button>
              <button
                onClick={handleCloseAddGalleryImageModal}
                type='button'
                className='button'
                disabled={addGalleryImageLoading}
              >
                Cancel
              </button>
            </footer>
          </div>
        </div>

        <div className={`modal ${deleteGalleryImageModal && 'is-active'}`}>
          <div className='modal-background' />
          <div className='modal-card'>
            <header className='modal-card-head'>
              <p className='modal-card-title'>Edit Product Gallery</p>
              <button
                onClick={handleCloseDeleteGalleryImageModal}
                type='button'
                className='delete'
                disabled={deleteGalleryImageLoading}
              />
            </header>
            <section className='modal-card-body'>
              {
                detailsData.GalleryImages.map((item) => (
                  <div
                    key={item.id}
                    className='box is-shadowless is-flex is-justify-content-space-around is-align-items-center'
                    style={{
                      borderBottom: 'solid 1px #dbdbdb'
                    }}
                  >
                    <div style={{
                      width: '105px',
                      height: '105px',
                      border: 'solid 1px #dbdbdb',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <img
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'contain'
                        }}
                        src={item.imageFileName}
                        alt='product gallery'
                      />
                    </div>
                    <button
                      onClick={() => { handleDeleteGalleryImage(item.id) }}
                      className={`button is-danger is-outlined ${deleteGalleryImageLoadingId === item.id ? 'is-loading' : ''}`}
                      type='button'
                      disabled={deleteGalleryImageLoading}
                    >
                      Delete
                    </button>
                    
                  </div>
                ))
              }
            </section>
            <footer className='modal-card-foot'>
              {
                deleteGalleryImageError &&
                <p className='help is-danger'>{deleteGalleryImageError}</p>
              }
            </footer>
          </div>
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


    </div>
  );
};


export default ProductDetails;
