/**
 * Page Title Bar Component
 * Used To Display Page Title & Breadcrumbs
 */
import React from "react";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
// import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import IconButton from '@material-ui/core/IconButton';

// intl messages
import IntlMessages from "Util/IntlMessages";
import history from 'Helpers/history';

// get display string
const getDisplayString = (sub) => {
  return sub;
  const arr = sub.split("-");
  if (arr.length > 1) {
    return (
      <IntlMessages
        id={`${arr[0].charAt(0) +
          arr[0].slice(1) +
          arr[1].charAt(0).toUpperCase() +
          arr[1].slice(1)}`}
      />
    );
  } else {
    return <IntlMessages id={`${sub.charAt(0) + sub.slice(1)}`} />;
  }
};

// get url string
const getUrlString = (path, sub, index) => {
  if (index === 0) {
    return "/";
  } else {
    return sub; //path.split(sub)[0] + sub;
  }
};

const PageTitleBar = ({ title, match, enableBreadCrumb }) => {
  const path = match.url.substr(1);
  const subPath = path.split("/");
  return (
    <div className="page-title d-flex justify-content-between align-items-center">
      {title && (
        <div className="page-title-wrap d-flex align-items-start">
          
          <IconButton size="small">
          <i className="ti-angle-left" onClick={history.goBack}></i>
          </IconButton>
          <h3 className="ml-2">{title}</h3>
        </div>
      )}
      {enableBreadCrumb && (
        <Breadcrumb className="mb-0 tour-step-7" tag="nav">
          {subPath.map((sub, index) => {
            return (
              <BreadcrumbItem //active={subPath.length-1 != index}
                tag={subPath.length - 1 != index ? Link : "span"}
                key={index}
                to={subPath.reduce(
                  (acc, cv, ind) => (ind <= index ? acc + "/" + cv : acc),
                  ""
                )}
              >
                {getDisplayString(sub)}
              </BreadcrumbItem>
            );
          })}
        </Breadcrumb>
      )}
    </div>
  );
};

// default props value
PageTitleBar.defaultProps = {
  enableBreadCrumb: true,
};

export default PageTitleBar;
