import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
class TCell extends Component {
	static displayName = 'Row';
	render() {
		const { children, className, style } = this.props;
		return (
			<>
				<td className={className} style={style}>
					{children}
				</td>
			</>
		);
	}
}

TCell.propTypes = {
	children: PropTypes.any,
	className: PropTypes.string,
	style: PropTypes.object,
};

export default TCell;
