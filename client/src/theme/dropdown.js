import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

const DropDown = (props) => {
    return (
        <div>
            <Select
                isDisabled={!props.active}
                name={props.name}
                options={props.data}
                onChange={props.onSelected}
                onInputChange={props.onInputChange}
                placeholder={props.placeholder}
                value={props.value}
                matchPos="any"
                className={props.className}
            />
        </div>
    );
};

DropDown.defaultProps = {
    active: true
};

DropDown.propTypes = {
    active: PropTypes.bool,
    name: PropTypes.string,
    data: PropTypes.array.isRequired,
    value: PropTypes.array,
    onSelected: PropTypes.func,
    onInputChange: PropTypes.func,
    placeholder: PropTypes.string,
    className: PropTypes.string
};

export default DropDown;
