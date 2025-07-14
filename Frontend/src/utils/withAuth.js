// withAuth.js
import React from 'react';
import { Redirect } from 'react-router-dom';
import { getToken } from './auth';

const withAuth = (Component) => {
  return (props) => {
    if (!getToken()) {
      return <Redirect to="/login" />;
    }
    return <Component {...props} />;
  };
};

export default withAuth;
