import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import {
  useHistory
} from 'react-router-dom';

import { apiUrl } from '../../config.js';
import Spinner from '../../components/Spinner.js';

const DiscountCodeView = () => {
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
          url: `${apiUrl}/api/v1/admin/discount-codes`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          cancelToken: source.token
        });

        const { discountCodes, pagination } = response.data.data;

        const dataForTable = discountCodes.map((item) => ({
          id: item.id,
          code: item.code,
          discountPercentage: item.discountPercentage,
          isActive: item.isActive
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
    history.push('/discount-codes/add');
  };

  const handleChangePage = async (page, totalRows) => {
    try {
      setPaginationLoading(true);

      const accessToken = localStorage.getItem('token');
      const response = await axios({
        method: 'get',
        url: `${apiUrl}/api/v1/admin/discount-codes`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: { page: page }
      });

      const { discountCodes, pagination } = response.data.data;

      const dataForTable = discountCodes.map((item) => ({
        id: item.id,
        code: item.code,
        discountPercentage: item.discountPercentage,
        isActive: item.isActive
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
    history.push(`/discount-codes/${id}`);
  };

  const columns = [
    {
      name: 'id',
      selector: 'id',
      wrap: true,
      maxWidth: '100px'
    },
    {
      name: 'code',
      selector: 'code',
      wrap: true
    },
    {
      name: 'discountPercentage',
      selector: 'discountPercentage',
      wrap: true
    },
    {
      name: 'isActive',
      selector: (row) => ( row.isActive.toString() ),
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
        <p className='is-size-3'>Discount Codes</p>
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
    history.push(`/discount-codes/${id}/edit`);
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

export default DiscountCodeView;
