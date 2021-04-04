import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import LaddaButton, { ZOOM_IN } from 'react-ladda';

const ConfirmForm = (props) => {
    const { onSubmit, cancelLabel, submitLabel, redirect, onLoad } = props;
    return (
        <>
            <div className="form-group row">
                <div className="col-sm-4 col-sm-offset-2">
                    <Link to={redirect} className="btn btn-white btn-sm">
                        {cancelLabel}
                    </Link>

                    <LaddaButton
                        loading={onLoad}
                        onClick={onSubmit}
                        data-color="#1ab394"
                        data-spinner-color="#fff"
                        data-style={ZOOM_IN}
                        data-spinner-lines={10}
                        className="btn btn-primary btn-sm"
                        style={{ marginLeft: '5px' }}
                    >
                        {submitLabel}
                    </LaddaButton>
                </div>
            </div>
        </>
    );
};

ConfirmForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    cancelLabel: PropTypes.string.isRequired,
    submitLabel: PropTypes.string.isRequired,
    redirect: PropTypes.string.isRequired,
    onLoad: PropTypes.bool.isRequired,
};
export default ConfirmForm;
