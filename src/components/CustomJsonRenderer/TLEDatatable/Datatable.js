import React, { useEffect, useState } from "react";
import { forwardRef } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import TablePagination from "@material-ui/core/TablePagination";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/Save";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();

  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const Datatable = (props) => {
  const [count, setCount] = useState(1);
  const [satData, setSatData] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [searchInput, setSearchInput] = useState("");
  console.log("datatable propppssssssss", props.data);
  console.log(
    "datatable propppssssssss boolean",
    props.data.satelliteId === undefined
  );
  const [selectedRow, setSelectedRow] = useState(
    props.data.satelliteId ? props.data : {}
  );

  //for error handling
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    const fetchSatData = async () => {
      try {
        const apiSatData = await axios.get(
          searchInput
            ? `https://tle.ivanstanojevic.me/api/tle/?page=${
                page + 1
              }&page-size=${pageSize}&search=${searchInput}`
            : `https://tle.ivanstanojevic.me/api/tle/?page=${
                page + 1
              }&page-size=${pageSize}`
        );
        const resultsArray = apiSatData.data.member;
        setCount(apiSatData.data.totalItems);
        
        setSatData([...resultsArray]);

        
      } catch (error) {
        setErrorMessages(["Cannot load user data"]);
        setIserror(true);
      }
    };

    fetchSatData();
  }, [page]);

  useEffect(() => {
    const fetchSatData = async () => {
      try {
        const apiSatData = await axios.get(
          `https://tle.ivanstanojevic.me/api/tle/?page=${1}&page-size=${pageSize}&search=${searchInput}`
        );
        const resultsArray = apiSatData.data.member;
        setCount(apiSatData.data.totalItems);
        setSatData([...resultsArray]);
        setPage(0);
      } catch (error) {
        setErrorMessages(["Cannot load user data"]);
        setIserror(true);
      }
    };

    searchInput ? fetchSatData() : "do nothing";
  }, [searchInput]);

  const handleSearchInput = (event) => {
    setSearchInput(event.target.value);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // const handleChangeRowsPerPage = (event) => {
  //   setPageSize(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  const handleSelectedItemChange = (rowData) => {
    props.handleChange(props.path, rowData);
  };
  const tableRef = React.useRef();
  return (
    <div className="p-4">
      <div className="mb-5">
        <div className="d-flex flex-row justify-content-around align-items-center mt-4 mb-4">
          <TextField
            id="standard-basic"
            label="Search TLE"
            placeholder="Search by Satellite id or Name"
            onChange={handleSearchInput}
            variant="outlined"
            helperText="Search by Satellite id or Name"
            fullWidth
          />
        </div>
        {satData.length > 0 && selectedRow !== {} ? (
          <MaterialTable
            icons={tableIcons}
            columns={[
              { title: "Id", field: "satelliteId", width: "0.5%",
              cellStyle: {
                paddingLeft: '6px',
                paddingRight: '2px'
              }},
              { title: "Satellite Name", field: "name", width: "0.5%",cellStyle: {
                paddingLeft: '2px',paddingRight: '2px',
              }
             },
              {
                title: "Satellite Name",
                field: "line1",
                width: "0.5%",
                hidden: true
              },
              {
                title: "Satellite Name",
                field: "line2",
                width: "0.5%",
                hidden: true,
              },
              {
                title: "Two Line Element",
                field: "line",
                width: "99%",
                cellStyle: {
                  paddingLeft: '2px',paddingRight: '2px',
                },
                render: (rowData) => (
                  <div>
                    <p>{rowData.line1}</p> <p>{rowData.line2}</p>
                  </div>
                ),
              },
            ]}
            data={satData}
            options={{
              search: false,
              showTitle: false,
              rowStyle: (rowData) => ({
                backgroundColor:
                  selectedRow.satelliteId === rowData.satelliteId
                    ? "#EEE"
                    : "#FFF",
              }),
            }}
            onRowClick={(evt, selectedRow) => {
              handleSelectedItemChange(selectedRow);
              setSelectedRow(selectedRow);
            }}
            components={{
              Pagination: (props) => (
                <TablePagination
                  component="div"
                  colSpan={props.colSpan}
                  count={count}
                  rowsPerPageOptions={[5]}
                  rowsPerPage={pageSize}
                  page={page}
                  onChangePage={handleChangePage}
                  // onChangeRowsPerPage={handleChangeRowsPerPage}
                  // onPageChange={handleChangePage}
                  // onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              ),
              Toolbar: (props) => (
                <div>
                  <MTableToolbar
                    {...props}

                  />
                </div>
              ),
            }}
          />
        ) : (
          <div className="d-flex flex-column justify-content-center align-items-center mb-5">
            <h4>loading.......</h4>
          </div>
        )}
      </div>

      <div className=" mt-5 mb-5 ">
        <div className="d-flex flex-column justify-content-start">
          <h1>Selected Satellite data</h1>
          {selectedRow.satelliteId ? (
            <div>
              <p>{selectedRow.name}</p>
              <p>{selectedRow.line1}</p>
              <p>{selectedRow.line2}</p>
            </div>
          ) : (
            <div> Please Click the table to select the TLE </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Datatable;
