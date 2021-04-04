import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';
import config from '../config';

import $ from 'jquery';
import MenuItem from './menuItem';
import MenuTree from './menuTree';
// import logo from '../assets/img/logo.png';
import { smoothlyMenu } from './helpers/helper';
import list from '../constants/list';
import { UserService } from '../services';

class Navigation extends Component {
    constructor(props) {
        console.log(props);
        super(props);
        this.state = {
            menu: list.menu,
            navMenu: list.navMenu,
            user: {
                name: null, avatar: null, job: null, role: null, permission: null
            }
        };
    }

    getUserProfile = async () => {

        const userLocal = JSON.parse(localStorage.getItem('user'));
        if (!userLocal) {

        }
        try {
            const profile = await UserService.getProfile(userLocal.userName);
            const { user } = profile.data;

            const permissions = userLocal.role === 'Coach' ? ['default', 'users', 'transcripts'] : ['default'];
            const { firstName, lastName, middleName, avatar } = user;
            const fullName = firstName + middleName + ' ' + lastName;
            this.setState({ user: { name: fullName, avatar, permission: permissions, role: user.role.name } });
        } catch (error) {
            console.log(error);
        }
    }
    componentDidMount() {
        const { menu } = this.refs;
        // eslint-disable-next-line func-names
        $(() => {
            $(menu).metisMenu({
                toggle: true,
            });

        });
        this.getUserProfile();

    }

    componentWillUpdate() {
        $('body').toggleClass('mini-navbar');
        smoothlyMenu();
    }

    render() {
        let { user } = this.state;
        console.log(user);
        let listMenu = null;
        if (user && user.role) {
            listMenu = this.getMenus(this.state.menu, user.permission);
        }

        return (
            <nav className="navbar-default navbar-static-side" role="navigation">
                <div className="sidebar-collapse">
                    <ul className="nav metismenu" id="side-menu" ref="menu" style={{ zIndex: 2000 }}>
                        <li className="nav-header">
                            {this.profile()}
                            <div className="logo-element">
                                <img style={{ width: '2.2em' }} alt="" className="img-circle logo" src={`${config.BASE_URL}${this.state.user.avatar}`} />
                            </div>
                        </li>
                        {listMenu && this.renderMenuTree(listMenu)}
                    </ul>
                </div>
            </nav>
        );
    }

    profile = () => (
        <div className="dropdown profile-element">
            <img alt="" className="img-circle logo" style={{ width: '5em' }} src={`${config.BASE_URL}${this.state.user.avatar}`} />
            <span data-toggle="dropdown" className="dropdown-toggle" style={{ cursor: 'pointer' }}>
                <span className="block m-t-xs font-bold">{this.state.user.name}</span>
                <span className="text-muted text-xs block">
                    {this.state.user.role}
                    <b className="caret" />
                </span>
            </span>
            <ul className="dropdown-menu animated fadeInRight m-t-xs">
                {this.state.navMenu.map((menu, index) => {
                    if (menu.divider) {
                        return (<li key={index} className="dropdown-divider" />);
                    }
                    return (<li key={index}><Link className="dropdown-item" to={menu.path}>{menu.label}</Link></li>);
                })}
            </ul>
        </div>
    );

    menu = () => this.state.menu.map((item, index) => {
        if (isEmpty(item.tree)) {
            return (<MenuItem key={index} path={item.path} icon={item.icon} label={item.label} />);
        }
        return (
            <MenuTree key={index} icon={item.icon} label={item.label}>
                {
                    item.tree.map((treeItem, treeIndex) => {
                        if (isEmpty(treeItem.tree)) {
                            return (<MenuItem key={treeIndex} path={treeItem.path} label={treeItem.label} icon={treeItem.icon} tree />);
                        }
                        return (
                            <MenuTree key={treeIndex} icon={treeItem.icon} label={treeItem.label}>
                                {treeItem.tree.map((subItem, subIndex) => (<MenuItem key={subIndex} path={subItem.path} label={subItem.label} icon={subItem.icon} />))}
                            </MenuTree>
                        );
                    })
                }
            </MenuTree>
        );
    });

    getMenus = (items, permission) => {

        console.log(permission);
        if (typeof items === 'object') {
            const menus = [];

            if (items.length && items.length > 0) {
                items.forEach((currentMenu) => {
                    if (currentMenu.service) {
                        if (permission.includes(currentMenu.service)) {
                            menus.push(currentMenu);
                        }
                    } else {
                        if (currentMenu.children && currentMenu.children.length > 0) {
                            const childrens = this.getMenus(currentMenu.children, permission);

                            if (childrens) {
                                menus.push({ ...currentMenu, children: childrens });
                            }
                        }
                    }
                });
            }

            if (menus.length === 0) {
                return false;
            }
            return menus;
        }
    };

    renderMenuTree = (item) => {
        const { match, t } = this.props;
        console.log(this.props);
        return item.map((currentItem, index) => {
            let children = [];
            if (currentItem.children && currentItem.children.length > 0) {
                children = this.renderMenuTree([...currentItem.children]);
            }

            const { icon, path, label } = currentItem;
            if (children.length > 0) {
                return (
                    <MenuTree
                        key={index}
                        isActive={match.includes(path)}
                        icon={icon}
                        label={label}
                        path={path}
                    >
                        {children}
                    </MenuTree>
                );
            } else {
                return (
                    <MenuItem
                        key={index}
                        isActive={match.includes(path)}
                        path={path}
                        icon={icon}
                        label={label}
                    />
                );
            }
        });
    };
}

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
