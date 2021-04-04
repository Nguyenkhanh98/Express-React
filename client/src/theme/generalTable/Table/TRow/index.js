import React, { Component, isValidElement, cloneElement } from 'react';
import PropTypes from 'prop-types';
import './index.scss';

class TRow extends Component {
	static displayName = 'TRow';

	render() {
		const {
			children,
			className,
			labelSort,
			changeLabelSort,
			directionDesc,
			style,
		} = this.props;
		let body = children;
		if (children) {
			if (children[0].type.displayName === 'THCell') {
				body = body.map((currentValue, key) => {
					let newElementWithProps = cloneElement(currentValue, {
						key,
						changeLabelSort,
					});

					if (key === labelSort) {
						if (isValidElement(currentValue)) {
							newElementWithProps = cloneElement(currentValue, {
								directionDesc,
								key,
								changeLabelSort,
							});
						}
					}
					return newElementWithProps;
				});
			}
		}
		return (
			<>
				<tr className={className} style={style}>
					{body}
				</tr>
			</>
		);
	}
}

TRow.propTypes = {
	children: PropTypes.array,
	className: PropTypes.string,
	changeLabelSort: PropTypes.func,
	directionDesc: PropTypes.bool,
	labelSort: PropTypes.number,
	style: PropTypes.object,
};

export default TRow;
