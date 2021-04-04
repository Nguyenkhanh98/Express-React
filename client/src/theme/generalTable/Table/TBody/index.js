import React, { Component } from 'react';
import PropTypes from 'prop-types';
class TBody extends Component {
	static displayName = 'TBody';
	render() {
		const { children, className, style } = this.props;

		return (
			<>
				<tbody className={className} style={style}>
					{children}
				</tbody>
			</>
		);
	}
}

TBody.propTypes = {
	children: PropTypes.array,
	className: PropTypes.string,
	style: PropTypes.object,
};

export default TBody;
