import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';
import { toastr } from 'react-redux-toastr';
import API from '../helpers/api';

class DeleteModel extends Component {
    deleteRecord = async () => {
        const { service, id, onClose } = this.props;

        if (!service || !id) {
            toastr.error('Error', 'Something are wrong when delete.');
        } else {
            const apiUrl = `${service}/${id}`;
            try {
                const requestDelete = await API.delete(apiUrl);
                if (requestDelete) {
                    toastr.success('Success!', 'The record has been deleted.');
                    onClose({ show: false, isDeleted: true });
                }
            } catch (error) {
                toastr.error('Error!', 'Something are wrong when delete.');
                onClose({ show: false, isDeleted: false });
            }
        }
    };

    hideModel() {
        const { onClose } = this.props;
        onClose({ show: false, isDeleted: false });
    }

    render() {
        const { show } = this.props;
        return (
            <>
                {show && (
                    <SweetAlert
                        warning
                        showCancel
                        confirmBtnText="Yes, delete it!"
                        confirmBtnBsStyle="danger"
                        title="Are you sure?"
                        onConfirm={() => this.deleteRecord()}
                        onCancel={() => this.hideModel()}
                        focusCancelBtn
                    >
                        Do you want to deleted it ?
                    </SweetAlert>
                )}
            </>
        );
    }
}

DeleteModel.defaultProps = {
    show: false,
};

DeleteModel.propTypes = {
    service: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    show: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
};

export default DeleteModel;
