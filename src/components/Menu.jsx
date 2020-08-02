import React from 'react';
import { Nav, NavItem, Navbar, Badge, NavDropdown } from 'react-bootstrap';
import '../css/Menu.css';
import NotifCenter from './Notifications.jsx'
import Friends from './Friends.jsx'

import Avatar from 'react-avatar';
import { Divider } from '@material-ui/core';

import {
    Collapse,
    NavbarToggler,
    NavbarBrand,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText
  } from 'reactstrap';

class Menu extends React.Component{
    constructor(props){
        super(props);
        this.state={
            currentPage: props.currentPage,
            notifRefresh: false
        }
    }

    // handleChange=(page)=>{
    //     var activePage = [...this.state.activePage];
    //     activePage.map(page=>{
    //         page = false;
    //     })

    //     activePage[page] = true;
    //     this.setState({activePage});
    //     console.log(activePage);
    // }

    handleRefreshFriends = () => {

    }

    render (){

        return(
            <Navbar id="navbarStep" sticky="top" collapseOnSelect expand="lg" className="color-nav" variant="dark">
            <Navbar.Brand href="/">
            <img
                alt=""
                src="/animosys.png"
                // width="30"
                height="50"
                className="d-inline-block align-top"
            />{' '}
            </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">                    
                    <Nav className="ml-auto">
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Menu 