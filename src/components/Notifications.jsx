import React from 'react';

import '../css/Notifications.css';

import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from 'reactstrap';

/*import {
    Link
} from "react-router-dom";*/

import {Link as Linker} from "react-router-dom";

import { HashLink as Link } from 'react-router-hash-link';

import Badge from '@material-ui/core/Badge';
import axios from 'axios'
import Skeleton from '@material-ui/lab/Skeleton';

class Notifications extends React.Component{

    constructor(props){
        super(props);

        var today = new Date();

        this.state = {
            database: [
                // this.createData('Schedule', 'INOVATE S17 is full.',             false,  today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(), "", ""),
                // this.createData('Friend',   'Juan Tamad saved a new schedule.', true,   today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(), "", ""),
                // this.createData('Schedule', 'FTDANCE S15 was dissolved.',       true,   today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(), "", "")
            ],
            polling: true,
            pollingInterval: 5000,
            newNotifs: 0,
            notifRefresh: props.notifRefresh,
            skeletons: [...Array(2).keys()],
            dataReceived: false,
            unread: false,
        }
    }

    componentWillReceiveProps(props){
        this.setState({notifRefresh: props.notifRefresh})
    }

    createData(category, message, seen, date, icon, bgColor, id) {
        return {category, message, seen, date, icon, bgColor, id};
    }

    specifyIcon(props) {
        const category = props.category;

        if(category == "Schedule"){
            return (
                <svg class='bi bi-calendar-fill' width='1em' height='1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                    <path d='M0 2a2 2 0 012-2h12a2 2 0 012 2H0z'></path> <path fill-rule='evenodd' d='M0 3h16v11a2 2 0 01-2 2H2a2 2 0 01-2-2V3zm6.5 4a1 1 0 100-2 1 1 0 000 2zm4-1a1 1 0 11-2 0 1 1 0 012 0zm2 1a1 1 0 100-2 1 1 0 000 2zm-8 2a1 1 0 11-2 0 1 1 0 012 0zm2 1a1 1 0 100-2 1 1 0 000 2zm4-1a1 1 0 11-2 0 1 1 0 012 0zm2 1a1 1 0 100-2 1 1 0 000 2zm-8 2a1 1 0 11-2 0 1 1 0 012 0zm2 1a1 1 0 100-2 1 1 0 000 2zm4-1a1 1 0 11-2 0 1 1 0 012 0z' clip-rule='evenodd'/>
                </svg>
            );
        }
        else {
            return (
                <svg class='bi bi-people-fill' width='1em' height='1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                    <path fill-rule='evenodd' d='M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 100-6 3 3 0 000 6zm-5.784 6A2.238 2.238 0 015 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 005 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5z' clip-rule='evenodd'/>
                </svg>
            );
        }
    }

    getInfo(){
        axios.get('https://archerone-backend.herokuapp.com/api/notificationlist/'+localStorage.getItem('user_id')+'/')
        .then(res => {
            this.setState({database: []})
            this.setState({newNotifs: 0})
            var newNotifs = this.state.newNotifs;
            res.data.map(notif=> {
                const database = this.state.database;
                let difference = Math.floor((Date.now() - Date.parse(notif.date)) /1000 )
                let timePassed = ''
                if(difference <= 60){
                    timePassed = difference + 's'
                }else{
                    difference = Math.floor(difference/60)
                    if(difference <= 60){
                        timePassed = difference + 'm'
                    }else{
                        difference = Math.floor(difference/60)
                        if(difference <= 24){
                            timePassed = difference + 'h'
                        }else{
                            difference = Math.floor(difference/24)
                            if(difference <= 7){
                                timePassed = difference + 'd'
                            }else{
                                difference = Math.floor(difference/7)
                                timePassed = difference + 'w'
                            }
                        }
                    }
                }
                database.push(this.createData(notif.category, notif.content, notif.seen, timePassed, "", "", notif.id))
                if(!notif.seen){
                    newNotifs += 1;
                }
                if(notif.category != 'Schedule'){
                    this.setState({notifRefresh: true})
                }
                this.setState({database})
            })
            this.setState({newNotifs})
            this.setState({dataReceived: true})
            this.poll()
        })
    }

    componentDidMount(){
        this.getInfo()
    }

    poll () {
        this.state.polling && clearTimeout(this.state.polling)
    
        const polling = setTimeout(() => {
            this.getInfo()
        }
        , this.state.pollingInterval)
    
        this.setState({
            polling
        })
    }

    handleNotifsClick = (e, action) => {
        this.setState({polling: false})
        this.setState({newNotifs: 0})
        // const database = []
        this.state.database.map(notif => {
            axios.patch('https://archerone-backend.herokuapp.com/api/notifications/'+notif.id+'/',{
                seen: true
            })
            // notif.seen = true;
            // database.push(notif)
        })
        // this.setState({database})
        this.setState({polling: true})
    }

    render (){
        const options = [];
        var list = this.state.database;
        
        for (let i=0; i < list.length; i++){

            // SPECIFY BACKGROUND COLOR
            if(!list[i].seen){
                list[i].bgColor = "#E5E5E5";
                // #D3D3D3
            }
            else {
                list[i].bgColor = "white";
            }

            options.push(list[i]);
        }

        return(
            <UncontrolledDropdown nav inNavbar>
                <DropdownToggle tag="span" data-toggle="dropdown" onClick={this.handleNotifsClick}>
                <Badge badgeContent={this.state.newNotifs} color="error" overlap="circle">
                    <svg class="bi bi-bell-fill" width="32" height="32" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 18a2 2 0 002-2H8a2 2 0 002 2zm.995-14.901a1 1 0 10-1.99 0A5.002 5.002 0 005 8c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"></path>
                    </svg>
                </Badge>
                </DropdownToggle>
                
                {this.state.dataReceived ?
                <DropdownMenu right id="dropdownMenu">
                    <DropdownItem header id="notifSettings" className="headerSticky">
                        
                        <Link to="profile#notifs-container" id="headerLink">Settings</Link>
                    </DropdownItem>

                    {options.map(option => (
                        <Link className="friendItem" to={option.category=="Friend" ? {pathname: "/view_friends", state:{selectedFriendId: -1}} : "/#viewCoursesHome"} >
                        <DropdownItem disabled className="notifItem" style={{backgroundColor: option.bgColor}}>
                            <DropdownItem divider />
                            <this.specifyIcon category={option.category} />
                            <span id="notifDate"> {option.date} </span>
                            <span>{option.message}</span>
                        </DropdownItem>
                        </Link>
                    ))}

                    {options.length == 0 &&
                        <DropdownItem disabled className="notifItem">
                            <DropdownItem divider />
                            <center>No Notifications</center>
                        </DropdownItem>
                    }
                </DropdownMenu>
                :
                <DropdownMenu right id="dropdownMenu">
                    <DropdownItem header id="notifSettings" className="headerSticky">
                        
                        <Link to="profile#notifs-container" id="headerLink">Settings</Link>
                    </DropdownItem>

                    {this.state.skeletons.map(option => (
                        <DropdownItem disabled className="notifItem">
                            <DropdownItem divider />
                            <span> <Skeleton width={'100%'} height={'100%'}></Skeleton> </span>
                            <span> <Skeleton width={'100%'} height={'100%'}></Skeleton> </span>
                        </DropdownItem>
                    ))}

                </DropdownMenu>
                }
            </UncontrolledDropdown>
        );
    }
}

export default Notifications 