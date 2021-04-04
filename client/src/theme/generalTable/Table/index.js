import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
class Table extends Component {
	render() {
		const { data, style, children, className } = this.props;

		return (
			<>
				<div className={` ${className} `} style={style}>
					<table className="table table-stripped table-custom">
						{children}
					</table>
				</div>
			</>
		);
	}
}

Table.propTypes = {
	children: PropTypes.array.isRequired,
	data: PropTypes.object,
};

export default Table;
