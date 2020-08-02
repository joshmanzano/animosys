import React, { Component } from "react";
import '../css/Forms.css';
import SidebarIMG from '../images/Register.svg';
import { Redirect } from "react-router-dom";

import ComboBox from '../components/ComboBox.jsx';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import { Container, Row, Col, Jumbotron, Card, CardBody } from "reactstrap";

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
    },
    buttonSuccess: {
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[700],
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
        color: "#d3d3d3",
      },
    },

    buttonRegister: {
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

    degreeStyle: {
      alignItems: "center", 
      justifyContent: "center", 
      justify: "center", 
      placeItems: "center"
    }
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

class Register extends Component {
    constructor(props){
        super(props);

        this.degreeRef = React.createRef();

        this.state = {
            fields: {},
            errors: {},
            colleges: [],
            degrees: [],
            snackBar: false,
            snackBarSucess: false,
            snackBarText: "",
            loading: false,
            success: false,
            errorFirstName: false,
            helperFirstName: "",
            errorLastName: false,
            helperLastName: "",
            errorEmail: false,
            helperEmail: "",
            errorID: false,
            helperID: "",
            errorCollege: false,
            helperCollege: "",
            errorDegree: false,
            helperDegree: "",
            errorPassword: false,
            helperPassword: "Must be a minimum of 8 characters",
            errorConPassword: false,
            helperConPassword: "Re-type your password here",
        }

    }
    componentWillMount(){
        axios.get('https://archerone-backend.herokuapp.com/api/colleges/')
        .then(res => {
          var newArray = [];
          res.data.map(college=>{
              newArray.push(college);
          })
          this.setState({colleges: newArray})
        })
        axios.get('https://archerone-backend.herokuapp.com/api/degrees/')
        .then(res => {
          var newArray = [];
          res.data.map(degree=>{
              newArray.push(degree);
          })
          this.setState({degrees: newArray});
          console.log(newArray);
        })
      }

    handleChange = (field, e) => {
        // this.setState({
        //     [e.target.name]: e.target.value
        // })

        let fields = this.state.fields;
        fields[field] = e.target.value;        
        if(field == 'college'){
          fields['degree'] = undefined
          console.log(this.degreeRef)
          this.degreeRef.current.setState({value: undefined})
          // this.degreeRef.current.setState({searchText: undefined})
          // console.log(this.degreeRef.current.state.value)
        }
        this.setState({fields});

    }

    handleAutoCompleteChange = (e, val) => {
        if(val != undefined){
          let fields = this.state.fields;
          fields['degree'] = val.id;
          console.log(val.id);
          this.setState({fields});
        }else{
          let fields = this.state.fields;
          fields['degree'] = undefined;
          this.setState({fields});
        }
    }

    handleValidation = () => {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
  
        // FIRSTNAME
        if(!fields["firstName"]){
            formIsValid = false;
            errors["firstName"] = "Required First Name"
            this.setState({errorFirstName: true})
            this.setState({helperFirstName: "This field is required"})
        }else{
            this.setState({errorFirstName: false})
            this.setState({helperFirstName: ""})
        }

        // LASTNAME
        if(!fields["lastName"]){
            formIsValid = false;
            errors["lastName"] = "Required Last Name"
            this.setState({errorLastName: true})
            this.setState({helperLastName: "This field is required"})
        }else{
            this.setState({errorLastName: false})
            this.setState({helperLastName: ""})
        }

        // EMAIL
        if(!fields["email"]){
          formIsValid = false;
          errors["email"] = "Required Email"
            this.setState({errorEmail: true})
            this.setState({helperEmail: "This field is required"})
        }else{
            this.setState({errorEmail: false})
            this.setState({helperEmail: "This field is required"})
        }
  
        if(typeof fields["email"] !== "undefined"){
          let lastAtPos = fields["email"].lastIndexOf('@');
          let lastDotPos = fields["email"].lastIndexOf('.');
  
          if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
            formIsValid = false;
            errors["email"] = "Invalid Email";
            this.setState({errorEmail: true})
            this.setState({helperEmail: "Enter a valid DLSU email"})
          }else{
                this.setState({errorEmail: false})
                this.setState({helperEmail: "Enter a valid DLSU email"})
            }
        }

        // ID NUMBER
        if(!fields["idNo"]){
            formIsValid = false;
            errors["idNo"] = "Required ID Number"
            this.setState({errorID: true})
            this.setState({helperID: "This field is required"})
        }else{
            this.setState({errorID: false})
            this.setState({helperID: ""})
        }
  
        // PASSWORD
        if(!fields["pass"]){
          formIsValid = false;
          errors["pass"] = "Required Password"
            this.setState({errorPassword: true})
            this.setState({helperPassword: "This field is required"})
        }else{
            this.setState({errorPassword: false})
            this.setState({helperPassword: "Must be a minimum of 8 characters"})
        }

        // CONFIRM PASSWORD
        if(!fields["passCon"]){
            formIsValid = false;
            errors["passCon"] = "Required Confirm Password"
            this.setState({errorConPassword: true})
            this.setState({helperConPassword: "This field is required"})
        }else{
            this.setState({errorConPassword: false})
            this.setState({helperConPassword: "Re-enter your password here"})
        }

        if(!fields["college"]){
            formIsValid = false;
            errors["college"] = "Required College"
            this.setState({errorCollege: true})
            this.setState({helperCollege: "This field is required"})
        }else{
            this.setState({errorCollege: false})
            this.setState({helperCollege: ""})
        }

        if(!fields["degree"]){
            formIsValid = false;
            errors["degree"] = "Required Degree"
            this.setState({errorDegree: true})
            this.setState({helperDegree: "Required Degree"})
        }else{
            this.setState({errorDegree: false})
            this.setState({helperDegree: ""})
        }
  
        this.setState({errors: errors});
        return formIsValid;
    }

    state = {
        redirect: false
    }

    setRedirect = () => {
        this.setState({
          redirect: true
        })
    }

    renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to='/' />
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(!this.state.loading){
            this.setState({loading: true});
            this.setState({success: false});
          }else{
            this.setState({success: true});
            this.setState({loading: false});
          } 

        if(this.handleValidation()){
            const data = {

                // START EDITING HERE

                email: this.state.fields['email'],
                // username: this.state.idNo,
                id_num: this.state.fields['idNo'],
                first_name: this.state.fields['firstName'],
                last_name: this.state.fields['lastName'],
                password1: this.state.fields['pass'],
                password2: this.state.fields['passCon'],
                college: Number(this.state.fields['college']),
                degree: Number(this.state.fields['degree'])
            };
            console.log(data);
            this.props.handle_register(data, (res) => {
                if(res == null){
                    this.setState({success: true});
                    this.setState({loading: false});
                    this.setState({snackBarSuccess: true})
                }else{
                  this.setState({success: false});
                  this.setState({loading: false});
                  if(res.status == 400){
                    for (var key in res.data) {
                      this.setState({snackBarText: key + ': ' + res.data[key][0]})
                    }
                  }else{
                      this.setState({snackBarText: "Account already exists."})
                  }
                  this.setState({snackBar: true})
                }
            });
        }else{
            this.setState({success: false});
            this.setState({loading: false});
            this.setState({snackBar: true});
        }
    }

    handleCloseSnackBar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      this.setState({snackBar: false});
      this.setState({snackBarSuccess: false});
    }

    render() {
        const { classes } = this.props;
      return (
        <div style={sectionStyle}>

            
                  <div className={"backBtn"}>
                  <a className="backBtn" href="/">
                  <ArrowBackIosIcon fontSize="large"className={classes.backBtn} viewBox="0 0 1 24"/> <span className="backBtn">Back</span>
                    {/* <svg class="bi bi-backspace" width="3em" height="3em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M8.603 4h7.08a1 1 0 011 1v10a1 1 0 01-1 1h-7.08a1 1 0 01-.76-.35L3 10l4.844-5.65A1 1 0 018.603 4zm7.08-1a2 2 0 012 2v10a2 2 0 01-2 2h-7.08a2 2 0 01-1.519-.698L2.241 10.65a1 1 0 010-1.302L7.084 3.7A2 2 0 018.603 3h7.08z" clip-rule="evenodd"></path>
                        <path fill-rule="evenodd" d="M7.83 7.146a.5.5 0 000 .708l5 5a.5.5 0 00.707-.708l-5-5a.5.5 0 00-.708 0z" clip-rule="evenodd"></path>
                        <path fill-rule="evenodd" d="M13.537 7.146a.5.5 0 010 .708l-5 5a.5.5 0 01-.708-.708l5-5a.5.5 0 01.707 0z" clip-rule="evenodd"></path>
                    </svg> */}
                  </a>
                  </div>
            
                
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
                        <Jumbotron className={"jumboClass"} style={{padding: 32, backgroundColor: "white", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                          <h3>
                            Account Registration
                          </h3>
                          <div id="signup-form">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        {/* First Name */}
                        <br/>
                        {/* <input name="firstName" placeholder="John" value={this.state.fields["firstName"]} onChange={this.handleChange.bind(this, "firstName")}/> */}
                        <TextField error={this.state.errorFirstName} helperText={this.state.helperFirstName} id="outlined-basic" label="First Name" variant="outlined" name="firstName" placeholder="John" value={this.state.fields["firstName"]} onChange={this.handleChange.bind(this, "firstName")} style={{marginRight: 25, width: 250}}></TextField>
                        {/* <span className="error" style={{marginRight: "15%"}}>{this.state.errors["firstName"]}</span>*/}
 
                        <TextField error={this.state.errorLastName} helperText={this.state.helperLastName} id="outlined-basic" label="Last Name" variant="outlined" name="lastName" placeholder="Dela Cruz" value={this.state.fields["lastName"]} onChange={this.handleChange.bind(this, "lastName")} style={{marginRight: 25, width: 250}}></TextField>
                        {/* <input name="lastName" placeholder="Dela Cruz" value={this.state.fields["lastName"]} onChange={this.handleChange.bind(this, "lastName")}/> */}
                        {/* <span className="error">{this.state.errors["lastName"]}</span>*/}

                        {/* ID Number */}
                        <TextField error={this.state.errorID} helperText={this.state.helperID} id="outlined-basic" label="ID Number" variant="outlined" name="idNo" placeholder="11612345" value={this.state.fields["idNo"]} onChange={this.handleChange.bind(this, "idNo")} style={{width: 185}}/>
                        {/* <input name="idNo" placeholder="11612345" onChange={this.handleChange.bind(this, "idNo")} value={this.state.fields["idNo"]}/> */}
                        {/* <span className="error">{this.state.errors["idNo"]}</span>*/}
                        <br/><br/>

                        {/* College */}
                        <div className="collegeField">
                            {/* Email Address */}
                            <TextField error={this.state.errorEmail} helperText={this.state.helperEmail} id="outlined-basic" label="DLSU Email" variant="outlined" name="email" placeholder="john_delacruz@dlsu.edu.ph" value={this.state.fields["email"]} onChange={this.handleChange.bind(this, "email")} style={{marginRight: 50, width: 345}}/>
                            {/* <input name="email" placeholder="john_delacruz@dlsu.edu.ph" onChange={this.handleChange.bind(this, "email")} value={this.state.fields["email"]}/> */}
                            {/* <span className="error" style={{marginRight: "15%"}}>{this.state.errors["email"]}</span>*/}

                            <TextField
                                error={this.state.errorCollege} helperText={this.state.helperCollege}
                                id="outlined-select-college"
                                select
                                label="College"
                                onChange={this.handleChange.bind(this, "college")}
                                value = {this.state.fields["college"]}
                                style={{width: 345}}
                                variant="outlined">
                                {this.state.colleges.map(college => (
                                    <MenuItem key={college.id} value={college.id}>
                                    {college.college_name}
                                    </MenuItem>
                                    
                                ))}
                            </TextField>
                          {/* <span className="error" style={{marginRight: "15%"}}>{this.state.errors["college"]}</span>*/}
                        </div>
                        {/* <select id="college" name="college" value={this.state.fields["college"]} onChange={this.handleChange.bind(this, "college")} >
                            <>
                            
                            {this.state.colleges.map(college => (
                                <option value={college.id}>{college.college_name}</option>
                            ))}
                            </>
                        </select> */}
                       
                        <br/>
                        {/* Degree */}
                        {/* <span className="error">{this.state.errors["degree"]}</span> */}
                        <Row horizontal = 'center' style={{justifyContent: "center"}}>
                          <div>
                            <ComboBox error={this.state.errorDegree} helperText={this.state.helperDegree} ref={this.degreeRef} page="register" name="degree" value={this.state.fields["degree"]} onChange={this.handleAutoCompleteChange} college={this.state.fields["college"]} degrees={this.state.degrees} className={classes.degreeStyle}/><br/>
                          </div>
                        </Row>
                        {/* Password */}
                        <TextField error={this.state.errorPassword} helperText={this.state.helperPassword} type="password"  id="outlined-basic" label="Password" variant="outlined" name="pass" placeholder="●●●●●●●●" value={this.state.fields["pass"]} onChange={this.handleChange.bind(this, "pass")} style={{marginRight: 50, width: 345}}/>
                        {/* <input type="password" name="pass" placeholder="●●●●●●●●" onChange={this.handleChange.bind(this, "pass")} value={this.state.fields["pass"]}/> */}
                        {/* <span className="error" style={{marginRight: "15%"}}>{this.state.errors["pass"]}</span>*}
                     

                        {/* Confirm Password */}
                       
                        <TextField error={this.state.errorConPassword} helperText={this.state.helperConPassword} type="password"  id="outlined-basic" label="Confirm Password" variant="outlined" name="passCon" placeholder="●●●●●●●●" value={this.state.fields["pasCon"]} onChange={this.handleChange.bind(this, "passCon")} style={{width: 345}}/>
                        {/* <input type="password" name="passCon" placeholder="●●●●●●●●" onChange={this.handleChange.bind(this, "passCon")} value={this.state.fields["passCon"]}/> */}
                        {/* <span className="error">{this.state.errors["passCon"]}</span>*/}
                        <br/>

                        {this.renderRedirect()}
                        <input type="submit" style={{height: 0, width: 0, padding: 0, border: 0}} />
                        <Row horizontal = 'center' style={{justifyContent: "center"}}>
                          <div className={classes.root}>
                            <div className={classes.wrapper}> 
                              <Button
                                variant="contained"
                                color="primary"
                                className={classes.buttonRegister}
                                disabled={this.state.loading}
                                onClick={this.handleSubmit}
                                
                              >
                                Register
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
                    <Snackbar open={this.state.snackBarSuccess} autoHideDuration={4000} onClose={this.handleCloseSnackBar}>
                      <Alert onClose={this.handleCloseSnackBar} severity="success">
                      Email verification sent
                      </Alert>
                    </Snackbar>
                    <br/>

                    {/* <div id="signup-message"> */}
                    <p>Already have an account? <a href="/login">Log in!</a></p>
                {/* </div> */}
                    
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

  Register.propTypes={
    classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles)(Register);