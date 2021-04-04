import React, { Component } from 'react';
import PropTypes from 'prop-types';

class THead extends Component {
	static displayName = 'THead';
	render() {
		const { children, className, style } = this.props;

		return (
			<>
				<thead className={className} style={style}>
					{children}
				</thead>
			</>
		);
	}
}

THead.propTypes = {
	children: PropTypes.object.isRequired,
	className: PropTypes.string,
	style: PropTypes.object,
};

export default THead;
