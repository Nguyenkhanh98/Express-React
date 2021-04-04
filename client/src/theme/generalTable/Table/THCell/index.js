import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faSort,
	faSortDown,
	faSortUp,
} from '@fortawesome/free-solid-svg-icons';

import './index.scss';
class THCell extends Component {
	static displayName = 'THCell';
	onClick = async (key) => {
		const { sort, changeLabelSort } = this.props;
		if (sort === false) {
			return;
		}
		await changeLabelSort(key);
	};

	render() {
		const { children, className, sort, directionDesc, style } = this.props;

		const key = this._reactInternals.key;
		let labelSort = null;
		if (sort !== false) {
			let icon = faSort;

			if (directionDesc === true) {
				icon = faSortUp;
			}
			if (directionDesc === false) {
				icon = faSortDown;
			}
			labelSort = (
				<>
					<FontAwesomeIcon icon={icon} className="footable-sort-indicator" />
				</>
			);
		}
		return (
			<>
				<th
					className={`footable-sortable sorting ${className} thead-sorting`}
					style={{ style }}
					key={key}
					onClick={() => this.onClick(key)}
				>
					{children}
					{labelSort}
				</th>
			</>
		);
	}
}

THCell.propTypes = {
	children: PropTypes.any.isRequired,
	className: PropTypes.string,
	style: PropTypes.object,
	sort: PropTypes.bool,
	changeLabelSort: PropTypes.func,
	directionDesc: PropTypes.bool,
};

export default THCell;
