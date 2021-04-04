import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import $ from 'jquery';

const Ibox = (props) => {
    const collapsePanel = (e) => {
        e.preventDefault();
        const element = $(e.target);
        const ibox = element.closest('div.ibox');
        const button = element.closest('i');
        const content = ibox.find('div.ibox-content');
        content.slideToggle(200);
        button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        ibox.toggleClass('').toggleClass('border-bottom');
        setTimeout(function () {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
        }, 50);
    };

    const closePanel = (e) => {
        e.preventDefault();
        const element = $(e.target);
        const content = element.closest('div.ibox');
        content.remove();
    };
    const { style } = props;

    return (
        <div className="wrapper wrapper-content animated fadeInRight" style={style}>
            <div className="row">
                <div className="col-lg-12">
                    <div className="ibox" style={style}>
                        <div className="ibox-title">
                            <h5>{props.title}</h5>
                            <small> {props.subTitle}</small>
                            <div className="ibox-tools">
                                <a className="collapse-link" onClick={collapsePanel}>
                                    <i className="fa fa-chevron-up"></i>
                                </a>
                                <a className="close-link" onClick={closePanel}>
                                    <i className="fa fa-times"></i>
                                </a>
                            </div>
                        </div>
                        <div className="ibox-content">{props.children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Ibox.propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.string,
    children: PropTypes.node,
};

export default Ibox;
