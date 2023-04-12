import React, { useState } from 'react'
import { MenuItem, Select } from '@material-ui/core';
import Tooltip from "@material-ui/core/Tooltip";
import './styles.scss';

function OperationSheetTab(props) {
  const { index, sheet, resetSheet, removeSheets } = props
  const [rename, setRename] = useState(null);


  const handleSelect = (e) => {
    const value = e.target.value
      if (value === '1') {
        setRename(true)
      } else{
        removeSheets(sheet);
      }
  }

  const resetSheetName = (e) => {
    const name = e.target.innerText
    let temp = sheet
    temp.sheetName = name
    resetSheet(sheet.id, temp);
    setRename(false);
  }

  return (
    <span style={{ color: "black" }} className="sheetTab" >
      <span className={rename && 'editableTab'} contentEditable={rename} onBlur={(e) => resetSheetName(e)}>
        {sheet.sheetName}
      </span>
      {
        sheet.sheetName === 'Summary' ? null : (
          <Tooltip title="actions" placement="bottom">
            <Select
              value=" "
              onChange={(e) => handleSelect(e)}
              className="dropdown"
            >
              <MenuItem value="1">Rename</MenuItem>
              <MenuItem value="2">Delete Tab</MenuItem>
            </Select>
          </Tooltip>
        )
      }
    </span>
  )
}

export default OperationSheetTab;
