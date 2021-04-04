import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
const RELOAD = 'reload';
const NO_RELOAD = 'keep';
const PREV = 'prev';
const NEXT = 'next';
const PREV_ALL = 'prevAll';
const NEXT_ALL = 'lastALl';
const FIRST = 'first';
const LAST = 'last';
class Pagination extends Component {
    static displayName = 'Pagination';

    state = {
        content: [],
        currentPage: this.props.currentPage,
        event: RELOAD,
    };

    onChangePage = ({ target }) => {
        const { onClick, total, itemPerPage, } = this.props;
        if (!total) {
            return;
        }
        const TotalPage = Math.ceil(total / itemPerPage);
        let { currentPage, content } = this.state;
        let event = RELOAD;
        const { page } = target.dataset;
        if (!page || parseInt(target.dataset.page) === currentPage) {
            return;
        }

        const firstKey = parseInt(content[0].key);
        const lastKey = parseInt(content[content.length - 1].key);
        let notUpdate = false;
        switch (page) {
            case PREV:
                event = NO_RELOAD;
                if (currentPage > 1) {
                    if (firstKey === currentPage) {
                        event = PREV;
                    }
                    currentPage -= 1;
                } else {
                    notUpdate = true;
                }
                break;
            case NEXT:
                event = NO_RELOAD;
                if (currentPage < TotalPage) {
                    if (lastKey === currentPage) {
                        event = RELOAD;
                    }
                    currentPage += 1;
                } else {
                    notUpdate = true;
                }
                break;
            case PREV_ALL:
                currentPage = firstKey - 1;
                event = PREV;
                break;
            case NEXT_ALL:
                currentPage = lastKey + 1;
                event = RELOAD;
                break;
            case FIRST:
                if (currentPage === 1) {
                    notUpdate = true;
                } else {
                    currentPage = 1;
                }
                event = RELOAD;
                break;
            case LAST:
                if (currentPage === TotalPage) {
                    notUpdate = true;
                } else {
                    currentPage = TotalPage;
                }
                event = LAST;
                break;
            default:
                currentPage = parseInt(page);
                event = NO_RELOAD;
                break;
        }

        this.setState({ event });

        if (notUpdate) {
            return;
        }

        this.setState({ event });
        if (onClick) {
            onClick({ currentPage });
        }
    };

    static getDerivedStateFromProps(props, state) {
        const { content, event, currentPage } = state;
        const { total, itemPerPage, maximumPage } = props;
        const newCurrentPage = props.currentPage;
        const TotalPage = Math.ceil(total / itemPerPage);

        const contentArr = [];
        let newContent;

        if (event === LAST || event === PREV) {
            if (currentPage - maximumPage >= 0) {
                for (let i = currentPage - maximumPage + 1; i <= currentPage; i++) {
                    const element =
                        i === currentPage ? (
                            <li className="footable-page active " key={i}>
                                <a data-page={i}>{i}</a>
                            </li>
                        ) : (
                            <li className="footable-page" key={i}>
                                <a data-page={i}>{i}</a>
                            </li>
                        );
                    contentArr.push(element);
                }
            } else {
                let totalPages = TotalPage > maximumPage ? maximumPage : TotalPage;
                for (let i = 1; i <= totalPages; i++) {
                    const element =
                        i === currentPage ? (
                            <li className="footable-page active " key={i}>
                                <a data-page={i}>{i}</a>
                            </li>
                        ) : (
                            <li className="footable-page" key={i}>
                                <a data-page={i}>{i}</a>
                            </li>
                        );
                    contentArr.push(element);
                }
            }
            newContent = contentArr;
        } else if (event === RELOAD) {
            const stopCondition =
                currentPage + maximumPage > TotalPage
                    ? TotalPage + 1
                    : maximumPage + currentPage;
            for (let i = currentPage; i < stopCondition; i++) {
                const element =
                    i === currentPage ? (
                        <li className="footable-page active " key={i}>
                            <a data-page={i}>{i}</a>
                        </li>
                    ) : (
                        <li className="footable-page" key={i}>
                            <a data-page={i}>{i}</a>
                        </li>
                    );
                contentArr.push(element);
            }
            newContent = contentArr;
        } else {
            newContent = content.map((currentValue, index) => {
                const { className, children } = currentValue.props;
                const dataPage = children.props['data-page'];
                let newElement = currentValue;
                let newClass = className;

                if (className) {
                    if (className.includes('active')) {
                        newClass = newClass.replace('active', '');
                    }
                    if (dataPage === parseInt(currentPage)) {
                        newClass += ' active';
                    }
                }

                newElement = cloneElement(currentValue, { className: newClass });
                return newElement;
            });
        }

        return { content: newContent, currentPage: newCurrentPage };
    }

    render() {
        const { className, style, total, itemPerPage, allowItemPerPage } = this.props;
        const { content } = this.state;

        if (!total) {
            return null;
        }

        const TotalPage = Math.ceil(total / itemPerPage);
        let isPrevElement = '';
        let isNextElement = '';
        if (content.length !== 0) {
            const firstKey = content[0].key;
            const lastKey = content[content.length - 1].key;

            isPrevElement =
                firstKey > 1 ? (
                    <li className="footable-page-arrow">
                        <a data-page={PREV_ALL}>...</a>
                    </li>
                ) : null;

            isNextElement =
                lastKey < TotalPage ? (
                    <li className="footable-page-arrow">
                        <a data-page={NEXT_ALL}>...</a>
                    </li>
                ) : null;
        }
        return (
            <>
                <div className={className} style={style}>
                    <div
                        className="pagination"
                        style={{ justifyContent: 'flex-end' }}
                        onClick={this.onChangePage.bind(this)}
                    >

                        <ul
                            className="pagination float-right"
                            onClick={this.onChangePage.bind(this)}
                        >
                            <li className="footable-page-arrow disabled">
                                <a data-page={FIRST}>«</a>
                            </li>
                            <li className="footable-page-arrow disabled">
                                <a data-page={PREV}>‹</a>
                            </li>
                            {isPrevElement}
                            {content}
                            {isNextElement}
                            <li className="footable-page-arrow disabled">
                                <a data-page={NEXT}>›</a>
                            </li>
                            <li className="footable-page-arrow disabled">
                                <a data-page={LAST}>»</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </>
        );
    }
}

Pagination.propTypes = {
    children: PropTypes.string,
    className: PropTypes.string,
    currentPage: PropTypes.number,
    maximumPage: PropTypes.number,
    itemPerPage: PropTypes.number,
    total: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.func,
    allowItemPerPage: PropTypes.array,
};

Pagination.defaultProps = {
    maximumPage: 5,
    itemPerPage: 10,
    currentPage: 1,
    allowItemPerPage: [20, 40, 60]
};

export default Pagination;
