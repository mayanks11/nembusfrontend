import React, { useEffect, useState } from "react";
import { forwardRef } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import TablePagination from "@material-ui/core/TablePagination";
import Checkbox from "@material-ui/core/Checkbox";
import axios from "axios";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { connect } from "react-redux";
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
import { setAutoFreeze } from 'immer';

import _ from "lodash";
import { cloneDeep } from "lodash";
import { ContinuousColorLegend } from "react-vis";


setAutoFreeze(false);

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

const VisibilityReport = (props) => {
    const [count, setCount] = useState(1);
    const [satData, setSatData] = useState([]);
    const [page, setPage] = useState(0);

    //for error handling
    const [iserror, setIserror] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);

    useEffect(() => {
        const fetchSatData = async () => {
            try {

                const resultsArray = props.groundStation.GroundStationCollection;
                setCount(resultsArray.totalItems);

                
                const dataList = Object.entries(resultsArray).map(
                    ([key, values]) => ({
                        groundstationName: values.groundstationname,
                        lattitude: values.latitude.value,
                        lattitude_unit: values.latitude.unit,
                        longitude: values.longitude.value,
                        longitude_unit: values.longitude.unit,
                        height: values.height.value,
                        height_unit: values.height.unit,
                        id: values.id,
                        projectid: values.projectID,
                        simulationid: values.simulationID,
                        key: key,
                        checked: false
                        // checked: props.data.length === 0 ?true:false
                    })
                );
                dataList.map((ele) => {
                    if (props.data.map((obj) => obj.id).includes(ele.id)) {
                        ele.checked = true;
                        setCheckedItems([...checkedItems, ele])
                    }
                })

                props.data.map((obj) => {
                    if (dataList.map((ele) => ele.id).includes(obj.id)) {
                        //do nothing
                    }
                    else {
                        obj.checked = true;
                        dataList.push(obj)
                    }
                })
                console.log("gs data", dataList);
                setSatData(dataList);


            } catch (error) {
                setErrorMessages(["Cannot load user data"]);
                setIserror(true);
            }
        };
        console.log("Upated the Concomponent", props);
        fetchSatData();
    }, []);

    useEffect(() => {
        console.log("satdataaaa", satData);
    }, [satData])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    const handleSelectedItems = (rowData) => {
        let checkedItemsCopy = _.cloneDeep(checkedItems);
        if (rowData.checked) {
            if (checkedItemsCopy.map((ele) => ele.id).includes(rowData.id)) {
                var removeIndex = checkedItemsCopy.map(item => item.id).indexOf(rowData.id);
                checkedItemsCopy.splice(removeIndex, 1);
                setCheckedItems(checkedItemsCopy);
            }
            satData.map((ele) => {
                if (ele.id === rowData.id) {
                    ele.checked = false;
                }
            })
            setSatData(satData)
        }
        else {
            checkedItemsCopy.push(rowData);
            setCheckedItems(checkedItemsCopy);
            satData.map((ele) => {
                if (ele.id === rowData.id) {
                    ele.checked = true;
                }
            })

            setSatData(satData)
        }

        props.handleChange(props.path, checkedItemsCopy);
    }

    const columns = [
        {
            title: "Groundstation Name",
            field: "groundstationName",
        },
        {
            title: "Lattitude",
            field: "lattitude",
        },
        {
            title: "Unit",
            field: "lattitude_unit",
        },
        {
            title: "longitude ",
            field: "longitude",
        },
        {
            title: "Unit",
            field: "longitude_unit",
        },
        {
            title: "height",
            field: "height",
        },
        {
            title: "Unit",
            field: "height_unit",
        },
    ];
    return (
        <div className="p-4">
            <div className="mb-5">
                {satData.length > 0 ? (
                    <MaterialTable
                        title="GroundStation List"
                        icons={tableIcons}
                        columns={columns}
                        data={satData}
                        options={{
                            showTitle: true,
                            // selection: true,
                            search: true,
                            headerStyle: {
                                backgroundColor: "#464D69",
                                color: "#FFF",
                                zIndex: 0,
                            },
                        }}
                        actions={[
                            {
                                icon: 'save',
                                onClick: (event, rowData) => handleSelectedItems(rowData)
                                // tooltip: 'Sa',
                            }
                        ]}
                        components={{
                            Action: props => (
                                <Checkbox
                                    checked={props.data.checked}
                                    onChange={(event) => props.action.onClick(event, props.data)}
                                    size="small"
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            ),
                        }}
                        onSelectionChange={(rows) => handleSelectedItems(rows)}
                    />
                    // satData.map((ele)=>(
                    //     <div className="d-flex flex-row justify-items-around align-item-center">
                    //         <h1>{ele.groundstationName}</h1>
                    //     </div>
                    // ))
                ) : (
                    <div className="d-flex flex-column justify-content-center align-items-center mb-5">
                        <h4>loading.......</h4>
                    </div>
                )}
            </div>

            {/* <div className=" mt-5 mb-5 ">
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
      </div> */}
        </div>
    );
};

const mapStateToProps = (state) => ({
    groundStation: state.GroundStationDetails,
});

const mapDispatchToProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VisibilityReport);