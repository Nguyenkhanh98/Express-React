import React from 'react';

const customStyle = {
    error: {
        borderColor: '#ed5565',
    },
};

const TextField = (props) => {
    const {
        label,
        onChange,
        name,
        value,
        placeholder,
        disabled,
        isRequired,
        isError,
        style,
        type,
        className,
        children
    } = props;
    const requiredLabel = isRequired ? (
        <span className="text-danger">(*)</span>
    ) : (
        ''
    );
    const inputStyle = isError ? customStyle.error : {};
    return (
        <>
            <div className="form-group row" style={style}>
                <label className={`${className.label} col-form-label`}>
                    {' '}
                    {label} {requiredLabel}{' '}
                </label>
                <div className={`${className.input} `}>
                    <input
                        name={name}
                        type={type}
                        className="form-control"
                        value={value}
                        placeholder={placeholder}
                        disabled={disabled}
                        onChange={onChange}
                        style={inputStyle}
                    />
                </div>
            </div>
        </>
    );
};
TextField.defaultProps = {
    type: 'text',
    className: {
        label: 'col-sm-2',
        input: 'col-sm-10',
    },
};
export default TextField;
