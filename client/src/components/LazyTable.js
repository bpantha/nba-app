import React from "react";
import { useState, useEffect } from "react";
import { PlayerCard } from "./PlayerCard";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Container,
} from "@mui/material";

const mvp = require("../images/mvp.jpeg");
const dpoy = require("../images/dpoy.jpeg");
const mip = require("../images/mip.png");
const roy = require("../images/roy.jpeg");
const smoy = require("../images/smoy.jpeg");

// LazyTable is paginated and takes in data prop which is a json object and maps keys to columns and values to row

export function LazyTable({
  data,
  seasons,
  defaultPageSize = 5,
  pageSizeOptions = [5, 10, 25, 50],
}) {
  // get the keys and store in columns array
  const columns = data?.[0] ? Object.keys(data[0]) : [];
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize ?? 5);

  useEffect(() => {
    setPage(0);
  }, [data]);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangePageSize = (e) => {
    const newPageSize = e.target.value;
    setPageSize(newPageSize);
    setPage(0);
  };

  // add award images to each award
  // takes in award name and returns a TableCell component with the associated image

  function TableCellWithImage(award) {
    const { value } = award;
    let content;

    // Check if the value is the one that needs an image
    if (value === "nba mvp") {
      content = (
        <img src={mvp} alt={value} style={{ width: "50px", height: "50px" }} />
      );
    }
    if (value === "nba roy") {
      content = (
        <img src={roy} alt={value} style={{ width: "50px", height: "50px" }} />
      );
    }
    if (value === "smoy") {
      content = (
        <img src={smoy} alt={value} style={{ width: "50px", height: "50px" }} />
      );
    }
    if (value === "mip") {
      content = (
        <img src={mip} alt={value} style={{ width: "50px", height: "50px" }} />
      );
    }
    if (value === "dpoy") {
      content = (
        <img src={dpoy} alt={value} style={{ width: "50px", height: "50px" }} />
      );
    }

    return <TableCell {...award}>{content}</TableCell>;
  }

  if (!Array.isArray(data) || data === null || data.length === 0) {
    return (
      <Container maxWidth="100%" sx={{ padding: 5 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  No data available
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Container>
    );
  }

  if (seasons) {
    const seasonString = `Season: ${seasons}`;
    return (
      <Container maxWidth="100%" sx={{ padding: 5 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column}
                    sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * pageSize, page * pageSize + pageSize)
                .map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => {
                      // check if entry is any award
                      if (
                        row[column] === "nba mvp" ||
                        row[column] === "mip" ||
                        row[column] === "nba roy" ||
                        row[column] === "dpoy" ||
                        row[column] === "smoy"
                      ) {
                        return (
                          <TableCellWithImage
                            key={column}
                            value={row[column]}
                          />
                        );
                      } else if (column === "player_name") {
                        return (
                          <TableCell key={column}>
                            <PlayerCard player={row[column]} />
                          </TableCell>
                        );
                      } else if (column === "team" || column === "season") {
                        return (
                          <TableCell key={column}>{row[column]}</TableCell>
                        );
                      } else {
                        return (
                          <TableCell key={column}>{row[column]}</TableCell>
                        );
                      }
                    })}
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
      </Container>
    );
  }
}

export default LazyTable;
