import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import {
  useHistory
} from 'react-router-dom';

import { apiUrl } from '../../config.js';
import { formatCurrency } from '../../utils';
import Spinner from '../../components/Spinner.js';

const ProductView = () => {
  const history = useHistory();

  const [dataLoading, setDataLoading] = useState(true);
  const [tableData, setTableData] = useState([]);

  const [paginationData, setPaginationData] = useState({});
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const getData = async (accessToken) => {
      try {
        const response = await axios({
          method: 'get',
          url: `${apiUrl}/api/v1/admin/products`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          cancelToken: source.token
        });

        const { products, pagination } = response.data.data;

        const dataForTable = products.map((item) => ({
          id: item.id,
          name: item.name,
          regularPrice: item.regularPrice,
          salePrice: item.salePrice,
          isAvailable: item.isAvailable,
          isPublic: item.isPublic
        }));

        const dataForPagination = {
          currentPage: pagination.currentPage,
          currentPageSize: pagination.currentPageSize,
          totalItems: pagination.totalItems,
          totalPages: pagination.totalPages
        };

        setTableData(dataForTable);
        setPaginationData(dataForPagination);

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

  const handleNavigateAdd = () => {
    history.push('/products/add');
  };

  const handleChangePage = async (page, totalRows) => {
    try {
      setPaginationLoading(true);

      const accessToken = localStorage.getItem('token');
      const response = await axios({
        method: 'get',
        url: `${apiUrl}/api/v1/admin/products`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: { page: page }
      });

      const { products, pagination } = response.data.data;

      const dataForTable = products.map((item) => ({
        id: item.id,
        name: item.name,
        regularPrice: item.regularPrice,
        salePrice: item.salePrice,
        isAvailable: item.isAvailable,
        isPublic: item.isPublic
      }));

      const dataForPagination = {
        currentPage: pagination.currentPage,
        currentPageSize: pagination.currentPageSize,
        totalItems: pagination.totalItems,
        totalPages: pagination.totalPages
      };

      setTableData(dataForTable);
      setPaginationData(dataForPagination);

      setPaginationLoading(false);
    } catch (error) {
      setResetPaginationToggle(!resetPaginationToggle);
      setPaginationLoading(false);
    }
  };

  const handleRowClicked = (data) => {
    const { id } = data;
    history.push(`/products/${id}`);
  };

  const columns = [
    {
      name: 'id',
      selector: 'id',
      wrap: true,
      maxWidth: '100px'
    },
    {
      name: 'name',
      selector: 'name',
      wrap: true
    },
    {
      name: 'regularPrice',
      selector: (row) => ( formatCurrency(row.regularPrice) ),
      wrap: true
    },
    {
      name: 'salePrice',
      selector: (row) => ( formatCurrency(row.salePrice) ),
      wrap: true
    },
    {
      name: 'isAvailable',
      selector: (row) => (
        row.isAvailable ?
        <span className='tag is-success is-light'>{row.isAvailable.toString()}</span> :
        <span className='tag is-danger is-light'>{row.isAvailable.toString()}</span>
      ),
      wrap: true
    },
    {
      name: 'isPublic',
      selector: (row) => (
        row.isPublic ?
        <span className='tag is-success is-light'>{row.isPublic.toString()}</span> :
        <span className='tag is-danger is-light'>{row.isPublic.toString()}</span>
      ),
      wrap: true
    },
    {
      name: '',
      selector: (row) => (
        <ActionButtons id={row.id} />
      ),
      right: true,
      maxWidth: '100px'
    }
  ];

  if (dataLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <div
        className='block is-flex is-justify-content-space-between is-align-items-center'
      >
        <p className='is-size-3'>Products</p>
        <button
          onClick={handleNavigateAdd}
          type='button'
          className='button is-link'
        >
          Add new
        </button>
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        highlightOnHover
        pointerOnHover
        onRowClicked={handleRowClicked}
        pagination
        paginationServer
        paginationPerPage={25}
        paginationRowsPerPageOptions={[25]}
        paginationTotalRows={paginationData.totalItems}
        onChangePage={handleChangePage}
        paginationResetDefaultPage={resetPaginationToggle}
        progressPending={paginationLoading}
        progressComponent={<Spinner />}
        noHeader
      />
    </div>
  );
};

const ActionButtons = (props) => {
  const { id } = props;

  const history = useHistory();

  const handleNavigateEdit = () => {
    history.push(`/products/${id}/edit`);
  };

  return (
    <button
      onClick={handleNavigateEdit}
      type='button'
      className='button is-small'
    >
      <i className='lni lni-pencil' />
    </button>
  );
};

export default ProductView;
