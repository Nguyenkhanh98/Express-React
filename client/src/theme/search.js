import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Search extends Component {
    onSearchChange = ({ target }) => {
        const { onChange } = this.props;
        onChange(target.value);
    };

    render() {
        const { style, className } = this.props;
        let { placeholder } = this.props;
        placeholder = placeholder ? placeholder : 'Search';
        return (
            <>
                <div style={style} className={`col-sm-3 ${className ? className : ''}`}>
                    <input
                        type="text"
                        onChange={this.onSearchChange}
                        className="form-control form-control-sm"
                        id="search-box"
                        placeholder={placeholder}
                    />
                </div>
            </>
        );
    }
}

Search.propTypes = {
    style: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
};

export default Search;
