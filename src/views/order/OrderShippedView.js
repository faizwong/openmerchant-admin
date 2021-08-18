import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import {
  useHistory
} from 'react-router-dom';

import { formatCurrency, formatDate } from '../../utils';
import { apiUrl } from '../../config.js';
import Spinner from '../../components/Spinner.js';

const OrderShippedView = () => {
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
          url: `${apiUrl}/api/v1/admin/orders/shipped`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          cancelToken: source.token
        });

        const { orders, pagination } = response.data.data;

        const dataForTable = orders.map((item) => ({
          id: item.id,
          name: item.name,
          productName: item.productName,
          total: item.total,
          status: item.status,
          orderPlacedAt: item.orderPlacedAt
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

  const handleChangePage = async (page, totalRows) => {
    try {
      setPaginationLoading(true);

      const accessToken = localStorage.getItem('token');
      const response = await axios({
        method: 'get',
        url: `${apiUrl}/api/v1/admin/orders/shipped`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: { page: page }
      });

      const { orders, pagination } = response.data.data;

      const dataForTable = orders.map((item) => ({
        id: item.id,
        name: item.name,
        productName: item.productName,
        total: item.total,
        status: item.status,
        orderPlacedAt: item.orderPlacedAt
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
    history.push(`/orders/${id}`);
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
      name: 'productName',
      selector: 'productName',
      wrap: true
    },
    {
      name: 'total',
      selector: (row) => ( formatCurrency(row.total) ),
      wrap: true
    },
    {
      name: 'status',
      selector: (row) => {
        let variant;
        let text;
        switch (row.status) {
          case 'awaiting_payment': {
            variant = 'is-warning';
            text = 'Awaiting payment'
            break;
          }
          case 'preparing_for_shipment': {
            variant = 'is-info';
            text = 'Preparing for shipment'
            break;
          }
          case 'shipped': {
            variant = 'is-success';
            text = 'Shipped'
            break;
          }
          case 'canceled': {
            variant = 'is-danger';
            text = 'Canceled'
            break;
          }
          default: {
            variant = 'is-light';
            text = 'undefined'
          }
        }
        return (
          <span className={`tag ${variant}`}>{text}</span>
        );
      },
      wrap: true
    },
    {
      name: 'orderPlacedAt',
      selector: (row) => ( formatDate(row.orderPlacedAt) ),
      wrap: true
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
        <p className='is-size-3'>Shipped orders</p>
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

export default OrderShippedView;
