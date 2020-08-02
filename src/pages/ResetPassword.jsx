import React, { Component } from "react";
import '../css/Forms.css';
import SidebarIMG from '../images/Login.svg';
import { Redirect } from "react-router-dom";

import TextField from '@material-ui/core/TextField';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

import {Jumbotron, Row, Col} from "reactstrap";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSend: {
        fontSize: "100%",
        width: "110%",
        alignItems: 'center',
        justifyContent: 'center',
        textTransform: "none",
        borderRadius: "30px",
        padding: "10px",
        paddingLeft: "30px",
        paddingRight: "30px",
        backgroundColor: "green",
        border: "none",
        color: "white",
        boxShadow: "6px 5px #e8f4ea",
        borderStyle: "solid",
        borderColor: "green",
        '&:hover': {
            color: "green",
            backgroundColor: "#FFFFFF",
          },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  backBtn:{
    color: "white", 
    marginLeft: "5px",
  '&:hover': {
      color: "#d3d3d3"
    },
  },
});

var sectionStyle = {
  // width: "100%",
  minHeight: "100vh",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  overflow: "hidden",
  backgroundImage: "linear-gradient(#086e53, #579d8b)"

};

class ResetPassword extends Component {
    constructor(props) {
        super();
        this.state = {
            fields: {},
            errors: {},
            helperEmail: "",
            snackBar: false,
            loading: false,
            success: false,
            snackBarText: "Enter a valid DLSU email",
        }
    }

    handleChange = (field, e) => {
      let fields = this.state.fields;
      fields[field] = e.target.value;        
      this.setState({fields});
    }

    handleValidation = () => {
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;

      // EMAIL
      if(!fields["email"]) {
        formIsValid = false;
        errors["email"] = "Enter a valid email."
        this.setState({helperEmail: "This field is required"})
      } else{
        this.setState({helperEmail: ""})
      }

      if(typeof fields["email"] !== "undefined") {
        let lastAtPos = fields["email"].lastIndexOf('@');
        let lastDotPos = fields["email"].lastIndexOf('.');

        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
          formIsValid = false;
          errors["email"] = "Enter a valid email.";
          this.setState({helperEmail: "Enter a valid DLSU email"});
          this.setState({loading: false});
          this.setState({success: true});
        }
      }

