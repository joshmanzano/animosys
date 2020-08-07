// frontend/src/App.js

import React, { Component } from "react";
import './App.css';

import { BrowserRouter as Router, Route, Switch, Link, Redirect } from "react-router-dom";

// PAGES
import MainPage from "./pages/Index.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import ResetPasswordPage from "./pages/ResetPassword.jsx";
import ResetPasswordDonePage from "./pages/ResetPasswordDone.jsx";
import ResetPasswordConfirmPage from "./pages/ResetPasswordConfirm.jsx";
import ResetPasswordCompletePage from "./pages/ResetPasswordComplete.jsx";
import ProfilePage from "./pages/Profile.jsx";
import FlowchartPage from "./pages/Flowchart.jsx";
import GenerateSchedulePage from "./pages/GenerateSchedule.jsx";
import PreferencesPage from "./pages/Preferences.jsx";
import SearchCoursesPage from "./pages/SearchCourses.jsx";
import SearchCoursesSimplePage from "./pages/SearchCoursesSimple.jsx";
import SearchCoursesGuestPage from "./pages/SearchCoursesGuest.jsx";
import ViewFriendsPage from "./pages/FriendPage.jsx";
import Menu from "./components/Menu.jsx";
import CompareSchedulePage from "./pages/CompareSchedule.jsx";

import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      logged_in: localStorage.getItem('token') ? true : false,
      first_name: localStorage.getItem('first_name'),
      last_name: localStorage.getItem('last_name'),
      user_id: localStorage.getItem('user_id'),
      colleges:{},
      degrees:{}
    };
  }

  // this.state.logged_in --> indicates if user is logged in or not

  componentWillMount(){
    // if(this.state.logged_in){
    //   axios.get('https://archerone-backend.herokuapp.com/api/auth/user/',
    //   {
    //     headers: {
    //       Authorization: `JWT ${localStorage.getItem('token')}` 
    //     },
    //     withCredentials: true
    //   })
    //   .then(res => {
    //     this.setState({
    //       logged_in: true,
    //       first_name: res.data.first_name,
    //       last_name: res.data.last_name,
    //       id_num: ''
    //     })
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
    // }
  }

  handle_login = (data, _callback) => {
    axios.post('https://archerone-backend.herokuapp.com/api/auth/login/', data,
    {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('first_name', res.data.user.first_name);
        localStorage.setItem('last_name', res.data.user.last_name);
        localStorage.setItem('user_id', res.data.user.id);
        this.setState({
          logged_in: true,
          first_name: res.data.user.first_name,
          last_name: res.data.user.last_name,
          user_id: res.data.user.id,
        })
        _callback(null);
    })
    .catch(error => {
        console.log(error.response)
        _callback(error.response);
    });
  }

  handle_register = (data, _callback) => {
    axios.post('https://archerone-backend.herokuapp.com/api/auth/registration/', data,
    {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        console.log(res.data);
        // localStorage.setItem('token', res.data.token);
        // localStorage.setItem('first_name', res.data.user.first_name);
        // localStorage.setItem('last_name', res.data.user.last_name);
        // localStorage.setItem('user_id', res.data.user.id);
        // this.setState({
        //   logged_in: true,
        //   first_name: res.data.user.first_name,
        //   last_name: res.data.user.last_name,
        //   user_id: res.data.user.id,
        // })
        _callback(null);
    })
    .catch(error => {
        console.log(error.response)
        _callback(error.response);
    });
  }

  handle_resetPassword = (data, _callback) => {
    axios.post('https://archerone-backend.herokuapp.com/api/auth/password/reset/', data,
    {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        console.log(res.data);
        console.log(res.data.email);
        _callback(true);
    })
    .catch(error => {
        console.log(error.response)
        _callback(false);
    });
  }

  handle_resetPasswordConfirm = (data, _callback) => {
    axios.post('https://archerone-backend.herokuapp.com/api/auth/password/reset/confirm/', data,
    {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        console.log(res.data);
        _callback(true);
    })
    .catch(error => {
        console.log(error.response)
        _callback(false);
    });
  }

  handle_logout = () => {
    localStorage.removeItem('idnum');
    localStorage.removeItem('allAdd');
    localStorage.removeItem('added');
    localStorage.removeItem('toAdd');
    this.setState({
      logged_in: false,
      first_name: '',
      last_name: '',
      id_num: '',
    });
    return (
      <Redirect to="/" />
    );
  }

  loginPage = () => {
    return (
      <LoginPage
        handle_login={this.handle_login}
      />
    );
  }

  registerPage = () => {
    return (
      <RegisterPage
        handle_register={this.handle_register}
      />
    );
  }

  resetPasswordPage = () => {
    return (
      <ResetPasswordPage
        handle_resetPassword={this.handle_resetPassword}
      />
    );
  }

  resetPasswordDonePage = () => {
    return (
      <ResetPasswordDonePage/>
    );
  }

  resetPasswordConfirmPage = () => {
    return (
      <ResetPasswordConfirmPage
        handle_resetPasswordConfirm={this.handle_resetPasswordConfirm}
      />
    );
  }

  resetPasswordCompletePage = () => {
    return (
      <ResetPasswordCompletePage/>
    );
  }

  menu = () => {
    return (
      <Menu
        handle_logout={this.handle_logout}
        logged_in={this.state.logged_in}
        first_name={this.state.first_name}
        last_name={this.state.last_name}
      />
    )
  }

  menu = (currentPage) => {
    return (
      <Menu
        handle_logout={this.handle_logout}
        logged_in={this.state.logged_in}
        first_name={this.state.first_name}
        last_name={this.state.last_name}
        currentPage={currentPage}
      />
    )
  }

  mainPage = () => {
    return (
      <MainPage
        menu={this.menu}
        logged_in={this.state.logged_in}
      />
    )
  }

  profilePage = () => {
    return (
      <ProfilePage
        menu={this.menu}
      />
    )
  }

  generateSchedulePage = () => {
    return (
      <GenerateSchedulePage
        menu={this.menu}
      />
    )
  }

  preferencesPage = () => {
    return (
      <PreferencesPage
        menu={this.menu}
      />
    )
  }

  searchCoursesPage = () => {
    return (
      <SearchCoursesPage
        menu={this.menu}
      />
    )
  }

  searchCoursesGuestPage = () => {
    return (
      <SearchCoursesGuestPage
        menu={this.menu}
      />
    )
  }

  searchCoursesSimplePage= () => {
    return (
      <SearchCoursesSimplePage
        menu={this.menu}
      />
    )
  }

  viewFriendsPage = () => {
    return (
      <ViewFriendsPage
        menu={this.menu}
      />
    )
  }

  flowchartPage = () => {
    return (
      <FlowchartPage
        menu={this.menu}
      />
    )
  }

  compareSchedulePage = (props) => {
    return (
      <CompareSchedulePage
        menu={this.menu}
        params={props.match.params}
      />
    )
  }

  render() {

    return (
      <Router>
        <Switch>
          <Route exact path="/" component={this.searchCoursesGuestPage}/>
        </Switch>
      </Router>
    );
  }
}
export default App;
