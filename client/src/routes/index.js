import React, { lazy } from 'react';

import { Route, Switch } from 'react-router-dom';
import PrivateRoutes from './privateRoute';

// import PublicRoutes from '../components/common/publicRouters';
import PrivateRoute from '../components/common/privateRouter';

import '../assests/dependencies';
import Login from '../components/login';

export default function Routes(props) {
    return (
        <Switch>
            <Route path="/login" component={Login} />
            <PrivateRoute path="/" component={PrivateRoutes} />
            {/* <privateRoutes path="/" component={publicRoutes} /> */}
        </Switch>
    )
}