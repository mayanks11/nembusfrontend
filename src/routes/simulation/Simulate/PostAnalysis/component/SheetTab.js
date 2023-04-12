import React, { useState } from 'react'
import { Menu, MenuItem, FormControl, Select } from '@material-ui/core';
import { Close, ExpandMore, ExpandLess, ClearAll, ExitToApp, Edit } from '@material-ui/icons';
import { NotificationManager } from "react-notifications";
function SheetTab(props) {
  const { removeSheet, index, sheet, resetSheet, renameSheet, analysisstatus } = props
  const [rename, setRename] = useState(null)
  const handleSelect = (e) => {
    const value = e.target.value
    if (analysisstatus !== 1) {
      if (value === '1') {
        setRename(true)
      } else if (value === '2') {
        console.log("sheet", sheet)
        removeSheet(index, sheet)
      } else if (value === '3') {
        alert(3)
      }
    } else {
      NotificationManager.error("Cannot delete siulation is loading");
    }
  }
  const resetSheetName = (e) => {
    const name = e.target.innerText
    let temp = sheet
    temp.sheetname = name
    renameSheet(index, sheet, name)
    setRename(false)
    resetSheet(index, temp)
  }

  return (
    <span className="sheetTab" >
      <span className={rename && 'editableTab'} contentEditable={rename} onBlur={(e) => resetSheetName(e)}>
        {sheet.sheetname}
      </span>
      <Select
        value=" "
        onChange={(e) => handleSelect(e)}
        className="dropdown"
      >
        <MenuItem value="1">Rename</MenuItem>
        <MenuItem value="2">Delete Tab</MenuItem>
        <MenuItem value="3">Download</MenuItem>
      </Select>
    </span>
  )
}

export default SheetTab
