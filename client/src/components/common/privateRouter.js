import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isAuth } from '../../helpers/auth';

const PrivateRoute = ({ component: Component, ...rest }) => (

    <Route
        {...rest}
        render={(props) => (isAuth() ? (
            <Component {...props} />
        ) : (
            <Redirect
                to={{
                    pathname: '/login',
                    state: { from: props.location },
                }}
            />
        ))}
    />
);

PrivateRoute.propTypes = {
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    location: PropTypes.object,
};

export default PrivateRoute;
