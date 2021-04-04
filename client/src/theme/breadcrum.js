import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Breadcrumb = (props) => {
    const lastItem = props.items.length - 1;

    return (
        <div className="row wrapper border-bottom white-bg page-heading">
            <div className="col-lg-10">
                <h2>{props.title}</h2>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/dashboard">Dashboard</Link>
                    </li>
                    {props.items.map((item, index) => {
                        return lastItem === index ? (
                            <li key={index} className="breadcrumb-item active">
                                <strong>{item.label}</strong>
                            </li>
                        ) : (
                            <li key={index} className="breadcrumb-item">
                                <Link to={item.path}>{item.label}</Link>
                            </li>
                        );
                    })}
                </ol>
            </div>
            <div className="col-lg-2"></div>
        </div>
    );
};

Breadcrumb.defaultProps = {
    items: [],
};

Breadcrumb.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.array,
};

export default Breadcrumb;
