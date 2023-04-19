import React from 'react';
import {useState } from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination} from '@mui/material';


// LazyTable is paginated and takes in data prop which is a json object and maps keys to columns and values to row

export function LazyTable({
   data,
   seasons,
   defaultPageSize = 10, 
   pageSizeOptions = [5, 10, 25, 50] }) {
  
  // get the keys and store in columns array
  const columns = data?.[0] ? Object.keys(data[0]) : [];

  
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize ?? 10);

  const handleChangePage = (e, newPage) => {
    // Can always go to previous page (TablePagination prevents negative pages)
    // but only fetch next page if we haven't reached the end (currently have full page of data)
    // if (newPage < page || data.length === pageSize) {
      // Note that we set newPage + 1 since we store as 1 indexed but the default pagination gives newPage as 0 indexed
      setPage(newPage);
    // }
  };

  const handleChangePageSize = (e) => {
    const newPageSize = e.target.value;
    setPageSize(newPageSize);
    setPage(0);
  };

  if(seasons) {
    const seasonString = `Season: ${seasons}`;
  return (
    <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column} sx={{ fontWeight: 'bold' , textTransform: 'uppercase'}}>
                  {column} 
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * pageSize, page * pageSize + pageSize).map((row, index) => (
              <TableRow
                key={index}
              >
                {columns.map((column) => (
                  <TableCell key={column}>{row[column]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      <TablePagination
        rowsPerPageOptions={pageSizeOptions}
        component="div"
        count={data.length}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangePageSize}
      />
    </TableContainer>
  );
}

}

export default LazyTable;

