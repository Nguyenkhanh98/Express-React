import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TRow from './Table/TRow';
import TBody from './Table/TBody';
import THead from './Table/THead';
import TCell from './Table/TCell';
import THCell from './Table/THCell';

class GeneralTable extends Component {
    state = {
        currentLabelSort: this.props.labelSort,
        directionDesc: this.props.directionDesc,
        data: this.props.data,
    };

    compareValues = (key, order = 'asc') => (a, b) => {
        const isInt = parseInt(a[key]) && parseInt(b[key]);

        if (isInt) {
            return order === 'asc' ? a[key] - b[key] : b[key] - a[key];
        }

        else {
            if (
                !Object.prototype.hasOwnProperty.call(a, key) ||
                !Object.prototype.hasOwnProperty.call(b, key)
            ) {
                return 0;
            }

            if (a[key] === null || a[key] === undefined) {
                a[key] = '';
            }

            if (b[key] === null || b[key] === undefined) {
                b[key] = '';
            }

            const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
            const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

            let comparison = 0;

            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }

            return order === 'desc' ? comparison * -1 : comparison;
        }

    };

    changeLabelSort = async (newLabelSort) => {
        newLabelSort = parseInt(newLabelSort);
        const { currentLabelSort, directionDesc, data } = this.state;
        let newDirectionDesc = directionDesc;

        if (currentLabelSort === newLabelSort) {
            newDirectionDesc = !directionDesc;
        } else {
            newDirectionDesc = false;
        }

        await this.setState({
            ...this.state,
            currentLabelSort: newLabelSort,
            directionDesc: newDirectionDesc,
        });
    };

    render() {
        const { currentLabelSort, directionDesc } = this.state;
        const {
            data,
            header,
            className,
            style,
            onClickAction,
            service,
        } = this.props;

        let tHeadLabel;

        if (header) {
            tHeadLabel = header.map((currentValue, index) => (
                <THCell key={index}>{currentValue}</THCell>
            ));
        }

        let tBodyElement;

        if (data && data.length > 0) {
            const body = data;
            const sortType = directionDesc ? 'desc' : 'asc';
            const labelSort = Object.keys(data[0])[currentLabelSort];

            body.sort(this.compareValues(labelSort, sortType));

            tBodyElement = body.map((currentValue, index) => {
                let currentValueArr = Object.entries(currentValue);

                currentValueArr = currentValueArr.map((value, indexChildren) => {
                    if (value[0] === 'id') {
                        return (
                            <TCell key={indexChildren}>
                                <Link to={`${service}/edit/${value[1]}`} className="text-navy">
                                    {' '}
                                    {value[1]}{' '}
                                </Link>
                            </TCell>
                        );
                    }

                    if (value[0] === 'action') {
                        const content = [];
                        const idItem = value[1][1];
                        const url = `${service}/edit/${idItem}`;
                        const editElement = (
                            <Link
                                key={indexChildren + 1}
                                to={url}
                                style={{ paddingRight: '5px' }}
                            >
                                <i className="fa fa-pencil text-navy" />
                            </Link>
                        );

                        const deleteElement = (
                            <a
                                style={{ paddingRight: '5px' }}
                                onClick={() => onClickAction({ type: 'delete', id: idItem })}
                                key={indexChildren + 2}
                            >
                                <i className="fa fa-trash text-danger" />
                            </a>
                        );

                        if (value[1][0].includes('edit')) {
                            content.push(editElement);
                        }
                        if (value[1][0].includes('delete')) {
                            content.push(deleteElement);
                        }

                        return <TCell key={indexChildren}>{content}</TCell>;
                    }

                    if (value[0] === 'status') {
                        let statusElement = '';
                        switch (value[1].toUpperCase()) {
                            case 'PUBLISHED':
                                statusElement = (
                                    <span className="label label-primary">
                                        Published
                                    </span>
                                );
                                break;
                            case 'UNPUBLISHED':
                                statusElement = (
                                    <span className="label label-danger">
                                        Unpublished
                                    </span>
                                );
                                break;
                            case 'DELETED':
                                statusElement = (
                                    <span className="label label-danger">
                                        Deleted
                                    </span>
                                );
                                break;
                            case 'ACTIVATED':
                                statusElement = (
                                    <span className="label label-primary">
                                        Activated
                                    </span>
                                );
                                break;
                            case 'INACTIVATED':
                                statusElement = (
                                    <span className="label label-warning">
                                        Inactivated
                                    </span>
                                );
                                break;
                            default:
                                break;
                        }
                        return <TCell key={indexChildren}>{statusElement}</TCell>;
                    }
                    return <TCell key={indexChildren}>{value[1]}</TCell>;
                });

                return <TRow key={index}>{currentValueArr}</TRow>;
            });
        }

        return (
            <>
                <div style={style} className={className}>
                    <div className="table-responsive">
                        <table className="table table-stripped table-custom">
                            <THead className="hello">
                                <TRow
                                    type="head"
                                    labelSort={currentLabelSort}
                                    changeLabelSort={this.changeLabelSort}
                                    directionDesc={directionDesc}
                                    style={{ backgroundColor: '#fff' }}
                                >
                                    {tHeadLabel}
                                </TRow>
                            </THead>
                            <TBody>{tBodyElement}</TBody>
                        </table>
                    </div>
                </div>
            </>
        );
    }
}

GeneralTable.defaultProps = {
    labelSort: 0,
    directionDesc: false,
};
GeneralTable.propTypes = {
    data: PropTypes.array,
    header: PropTypes.array,
    className: PropTypes.string,
    style: PropTypes.object,
    onClickAction: PropTypes.func,
    service: PropTypes.string.isRequired,
    labelSort: PropTypes.number,
    directionDesc: PropTypes.bool,
};

export default GeneralTable;
