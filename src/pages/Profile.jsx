import React, { Component } from "react";
import { Column, Row } from 'simple-flexbox';
import Menu from '../components/Menu.jsx';
import '../css/Profile.css';
import axios from 'axios';
import ResetPassword from "./ResetPassword.jsx";
import EditableLabel from 'react-inline-editing';

import TextField from '@material-ui/core/TextField';

import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { green } from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import ReactLoading from 'react-loading';

import { Element } from 'react-scroll'

const styles = theme => ({
    pencilIcon:{ 
        marginLeft: "10px",
        '&:hover': {
            backgroundColor: "white",
            color: "gray"
          },
    },
    checkIcon:{
        color: "green", 
        '&:hover': {
            backgroundColor: "white",
            color: "#79c879"
          },
    }
  });

const GreenCheckbox = withStyles({
    root: {
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

class Profile extends Component {
    constructor(props){
      super(props);
      this.state = {
          email: '',
          first_name: '',
          last_name: '',
          college: '',
          degree: '',
          id_num: '',
          emailBool: false,
        //   firstNameBool: false,
        //   lastNameBool: false,
        //   collegeBool: false,
        //   degreeBool: false,
        //   idNoBool: false,
        fieldsBool: {
            emailBool: false,
            firstNameBool: false,
            lastNameBool: false,
            collegeBool: false,
            degreeBool: false,
            idNoBool: false
        },
        dataReceived: false
      }
      this.editFirstName = React.createRef();
      this.editLastName = React.createRef();
      this.editEmail = React.createRef();
      this.editIdNo = React.createRef();
      this.editCollege = React.createRef();
      this.editDegree = React.createRef();
    }

    componentWillMount(){
        axios.get('https://archerone-backend.herokuapp.com/api/auth/user/',
        {
            headers: {
            Authorization: `JWT ${localStorage.getItem('token')}` 
            },
            withCredentials: true
        })
        .then(res => {
            console.log(res.data)
            this.setState({
                email: res.data.email,
                first_name: res.data.first_name,
                last_name: res.data.last_name,
                id_num: res.data.id_num, 
            })
            const college = res.data.college;
            const degree = res.data.degree;
            axios.get('https://archerone-backend.herokuapp.com/api/colleges/'+college+'/')
            .then(res => {
              this.setState({college: res.data.college_name})
              axios.get('https://archerone-backend.herokuapp.com/api/degrees/'+degree+'/')
              .then(res => {
                this.setState({degree: res.data.degree_name});
                this.setState({dataReceived: true})
              })
            })
        })
        .catch(error => {
            console.log(error)
        })
    }

    handleFocus(text) {
        console.log('Focused with text: ' + text);
    }

    handleFocusOut(text) {
        console.log('Left editor with text: ' + text);
    }


    _handleFocus=(text, iconBool)=> {
        let fieldsBool = this.state.fieldsBool;
        fieldsBool[iconBool] = true;
        this.setState({fieldsBool});
        console.log('Focused with text: ' + text);
        
    }

    _handleFocusOut=(text, iconBool)=> {
        this.setState({boolEdit: false});
        let fieldsBool = this.state.fieldsBool;
         fieldsBool[iconBool] = false;
        if(iconBool == 'firstNameBool'){
            axios.patch('https://archerone-backend.herokuapp.com/api/users/'+localStorage.getItem('user_id')+'/',{
                'first_name': text
            }).then(res => {
                localStorage.setItem('first_name',text)
            })
            .catch(err => {
                console.log(err.response)
            })
        }else if(iconBool == 'lastNameBool'){
            axios.patch('https://archerone-backend.herokuapp.com/api/users/'+localStorage.getItem('user_id')+'/',{
                'last_name': text
            }).then(res => {
                localStorage.setItem('last_name',text)
            })
            .catch(err => {
                console.log(err.response)
            })
        }else if(iconBool == 'idNoBool'){
            axios.patch('https://archerone-backend.herokuapp.com/api/users/'+localStorage.getItem('user_id')+'/',{
                'id_num': text
            })
            .catch(err => {
                console.log(err.response)
            })
        }else if(iconBool == 'collegeBool'){
            axios.patch('https://archerone-backend.herokuapp.com/api/users/'+localStorage.getItem('user_id')+'/',{
                'college': text
            })
            .catch(err => {
                console.log(err.response)
            })
        }else if(iconBool == 'degreeBool'){
            axios.patch('https://archerone-backend.herokuapp.com/api/users/'+localStorage.getItem('user_id')+'/',{
                'degree': text
            })
            .catch(err => {
                console.log(err.response)
            })
        }else if(iconBool == 'emailBool'){
            axios.patch('https://archerone-backend.herokuapp.com/api/users/'+localStorage.getItem('user_id')+'/',{
                'email': text
            })
            .catch(err => {
                console.log(err.response)
            })
        }

    }

    editButtonPress = (iconBool, editRef) =>{
        let fieldsBool = this.state.fieldsBool;
        if(fieldsBool[iconBool] === false){
            fieldsBool[iconBool] = true;
            this.setState({fieldsBool});
            editRef.current.setState({isEditing: true});
        }else if(fieldsBool[iconBool] === true){
            fieldsBool[iconBool] = false;
            this.setState({fieldsBool});
        }
    }

    render() {
        const { classes } = this.props;
      return (
          <div>
            {this.props.menu('profile')}

            {this.state.dataReceived ? 
            <div>
            <div className="profile-category">
                <h2>Account Profile</h2>

                <div className="profile-category-content">
                    <b>First Name</b>
                    <br/>
                    {/* <input value={this.state.first_name}/><br/><br/> */}
                    
                    <Row horizontal= 'start'>
                    <EditableLabel
                        ref={this.editFirstName}
                        text={this.state.first_name}
                        inputWidth='150px'
                        inputHeight='25px'
                        inputMaxLength='30'
                        onFocus={(text)=>this._handleFocus(text, 'firstNameBool')}
                        onFocusOut={(text)=>this._handleFocusOut(text, 'firstNameBool')}
                    />
                    {this.state.fieldsBool['firstNameBool'] ? <DoneIcon fontSize="medium" className={classes.checkIcon} onClick={()=>this.editButtonPress('firstNameBool',this.editFirstName)}/> : <EditIcon fontSize= "small" className={classes.pencilIcon} onClick={()=>this.editButtonPress('firstNameBool',this.editFirstName)}/>}
                    </Row>
                
                    
                    <br/>
                    
                    <b>Last Name</b>
                    <br/>
                    {/* <input value={this.state.last_name}/><br/><br/> */}
                    <Row horizontal= 'start'>
                    <EditableLabel
                        ref={this.editLastName}
                        text={this.state.last_name}
                        inputWidth='150px'
                        inputHeight='25px'
                        inputMaxLength='30'
                        onFocus={(text)=>this._handleFocus(text, 'lastNameBool')}
                        onFocusOut={(text)=>this._handleFocusOut(text, 'lastNameBool')}
                    />
                    {this.state.fieldsBool['lastNameBool'] ? <DoneIcon fontSize="medium" className={classes.checkIcon} onClick={()=>this.editButtonPress('lastNameBool',this.editLastName)}/> : <EditIcon fontSize= "small" className={classes.pencilIcon} onClick={()=>this.editButtonPress('lastNameBool',this.editLastName)}/>}
                    </Row>
                    {/* <EditableLabel
                        initialValue={this.state.last_name}
                        inputWidth='50%'
                        inputHeight='25px'
                        inputMaxLength='50'
                        onFocus={(text)=>this._handleFocus(text, 'lastNameBool')}
                        onFocusOut={this._handleFocusOut}
                    /> */}
                    <br/>

                    <b>ID Number</b>
                    <br/>
                    {/* <input value={this.state.id_num}/><br/><br/> */}

                    <Row horizontal= 'start'>
                        <p>{this.state.id_num}</p>
                        {/* <EditableLabel
                            ref={this.editIdNo}
                            text={this.state.id_num}
                            inputWidth='90px'
                            inputHeight='25px'
                            inputMaxLength='30'
                            // onFocus={(text)=>this._handleFocus(text, 'idNoBool')}
                            // onFocusOut={(text)=>this._handleFocusOut(text, 'idNoBool')}
                        />*/}
                        {/* {this.state.fieldsBool['idNoBool'] ? <DoneIcon fontSize="medium" className={classes.checkIcon} onClick={()=>this.editButtonPress('idNoBool',this.editIdNo)}/> : <EditIcon fontSize= "small" className={classes.pencilIcon} onClick={()=>this.editButtonPress('idNoBool',this.editIdNo)}/>} */}
                    </Row>
                    {/* <EditableLabel
                        text={this.state.id_num}
                        inputWidth='50%'
                        inputHeight='25px'
                        inputMaxLength='50'
                        onFocus={this._handleFocus}
                        onFocusOut={this._handleFocusOut}
                    /> */}
                    <br/>

                    <b>College</b>
                    <br/>
                    {/* <input value={this.state.college}/><br/><br/> */}
                    <Row horizontal= 'start'>
                        <p>{this.state.college}</p>
                        {/*<EditableLabel
                            ref={this.editCollege}
                            text={this.state.college}
                            inputWidth='250px'
                            inputHeight='25px'
                            inputMaxLength='30'
                            // onFocus={(text)=>this._handleFocus(text, 'collegeBool')}
                            // onFocusOut={(text)=>this._handleFocusOut(text, 'collegeBool')}
                        />*/}
                        {/* {this.state.fieldsBool['collegeBool'] ? <DoneIcon fontSize="medium" className={classes.checkIcon} onClick={()=>this.editButtonPress('collegeBool',this.editCollege)}/> : <EditIcon fontSize= "small" className={classes.pencilIcon} onClick={()=>this.editButtonPress('collegeBool',this.editCollege)}/>} */}
                    </Row>
                    <br/>
                    <b>Degree</b>
                    <br/>
                    {/* <input value={this.state.degree}/><br/><br/> */}
                    <Row horizontal= 'start'>
                        <p>{this.state.degree}</p>
                        {/*
                        <EditableLabel
                            ref={this.editDegree}
                            text={this.state.degree}
                            inputWidth='250px'
                            inputHeight='25px'
                            inputMaxLength='30'
                            // onFocus={(text)=>this._handleFocus(text, 'degreeBool')}
                            // onFocusOut={(text)=>this._handleFocusOut(text, 'degreeBool')}
                        />*/}
                        {/* {this.state.fieldsBool['degreeBool'] ? <DoneIcon fontSize="medium" className={classes.checkIcon} onClick={()=>this.editButtonPress('degreeBool',this.editDegree)}/> : <EditIcon fontSize= "small" className={classes.pencilIcon} onClick={()=>this.editButtonPress('degreeBool',this.editDegree)}/>} */}
                    </Row>
                    <br/>
                    <b>Email Address</b>
                    <br/>
                    {/* <input value={this.state.email}/><br/><br/> */}
                    <Row horizontal= 'start' id="notifs-container">
                        <p>{this.state.email}</p>
                        {/*
                        <EditableLabel
                            ref={this.editEmail}
                            text={this.state.email}
                            inputWidth='250px'
                            inputHeight='25px'
                            inputMaxLength='30'
                            // onFocus={(text)=>this._handleFocus(text, 'emailBool')}
                            // onFocusOut={(text)=>this._handleFocusOut(text, 'emailBool')}
                        />*/}
                        {/* {this.state.fieldsBool['emailBool'] ? <DoneIcon fontSize="medium" className={classes.checkIcon} onClick={()=>this.editButtonPress('emailBool',this.editEmail)}/> : <EditIcon fontSize= "small" className={classes.pencilIcon} onClick={()=>this.editButtonPress('emailBool',this.editEmail)}/>} */}
                    </Row>
                    <br/>
                </div>
            </div>
            
            <div className="profile-category" >
                <h2>Password Settings</h2>
                    
                <div className="profile-category-content" >
                    <b>Current Password</b>
                    <br/>
                    <Row horizontal= 'start'>
                        <EditableLabel
                            // ref={this.editFirstName}
                            // text={this.state.first_name}
                            text='●●●●●●●●'
                            inputWidth='150px'
                            inputHeight='25px'
                            inputMaxLength='30'
                            // onFocus={(text)=>this._handleFocus(text, 'firstNameBool')}
                            // onFocusOut={(text)=>this._handleFocusOut(text, 'firstNameBool')}
                        />
                        {/* {this.state.fieldsBool['firstNameBool'] ? <DoneIcon fontSize="medium" className={classes.checkIcon} onClick={()=>this.editButtonPress('firstNameBool',this.editFirstName)}/> : <EditIcon fontSize= "small" className={classes.pencilIcon} onClick={()=>this.editButtonPress('firstNameBool',this.editFirstName)}/>} */}
                    </Row>
                    <a href="/password_reset" style={{fontSize: 13}}>Forgot your password?</a>

                    <br/>
                    <br/>

                    <b>New Password</b>
                    <br/>
                    <Row horizontal= 'start'>
                        <EditableLabel
                            // ref={this.editFirstName}
                            // text={this.state.first_name}
                            text='●●●●●●●●'
                            inputWidth='150px'
                            inputHeight='25px'
                            inputMaxLength='30'
                            // onFocus={(text)=>this._handleFocus(text, 'firstNameBool')}
                            // onFocusOut={(text)=>this._handleFocusOut(text, 'firstNameBool')}
                        />
                        {/* {this.state.fieldsBool['firstNameBool'] ? <DoneIcon fontSize="medium" className={classes.checkIcon} onClick={()=>this.editButtonPress('firstNameBool',this.editFirstName)}/> : <EditIcon fontSize= "small" className={classes.pencilIcon} onClick={()=>this.editButtonPress('firstNameBool',this.editFirstName)}/>} */}
                    </Row>

                    <br/>

                    <b>Confirm Password</b>
                    <br/>
                    <Row horizontal= 'start'>
                        <EditableLabel
                            // ref={this.editFirstName}
                            // text={this.state.first_name}
                            text='●●●●●●●●'
                            inputWidth='150px'
                            inputHeight='25px'
                            inputMaxLength='30'
                            // onFocus={(text)=>this._handleFocus(text, 'firstNameBool')}
                            // onFocusOut={(text)=>this._handleFocusOut(text, 'firstNameBool')}
                        />
                        {/* {this.state.fieldsBool['firstNameBool'] ? <DoneIcon fontSize="medium" className={classes.checkIcon} onClick={()=>this.editButtonPress('firstNameBool',this.editFirstName)}/> : <EditIcon fontSize= "small" className={classes.pencilIcon} onClick={()=>this.editButtonPress('firstNameBool',this.editFirstName)}/>} */}
                    </Row>

                    <center>
                        <input class="btn btn-success submit-form" type="submit" value="Save"/>
                    </center>

                </div>
            </div>
            
            <div className="profile-category" >
                <h2>Notification Settings</h2>
                    
                <div className="profile-category-content" >
                    Notify me on AnimoSched when:
                    <FormGroup>
                        <FormControlLabel
                        control = {<GreenCheckbox color="primary"/>} label={"A class in my schedule is full, or has open slots"} />
                        <FormControlLabel
                        control = {<GreenCheckbox color="primary"/>} label={"A conflict between classes in my schedule is detected"} />
                        <FormControlLabel
                        control = {<GreenCheckbox color="primary"/>} label={"My friends make changes to their schedules and preferences"}/>
                    </FormGroup>
                    <center>
                        <input class="btn btn-success submit-form" type="submit" value="Save"/>
                    </center>
                    {/* <form>
                        <input className="checkbox-description" type="checkbox" id="" name="" value=""/>
                        <label className="checkbox-description" for=""> The status of your chosen sections in your schedule has changed. </label><br/>

                        <input className="checkbox-description" type="checkbox" id="" name="" value=""/>
                        <label className="checkbox-description" for=""> Course conflicts in your schedule. </label><br/>

                        <input className="checkbox-description" type="checkbox" id="" name="" value=""/>
                        <label className="checkbox-description" for=""> Your friends make changes to their schedules and preferences. </label>

                        <center>
                        <input class="btn btn-success submit-form" type="submit" value="Submit"/>
                        </center>
                    </form> */}

                </div>
            </div>

            <div className="profile-category">
                <h2>Data Privacy Settings</h2>

                <div className="profile-category-content">
                    Allow friends to view
                    <FormGroup>
                        <FormControlLabel
                        control = {<GreenCheckbox color="primary"/>} label={"Your saved schedules"} />
                        <FormControlLabel
                        control = {<GreenCheckbox color="primary"/>} label={"Your schedule preferences"} />
                        <FormControlLabel
                        control = {<GreenCheckbox color="primary"/>} label={"College and course details"}/>
                    </FormGroup>
                    <center>
                        <input class="btn btn-success submit-form" type="submit" value="Save"/>
                    </center>

                    {/* <form>
                        <input className="checkbox-description" type="checkbox" id="" name="" value=""/>
                        <label className="checkbox-description" for=""> Your saved schedules. </label><br/>

                        <input className="checkbox-description" type="checkbox" id="" name="" value=""/>
                        <label className="checkbox-description" for=""> Your schedule preferences. </label><br/>

                        <input className="checkbox-description" type="checkbox" id="" name="" value=""/>
                        <label className="checkbox-description" for=""> College and course details. </label>

                        <center>
                            <input class="btn btn-success submit-form" type="submit" value="Submit"/>
                        </center>
                    </form> */}
                </div>
            </div>
            </div> : 
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh"}}>
                    <ReactLoading type={'spin'} color={'#9BCFB8'} height={'5%'} width={'5%'}/>
              </div>
            }
        </div>        
      );
    }
  }

  Profile.propTypes={
    classes: PropTypes.object.isRequired,
  };
  export default withStyles(styles)(Profile);