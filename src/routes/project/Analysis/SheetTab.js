/**
 * Drawer Sheet Tabs
 * Nirmalya Saha
 */

import React from 'react'

function SheetTab(props) {
  const { sheet } = props

  return (
    <span className="sheetTab">
      <span>
        {sheet.sheetName}
      </span>
    </span>
  )
}

export default SheetTab
