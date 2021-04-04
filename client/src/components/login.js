import $ from 'jquery';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { get, isEmpty } from 'lodash';
import { Link, Redirect } from 'react-router-dom';
import EnhancedSwitch from 'react-icheck/lib/EnhancedSwitch';
import { toastr } from 'react-redux-toastr';

import { correctHeight, detectBody } from '../theme/helpers/helper';
import * as auth from '../helpers/auth';
import LoginForm from './forms/login';
import Loading from '../theme/loading';
import * as UserService from '../services/user';

EnhancedSwitch.propTypes = {
    ...EnhancedSwitch.propTypes,
    cursor: PropTypes.string,
};

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // eslint-disable-next-line func-names
        $(window).bind('load resize', () => {
            correctHeight();
            detectBody();
        });
    }

    static getDerivedStateFromProps(nextProps) {
        if (auth.isAuth()) {
            nextProps.history.push('/');
        }
        return null;
    }

    render() {
        if (this.props.loading) { return <Loading />; }
        if (this.props.error) { toastr.error('Get Hired!', this.props.error); }

        return (
            <div className="gray-bg" style={{ height: '100vh' }}>
                <div className="middle-box text-center loginscreen animated fadeInDown" style={{ paddingBottom: '40px' }}>
                    <Link className="nav-link" to="">
                        {/* <img alt="" className="img-circle logo" src={logo}/> */}
                    </Link>
                    <h3>Get Hired!</h3>
                    <p>Login in. To see it in action.</p>

                    <LoginForm onSubmit={this.login} />

                    <br />
                    <div>Student account: student1 - student1
                    </div>
                    <div>Couch account: coach1 - coach1
                    </div>
                </div>

            </div>
        );
    }

    login = async (values) => {
        const { email, password } = values;
        try {
            const response = await UserService.login(email, password);
            const { data } = response;

            if (response) {
                toastr.success('Login successfully');
                localStorage.setItem('isAuth', true);
                localStorage.setItem('user', JSON.stringify({ userName: email, role: data.role.name }));
                this.props.history.push('/');
            } else {
                toastr.error('user or password is incorrect');
            }
        } catch (error) {
            toastr.error('User name of password is incorrect');
            console.log(error);
        }


    };
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
};

export default Login;
