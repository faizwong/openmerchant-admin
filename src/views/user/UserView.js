import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import {
  useHistory
} from 'react-router-dom';

import { apiUrl } from '../../config.js';
import Spinner from '../../components/Spinner.js';

const UserView = () => {
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
          url: `${apiUrl}/api/v1/admin/users`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          cancelToken: source.token
        });

        const { users, pagination } = response.data.data;

        const dataForTable = users.map((item) => ({
          id: item.id,
          email: item.email
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
        url: `${apiUrl}/api/v1/admin/users`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: { page: page }
      });

      const { users, pagination } = response.data.data;

      const dataForTable = users.map((item) => ({
        id: item.id,
        email: item.email
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
    history.push(`/users/${id}`);
  };

  const columns = [
    {
      name: 'id',
      selector: 'id',
      wrap: true,
      maxWidth: '100px'
    },
    {
      name: 'email',
      selector: 'email',
      wrap: true
    }
  ];

  if (dataLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className='block'>
        <p className='is-size-3'>Users</p>
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

export default UserView;
