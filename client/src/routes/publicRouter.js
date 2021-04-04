

import $ from 'jquery';

import React, { Component, lazy } from 'react';
import { correctHeight, detectBody } from '../theme/helpers/helper';

import { Route, Switch } from 'react-router-dom';
import Navigation from '../theme/navigation';
import TopHeader from '../theme/topHeader';
import Progress from '../theme/progress';
import NotFound from '../components/notFound';
import Login from '../components/login';
import Dashboard from '../components/dashboard';


export default class AppRoutes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            match: props.match
        }
    }


    componentDidMount() {
        $(window).bind('load resize', () => {
            correctHeight();
            detectBody();
        });
    }


    render() {
        return (
            <div>
                <Progress />
                <Navigation />
                <div id="page-wrapper" className="gray-bg">
                    <TopHeader />
                    <Switch>
                        {/* <Route path="/login" exact component={Login} /> */}
                        <Route path="/dashboard" exact component={Dashboard} />
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </div>
        )
    }
}