      this.setState({errors: errors});
      return formIsValid;
    }
    
    state = {
        redirect: false
    }

    setRedirect = () => {
      console.log("Setting redirect");
      this.setState({
        redirect: true
      })
    }

    renderRedirect = () => {
      if(this.state.redirect) {
        console.log("Rendering redirect");
        return <Redirect to='/password_reset_done' />
      }
    }

    handleSubmit = (event) => {
      if(!this.state.loading){
        this.setState({loading: true});
        this.setState({success: false});
      }else{
        this.setState({success: true});
          this.setState({loading: false});
      } 

      event.preventDefault();
      if(this.handleValidation()) {
        const data = {
          email: this.state.fields["email"]
        }
        this.props.handle_resetPassword(data, (res) => {
          if(res) {
            this.setState({snackBar: true})
              this.setState({loading: false})
            this.setRedirect();
          }
        });
      }
      else {
        // alert("Form has invalid input.");
        this.setState({snackBar: true});
        this.setState({loading:false});
      }
    }

    handleCloseSnackBar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      this.setState({snackBar: false});
    }

    render() {
      const { classes } = this.props;
      return (
        <div style={sectionStyle}>
            <div class="sidenavnew">
              <a className="backBtn" href="/">
                    <div className={"backBtn"}></div>
                    <ArrowBackIosIcon fontSize="large" style={{color: "white", marginLeft: "5px"}} viewBox="0 0 1 24"/> <span className="backBtn">Back</span>
                      {/* <svg class="bi bi-backspace" width="3em" height="3em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" d="M8.603 4h7.08a1 1 0 011 1v10a1 1 0 01-1 1h-7.08a1 1 0 01-.76-.35L3 10l4.844-5.65A1 1 0 018.603 4zm7.08-1a2 2 0 012 2v10a2 2 0 01-2 2h-7.08a2 2 0 01-1.519-.698L2.241 10.65a1 1 0 010-1.302L7.084 3.7A2 2 0 018.603 3h7.08z" clip-rule="evenodd"></path>
                          <path fill-rule="evenodd" d="M7.83 7.146a.5.5 0 000 .708l5 5a.5.5 0 00.707-.708l-5-5a.5.5 0 00-.708 0z" clip-rule="evenodd"></path>
                          <path fill-rule="evenodd" d="M13.537 7.146a.5.5 0 010 .708l-5 5a.5.5 0 01-.708-.708l5-5a.5.5 0 01.707 0z" clip-rule="evenodd"></path>
                      </svg> */}
                  </a>
                {/* <img class='img-responsive' id='lower' src={SidebarIMG}/> */}
            </div>

            {/* <div class="sidenav-main">
              <br/>
                <div id="reset-message">
                    <h5>Enter your email address below.<br/>We'll send you a link to reset your password.</h5>
                </div>
                
                <div id="reset-form">
                    <form onSubmit={this.handleSubmit.bind(this)}> */}
                        {/* Email */}
                        {/* <br/>
                        <TextField id="outlined-basic" helperText="Please use your DLSU email address" label="Email Address" variant="outlined" name="email" placeholder="john_delacruz@dlsu.edu.ph" value={this.state.fields["email"]} onChange={this.handleChange.bind(this, "email")}/> */}
                        {/* <input name="email" onChange={this.handleChange.bind(this, "email")} value={this.state.fields["email"]}></input> */}
                        {/* <span className="error">{this.state.errors["email"]}</span> */}
                        {/* <br/>
                        <br/>
                        {this.renderRedirect()}
                        <input type="submit" class="btn btn-success" value="Send link" />
                    </form>                                    
                </div>
            </div> */}

<div style={{textAlign: 'center'}}>
                    <Row>
                      <Col />
                      <Col lg="8">
                        <h1 style={{color: "white"}}>
                            <img
                            alt=""
                            src="/logo.svg"
                            width="40"
                            height="40"
                            className="d-inline-block align-top"/> 
                        AnimoSched</h1>
                        <Jumbotron style={{padding: 32, backgroundColor: "white", marginLeft: "15%", marginRight: "15%", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                          <h5>
                            Log in to your account! Enter your email address below.<br/>We'll send you a link to reset your password.
                          </h5>
                            <div id="signup-form">
                              <form onSubmit={this.handleSubmit.bind(this)}>
                                  {/* Email */}
                                  <br/>
                                  <TextField  error={this.state.errors["email"]} id="outlined-basic" helperText="Please use your DLSU email address" label="Email Address" variant="outlined" name="email" placeholder="john_delacruz@dlsu.edu.ph" value={this.state.fields["email"]} onChange={this.handleChange.bind(this, "email")}/> 
                                  {/* <TextField style={{width: 350}} error={this.state.errors["email"]} helperText={this.state.helperEmail} id="outlined-basic" label="DLSU Email" variant="outlined" name="email" placeholder="john_delacruz@dlsu.edu.ph" value={this.state.fields["email"]} onChange={this.handleChange.bind(this, "email")}/> */}
                                  {/* <input name="email" placeholder="john_delacruz@dlsu.edu.ph" onChange={this.handleChange.bind(this, "email")} value={this.state.fields["email"]}></input> */}
                                  {/* <span className="error">{this.state.errors["email"]}</span> */}

                                  <br/>
                                  <br/>

                                  {this.renderRedirect()}
                              
                                  <input type="submit" style={{height: 0, width: 0, padding: 0, border: 0}} />
                                  <Row horizontal = 'center' style={{justifyContent: "center"}}>
                                  <div className={classes.root}>
                                    <div className={classes.wrapper}> 
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.buttonSend}
                                        disabled={this.state.loading}
                                        onClick={this.handleSubmit}
                                       
                                      >
                                        Send Link
                                      </Button>
                                      {this.state.loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
                                    </div>
                                  </div>
                                  </Row>

                                  
                              </form>
                              <Snackbar open={this.state.snackBar} autoHideDuration={4000} onClose={this.handleCloseSnackBar}>
                                <Alert onClose={this.handleCloseSnackBar} severity="error">
                                  {this.state.snackBarText}
                                </Alert>
                              </Snackbar>
                              <br/>
                              
                          </div>

                        </Jumbotron>
                      </Col>
                      <Col />
                    </Row>
                </div>
        </div>        
      );
    }
  }
  ResetPassword.propTypes={
    classes: PropTypes.object.isRequired,
  };
    export default withStyles(styles)(ResetPassword);