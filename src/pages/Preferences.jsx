import React, { Component } from "react";
import '../css/Preferences.css';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { DateTimePicker, KeyboardDateTimePicker, MuiPickersUtilsProvider, KeyboardTimePicker } from "@material-ui/pickers";
// import { IconButton, InputAdornment } from "@material-ui/core";
// import DateFnsUtils from '@date-io/date-fns';

import { green, red } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Grid from '@material-ui/core/Grid';

import MenuItem from '@material-ui/core/MenuItem';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import HomeIcon from '@material-ui/icons/Home';

import PropTypes from 'prop-types';

import ReactLoading from 'react-loading';

import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';
import { Row, Col } from 'reactstrap';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    homeButton:{
        color: "green", 
        marginLeft: "10px",
        '&:hover': {
            color: "#79c879"
          },
    },

    iconStyle:{ 
        margin: "10px", 
          '&:hover': {
            color: green[500],
        },
    },
    buttonStyle:{
        marginBottom: "50px",
        textTransform: "none",
        width: "160px",
        borderRadius: "25px",
        padding: "10px",
        paddingLeft: "10px",
        paddingRight: "10px",
        backgroundColor: "#16775D",
        border: "none",
        color: "white",
        boxShadow: "6px 5px #e8f4ea",
        borderStyle: "solid",
        borderColor: "#16775D",
        marginTop: "20px",
        justifyContent: 'center',
        '&:hover': {
            backgroundColor: "white",
            color: "#16775D"
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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Preferences extends Component {
    constructor(props){
        super(props)
        this.state = {
            openModalHelp: false,
            savedPrefBar: false,
            earliest_class_time: '07:30',
            latest_class_time: '21:00',
            break_length: 15,
            min_courses: 0, 
            max_courses: 10,
            dataReceived: false,
            dataSaved: false,
            selectedProfs: [],
            profList: [],
            selectedSections: [],
            sectionList: [
                // {
                //     id: 0,
                //     section_code: "C"
                // },
                // {
                //     id: 1,
                //     section_code: "K"
                // },
                // {
                //     id: 2,
                //     section_code: "S"
                // },
                // {
                //     id: 3,
                //     section_code: "L"
                // },
                // {
                //     id: 4,
                //     section_code: "E"
                // },
                // {
                //     id: 5,
                //     section_code: "A"
                // },
                // {
                //     id: 6,
                //     section_code: "N"
                // },
                // {
                //     id: 7,
                //     section_code: "V"
                // },
                // {
                //     id: 8,
                //     section_code: "M"
                // },
                // {
                //     id: 9,
                //     section_code: "X"
                // },
                // {
                //     id: 10,
                //     section_code: "G"
                // },
            ],
            
            selectedDate: "",

            daysList:[
                {   id: 1,
                    day_code: "M",
                    day: "Monday",
                    checked: false,},
                { 
                    id: 2,
                    day_code: "T",
                    day: "Tuesday",
                    checked: false,},
                {
                    id: 3,
                    day_code: "W",
                    day: "Wednesday",
                    checked: false,},
                {
                    id: 4, 
                    day_code: "H",
                    day: "Thursday",
                    checked: false,},
                {
                    id: 5,
                    day_code: "F",
                    day: "Friday",
                    checked: false,},
                { 
                    id: 6,
                    day_code: "S",
                    day: "Saturday",
                    checked: false,},

                ],
            
            buildingList:[{   
                id: 2,
                bldg_code: "LS",
                building: "St. La Salle Hall",
                checked: false,},
            { 
                id: 3,
                bldg_code: "Y",
                building: "Enrique Yuchengco Hall",
                checked: false,},
            {
                id: 4,
                bldg_code: "J",
                building: "St. Joseph Hall",
                checked: false,},
            {
                id: 5, 
                bldg_code: "V",
                building: "Velasco Hall",
                checked: false,},
            {
                id: 6,
                bldg_code: "M",
                building: "St. Miguel Hall",
                checked: false,},
            { 
                id: 7,
                bldg_code: "MU",
                building: "St. Mutien Marie Hall",
                checked: false,},
            {
                id: 1,
                bldg_code: "GK",
                building: "Gokongwei Hall",
                checked: false,},
            { 
                id: 8,
                bldg_code: "A",
                building: "Br. Andrew Gonzales Hall",
                checked: false,},],

            
            breakOptions: [
                {
                    option: "15 Minutes",
                    value: 15
                },
                {
                    option: "30 Minutes",
                    value: 30
                },
                {
                    option: "45 Minutes",
                    value: 45
                },
                {
                    option: "1 Hour",
                    value: 60
                },
                {
                    option: "2 Hour",
                    value: 120
                },
                {
                    option: "3 Hour",
                    value: 180
                },
                {
                    option: "4 Hour",
                    value: 240
                },
                {
                    option: "5 Hour",
                    value: 300
                },
                {
                    option: "6 Hour",
                    value: 360
                },
                {
                    option: "7 Hour",
                    value: 420
                },
                {
                    option: "8 Hour",
                    value: 480
                },
                {
                    option: "9 Hour",
                    value: 540
                },
            ]


        }

        
    }

    handleCloseModalHelp = ()=>{
        this.setState({openModalHelp: false})
    }

    handleOpenModalHelp = ()=>{
        this.setState({openModalHelp: true})
    }

    toggleModal = () => {
        var openModalVar = this.state.openModalHelp;
        this.setState({openModalHelp: !openModalVar});
      }
    
    componentDidMount(){
        const id = localStorage.getItem('user_id');
        axios.get('https://archerone-backend.herokuapp.com/api/faculty/')
        .then(res => {
            res.data.map(faculty => {
                var prof = {'id': faculty.id, 'profName': faculty.full_name} 
                this.setState(state =>{
                    const profList = state.profList;
                    profList.push(prof);
                    return {profList}
                })
            })
        });
        axios.get('https://archerone-backend.herokuapp.com/api/sections/')
        .then(res => {
            res.data.map(section => {
                if(section.section_code.length == 1){
                    var section = {'id': section.id, 'sectionName': section.section_code + " (All sections)"} 
                }else{
                    var section = {'id': section.id, 'sectionName': section.section_code} 
                }
                this.setState(state =>{
                    const sectionList = state.sectionList;
                    sectionList.push(section);
                    return {sectionList}
                })
            })
        });
            axios.get('https://archerone-backend.herokuapp.com/api/preferencelist/'+id+'/')
            .then(res => {
                console.log(res.data)
                res.data.map(preference =>{
                    if(preference.earliest_class_time != null){
                        this.setState({earliest_class_time:preference.earliest_class_time})
                    }
                    if(preference.latest_class_time != null){
                        this.setState({latest_class_time:preference.latest_class_time})
                    }
                    if(preference.preferred_days != null){
                        const newDaysList = [];
                        this.state.daysList.map(day => {
                            if(preference.preferred_days == day.id){
                                newDaysList.push({'id':day.id, 'day_code':day.day_code, 'day':day.day, 'checked':true})
                            }else{
                                newDaysList.push(day);
                            }
                        })
                        this.setState({daysList: newDaysList})
                    }
                    if(preference.break_length != null){
                        this.setState({break_length:preference.break_length})
                    }
                    if(preference.min_courses != null){
                        this.setState({min_courses:preference.min_courses})
                    }
                    if(preference.max_courses != null){
                        this.setState({max_courses:preference.max_courses})
                    }
                    if(preference.preferred_faculty != null){
                        const selectedProfs = this.state.selectedProfs;
                        var prof = {'id': preference.preferred_faculty.id, 'profName': preference.preferred_faculty.full_name} 
                        selectedProfs.push(prof);
                        this.setState({selectedProfs})
                        const profList = [];
                        this.state.profList.map(prof2 => {
                            if(prof2.profName != prof.profName){
                                profList.push(prof2);
                            }
                        })
                        this.setState({profList})
                    }
                    if(preference.preferred_buildings != null){
                        const newBuildingList = [];
                        this.state.buildingList.map(bldg => {
                            if(preference.preferred_buildings == bldg.id){
                                newBuildingList.push({'id':bldg.id, 'bldg_code':bldg.bldg_code, 'building':bldg.building, 'checked':true})
                            }else{
                                newBuildingList.push(bldg);
                            }
                        })
                        this.setState({buildingList: newBuildingList})
                    }
                    if(preference.preferred_sections != null){
                        const selectedSections = this.state.selectedSections;
                        var section = {'id': preference.preferred_sections.id, 'sectionName': preference.preferred_sections.section_code} 
                        selectedSections.push(section);
                        this.setState({selectedSections})
                        const sectionList = [];
                        this.state.sectionList.map(section2 => {
                            if(section2.sectionName != section.sectionName){
                                sectionList.push(section2);
                            }
                        })
                        this.setState({sectionList})
                    }
                })
                this.setState({dataReceived: true})
            });
    }

    handleProfPrefChange = (e, val) =>{
        const profList = this.state.profList
        this.state.selectedProfs.map(prof => {
            if(!(val.includes(prof))){
                profList.push(prof)
            }
        })
        this.setState({selectedProfs: val, profList: profList})
    }

    handleProfPrefPress = (e) => {
        const val = this.state.selectedProfs;
        if(e.key === 'Enter'){
            const newProfList = [];

            if(val != undefined){
                this.state.profList.map(prof => {
                    if(prof.id != val.id){
                        newProfList.push(prof)
                    }
                })
                this.setState({profList:newProfList})
                console.log(e.target)
            }
        }
    }

    handleSectionPrefChange = (e, val) =>{
        // const sectionList = this.state.sectionList
        // // this.state.selectedSections.map(section => {
        // //     // if(!(val.includes(section))){
        // //     //     sectionList.push(section)
        // //     // }
        // // })
        this.setState({selectedSections: val})
      }
    


    handleSectionPrefPress = (e) => {
        const val = this.state.selectedProfs;
        if(e.key === 'Enter'){
            const newProfList = [];

            if(val != undefined){
                this.state.profList.map(prof => {
                    if(prof.id != val.id){
                        newProfList.push(prof)
                    }
                })
                this.setState({profList:newProfList})
                console.log(e.target)
            }
        }
    }

    handleDateChange = (date) => {
        this.setState({selectedDate: date})
      };
    
    handleDayChange = (event) => {
        var newDayList = [...this.state.daysList];
        newDayList.map(value=>{
            if(value.id === Number(event.target.id)){
                value.checked = event.target.checked;
            }
        })
        this.setState({daysList: newDayList});
        // this.setState({[event.target.name]: event.target.checked });
    };

    handleBreakChange = (event) =>{
        this.setState({break_length: event.target.value})
    }
    handleBuildingChange = (event) => {
        var newBuildingList = [...this.state.buildingList];
        newBuildingList.map(value=>{
            if(value.id === Number(event.target.id)){
                value.checked = event.target.checked;
            }
        })
        this.setState({buildingList: newBuildingList});
        // this.setState({[event.target.name]: event.target.checked });
    };

    handleEarliestChange = (event) => {
        this.setState({earliest_class_time: event.target.value})
        console.log(this.state)
    }

    handleLatestChange = (event) => {
        this.setState({latest_class_time: event.target.value})
    }

    handleMinCourseChange = (event) => {
        this.setState({min_courses: event.target.value})
    }

    handleMaxCourseChange = (event) => {
        this.setState({max_courses: event.target.value})
    }

    handleSave = () => {
        this.setState({dataSaved: true})
        const id = localStorage.getItem('user_id');
        axios.delete('https://archerone-backend.herokuapp.com/api/preferencelist/'+id+'/')
        .then(res => {
            console.log(this.state.daysList)
            this.state.daysList.map(day =>{
                if(day.checked){
                    axios.post('https://archerone-backend.herokuapp.com/api/preferences/', {preferred_days: day.id, user: id},
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).catch(err => {
                        console.log(err.response)
                    })
                }
            });
            console.log(this.state.buildingList)
            this.state.buildingList.map(bldg =>{
                if(bldg.checked){
                    axios.post('https://archerone-backend.herokuapp.com/api/preferences/', {preferred_buildings: bldg.id, user: id},
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).catch(err => {
                        console.log(err.response)
                    })
                }
            });
            this.state.selectedProfs.map(prof =>{
                console.log(prof)
                axios.post('https://archerone-backend.herokuapp.com/api/preferences/', {preferred_faculty: prof.id, user: id},
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).catch(err => {
                    console.log(err.response)
                })
            });
            this.state.selectedSections.map(section =>{
                console.log(section)
                axios.post('https://archerone-backend.herokuapp.com/api/preferences/', {preferred_sections: section.id, user: id},
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).catch(err => {
                    console.log(err.response)
                })
            });
            const data = {
                earliest_class_time: this.state.earliest_class_time,
                latest_class_time: this.state.latest_class_time,
                break_length: this.state.break_length,
                min_courses: this.state.min_courses,
                max_courses: this.state.max_courses,
                user: id
            }
            axios.post('https://archerone-backend.herokuapp.com/api/preferences/', data,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                this.setState({dataSaved: false})
            }).catch(err => {
                console.log(err.response)
            })
        }).catch(err => {
            console.log(err.response)
        });

        this.setState({savedPrefBar: true});

    }

    handleCloseSaveBar = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({savedPrefBar: false});
    }
    
    render() {
        const { classes } = this.props;
        const facultyOptions = this.state.profList.map((option) => {
            const firstLetter = option.profName[0].toUpperCase();
            return {
              firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
              ...option,
            };
          });
        const sectionOptions = this.state.sectionList.map((option) => {
            const firstLetter = option.sectionName[0].toUpperCase();
            return {
              firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
              ...option,
            };
          });
      return (
        <div>
            {this.props.menu('preferences')}

            {/* <HelpIcon className={classes.iconStyle} onClick={() => this.handleOpenModalHelp()}/> */}

            <Modal isOpen={this.state.openModalHelp} toggle={this.toggleModal} returnFocusAfterClose={false} backdrop={true} data-keyboard="false">
                <ModalHeader toggle={this.toggleModal}><h4>Preferences</h4></ModalHeader>
                
                <ModalBody>
                    <p>Adding your preferences will help our system identify the schedules that best suit you among all possible schedules. Take note that this will not necessarily guarantee that all your preferences will be satisfied, as taking into account the courses you need is our upmost priority.</p>
                </ModalBody>
                
            </Modal>

            {/* <div class="prefIntro"> */}
                {/* <a href="/"> */}
                    {/* <HomeIcon className="homeIcon" fontSize="large" className={classes.homeButton}/> */}
                    {/* <svg class="bi bi-house" width="3em" height="3em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M9.646 3.146a.5.5 0 01.708 0l6 6a.5.5 0 01.146.354v7a.5.5 0 01-.5.5h-4.5a.5.5 0 01-.5-.5v-4H9v4a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5v-7a.5.5 0 01.146-.354l6-6zM4.5 9.707V16H8v-4a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v4h3.5V9.707l-5.5-5.5-5.5 5.5z" clip-rule="evenodd"></path>
                        <path fill-rule="evenodd" d="M15 4.5V8l-2-2V4.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5z" clip-rule="evenodd"></path>
                    </svg> */}
                {/* </a> */}

                <Snackbar open={this.state.savedPrefBar} autoHideDuration={4000} onClose={this.handleCloseSaveBar}>
                    <Alert onClose={this.handleCloseSaveBar} severity="success">
                    Your preferences have been successfully saved!
                    </Alert>
                </Snackbar>
            {/* </div> */}

            {/* <div class="prefIntro-main"> */}
                {this.state.dataReceived ? 
                // <div className="preference-category">
                <div className="preference-category">

                    {/* <Row xs="2"> */}
                        {/* <Col> */}
                        <div>
                        </div>
                            <div className="timePreferences">
                                <h2>Time Preferences
                                <IconButton aria-label="help" onClick={() => this.handleOpenModalHelp()}>
                                    <HelpIcon />
                                </IconButton>
                                </h2>
                                <div className="preference-category-content">
                                    {/* Earliest Time
                                    <br/> */}
                                    
                                    {/* <input value={this.state.earliest_class_time} type="time"/><br/><br/> */}
                                    {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>

                                    
                                        <KeyboardTimePicker
                                            margin="normal"
                                            id="time-picker"
                                            label="Earliest Time"
                                            value={this.selectedDate}
                                            onChange={this.handleDateChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change time',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider> */}
                                        
                                        {/* <KeyboardDateTimePicker
                                            value={this.selectedDate}
                                            onChange={this.handleDateChange}
                                            label="Earliest Time"
                                            // onError={console.log}
                                            // minDate={new Date("2020-01-01T00:00")}
                                            format="hh:mm a"
                                        /> */}
                                    
                                    <Row xs="2">
                                        <Col>
                                            <form className={"timeContainer"} noValidate>
                                                <TextField
                                                    id="time"
                                                    label="No Classes Before"
                                                    type="time"
                                                    value={this.state.earliest_class_time}
                                                    className={"earliestTimeField"}
                                                    onChange={this.handleEarliestChange}
                                                    InputLabelProps={{
                                                    shrink: true,
                                                    }}
                                                    inputProps={{
                                                    step: 900, // 5 min
                                                    }}
                                                    style={{width: 200}}
                                                />
                                            </form>
                                        </Col>

                                        <Col>
                                            {/* Latest Time
                                            <br/>
                                            <input value={this.state.latest_class_time} type="time"/><br/><br/> */}
                                            
                                            <form className={"timeContainer"} noValidate>
                                                <TextField
                                                    id="time"
                                                    label="No Classes After"
                                                    type="time"
                                                    value={this.state.latest_class_time}
                                                    className={"lastestTimeField"}
                                                    onChange={this.handleLatestChange}
                                                    InputLabelProps={{
                                                    shrink: true,
                                                    }}
                                                    inputProps={{
                                                    step: 300, // 5 min
                                                    }}
                                                    style={{width: 200}}
                                                />
                                            </form>
                                        </Col>
                                    </Row>

                                    <br/>
                                    <div className={'days-preference'}>
                                        <div className={'subheader'}>Preferred Days</div>
                                        <FormGroup row>
                                            <FormControlLabel
                                                control = {<GreenCheckbox checked={this.state.daysList[0].checked} onChange={this.handleDayChange} id={this.state.daysList[0].id} color="primary"/>}label="M" />
                                                <FormControlLabel
                                                control = {<GreenCheckbox checked={this.state.daysList[1].checked} onChange={this.handleDayChange} id={this.state.daysList[1].id} color="primary"/>}label="T" />
                                                <FormControlLabel
                                                control = {<GreenCheckbox checked={this.state.daysList[2].checked} onChange={this.handleDayChange} id={this.state.daysList[2].id} color="primary"/>}label="W" />
                                                <FormControlLabel
                                                control = {<GreenCheckbox checked={this.state.daysList[3].checked} onChange={this.handleDayChange} id={this.state.daysList[3].id} color="primary"/>}label="H" />
                                                <FormControlLabel
                                                control = {<GreenCheckbox checked={this.state.daysList[4].checked} onChange={this.handleDayChange} id={this.state.daysList[4].id} color="primary"/>}label="F" />
                                                <FormControlLabel
                                                control = {<GreenCheckbox checked={this.state.daysList[5].checked} onChange={this.handleDayChange} id={this.state.daysList[5].id} color="primary"/>}label="S" />
                                        </FormGroup>
                                    </div>
                                    <br/>

                                    {/* Break Length */}
                                    <div className={'break-preference'}>
                                        <TextField
                                            id="outlined-select-break"
                                            select
                                            label="Break Length"
                                            onChange={this.handleBreakChange}
                                            value = {this.state.break_length == null ? 15 : this.state.break_length}
                                            helperText="Please select your preferred break length"
                                            variant="outlined"
                                            autoWidth= {true}
                                            >
                                            
                                            {this.state.breakOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                {option.option}
                                                </MenuItem>
                                                    ))}
                                        </TextField>
                                    </div>
                                    
                                </div>
                            </div>

                            <div className="workloadPreferences">
                                <h2>Workload Preferences
                                <IconButton aria-label="help" onClick={() => this.handleOpenModalHelp()}>
                                    <HelpIcon />
                                </IconButton>
                                </h2>
                                
                                <div className="preference-category-content">
                                    {/* Minimum Courses per Day */}
                                    <br/>
                                    {/* <input type = "number" /><br/><br/> */}

                                    <Row xs="2">

                                        <Col>
                                            <TextField
                                                className={'workload-field'}
                                                id="min-courses"
                                                value={this.state.min_courses}
                                                label="Minimum Courses per Day"
                                                onChange={this.handleMinCourseChange}
                                                type="number"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                placeholder="0"
                                                size="medium"
                                                inputProps={{
                                                    min: 0,
                                                    max: 10,
                                                }}
                                            />
                                        </Col>

                                        <Col>
                                            {/* <input type = "number" value={this.state.max_courses}/><br/><br/> */}
                                            <TextField
                                                className={'workload-field'}
                                                id="max-courses"
                                                value={this.state.max_courses}
                                                label="Maximum Courses per Day"
                                                onChange={this.handleMaxCourseChange}
                                                type="number"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                placeholder="0"
                                                inputProps={{
                                                    min: 0,
                                                    max: 10,
                                                }}
                                            />
                                        </Col>

                                    </Row>

                                    {/* <br/> */}
                                    {/* Maximum Courses per Day */}
                                    {/* <br/> */}
                                    
                                </div>
                            </div>
                        {/* </Col> */}

                        {/* <Col>
                            
                        </Col> */}

                        {/* <Col> */}
                            <div className="classDetails">
                                <h2>Class Details
                                <IconButton aria-label="help" onClick={() => this.handleOpenModalHelp()}>
                                    <HelpIcon />
                                </IconButton>
                                </h2>
                                
                                <div className="preference-category-content">
                                    <div className="professor-preference">
                                        <div className={'subheader'}>Faculty Preferences</div>
                                        <Autocomplete
                                            multiple
                                            id="tags-outlined"
                                            options={facultyOptions.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                                            defaultValue={this.state.selectedProfs}
                                            groupBy={(option) => option.firstLetter}
                                            getOptionLabel={option => option.profName}
                                            //   style={{ width: 500 }}
                                            filterSelectedOptions
                                            renderInput={params => <TextField {...params} variant="outlined" />}
                                            // renderInput={params => <TextField {...params} label="Faculty Preferences" variant="outlined" />}
                                            onChange={this.handleProfPrefChange}
                                            // onKeyPress={this.handleProfPrefress}
                                            />
                                    </div>


                                
                                    <div className={'building-preference'}>
                                        <div className={'subheader'}>Building Preferences</div>
                                        <Grid container spacing={6}>
                                            <Grid item xs={6}>
                                            <FormGroup>
                                                <FormControlLabel
                                                control = {<GreenCheckbox checked={this.state.buildingList[0].checked} onChange={this.handleBuildingChange} id={this.state.buildingList[0].id}  color="primary"/>}label={this.state.buildingList[0].building} />
                                                <FormControlLabel
                                                control = {<GreenCheckbox checked={this.state.buildingList[1].checked} onChange={this.handleBuildingChange} id={this.state.buildingList[1].id} color="primary"/>}label={this.state.buildingList[1].building} />
                                                <FormControlLabel
                                                control = {<GreenCheckbox checked={this.state.buildingList[2].checked} onChange={this.handleBuildingChange} id={this.state.buildingList[2].id} color="primary"/>}label={this.state.buildingList[2].building}/>
                                                <FormControlLabel
                                                control = {<GreenCheckbox checked={this.state.buildingList[3].checked} onChange={this.handleBuildingChange} id={this.state.buildingList[3].id} color="primary"/>}label={this.state.buildingList[3].building} />
                                            </FormGroup>
                                            </Grid>

                                            <Grid item xs={6}>
                                            <FormGroup>
                                            <FormControlLabel
                                            control = {<GreenCheckbox checked={this.state.buildingList[4].checked} onChange={this.handleBuildingChange} id={this.state.buildingList[4].id} color="primary"/>}label={this.state.buildingList[4].building}/>
                                            <FormControlLabel
                                            control = {<GreenCheckbox checked={this.state.buildingList[5].checked} onChange={this.handleBuildingChange} id={this.state.buildingList[5].id} color="primary"/>}label={this.state.buildingList[5].building} />
                                                <FormControlLabel
                                            control = {<GreenCheckbox checked={this.state.buildingList[6].checked} onChange={this.handleBuildingChange} id={this.state.buildingList[6].id} color="primary"/>}label={this.state.buildingList[6].building}/>
                                            <FormControlLabel
                                            control = {<GreenCheckbox checked={this.state.buildingList[7].checked} onChange={this.handleBuildingChange} id={this.state.buildingList[7].id} color="primary"/>}label={this.state.buildingList[7].building} />
                                            </FormGroup>
                                            </Grid>
                                        </Grid>
                                    </div>
                                
                                    {/* <FormGroup>
                                        <FormControlLabel
                                        control = {<Checkbox checked={this.state.buildingList[0].checked} onChange={this.handleBuildingChange} id = '1' color="primary"/>}label={this.state.buildingList[0].building} />
                                        <FormControlLabel
                                        control = {<Checkbox checked={this.state.buildingList[1].checked} onChange={this.handleBuildingChange} id = '2' color="primary"/>}label={this.state.buildingList[1].building} />
                                        <FormControlLabel
                                        control = {<Checkbox checked={this.state.buildingList[2].checked} onChange={this.handleBuildingChange} id = '3' color="primary"/>}label={this.state.buildingList[2].building}/>
                                        <FormControlLabel
                                        control = {<Checkbox checked={this.state.buildingList[3].checked} onChange={this.handleBuildingChange} id = '4' color="primary"/>}label={this.state.buildingList[3].building} />
                                        <FormControlLabel
                                        control = {<Checkbox checked={this.state.buildingList[4].checked} onChange={this.handleBuildingChange} id = '5' color="primary"/>}label={this.state.buildingList[4].building}/>
                                        <FormControlLabel
                                        control = {<Checkbox checked={this.state.buildingList[5].checked} onChange={this.handleBuildingChange} id = '6' color="primary"/>}label={this.state.buildingList[5].building} />
                                            <FormControlLabel
                                        control = {<Checkbox checked={this.state.buildingList[6].checked} onChange={this.handleBuildingChange} id = '7' color="primary"/>}label={this.state.buildingList[6].building}/>
                                        <FormControlLabel
                                        control = {<Checkbox checked={this.state.buildingList[7].checked} onChange={this.handleBuildingChange} id = '8' color="primary"/>}label={this.state.buildingList[7].building} />
                                                
                                    </FormGroup> */}
                                        
                                    {/* <input className="checkbox-description" type="checkbox" id="" name="" value=""/>
                                    <label className="checkbox-description" for=""> St. La Salle Hall </label><br/>

                                    <input className="checkbox-description" type="checkbox" id="" name="" value=""/>
                                    <label className="checkbox-description" for=""> Enrique Yuchengco Hall </label><br/>

                                    <input className="checkbox-description" type="checkbox" id="" name="" value=""/>
                                    <label className="checkbox-description" for=""> St. Joseph Hall </label><br/>

                                    <input className="checkbox-description" type="checkbox" id="" name="" value=""/>
                                    <label className="checkbox-description" for=""> Velasco Hall </label><br/>

                                    <input className="checkbox-description" type="checkbox" id="" name="" value=""/>
                                    <label className="checkbox-description" for=""> St. Miguel Hall </label><br/>

                                    <input className="checkbox-description" type="checkbox" id="" name="" value=""/>
                                    <label className="checkbox-description" for=""> St. Mutien Marie Hall </label><br/>

                                    <input className="checkbox-description" type="checkbox" id="" name="" value=""/>
                                    <label className="checkbox-description" for=""> Gokongwei Hall </label><br/>

                                    <input className="checkbox-description" type="checkbox" id="" name="" value=""/>
                                    <label className="checkbox-description" for=""> Br. Andrew Gonzales Hall </label><br/><br/> */}

                                    <div className="section-preference">
                                        <div className={'subheader'}>Section Preferences</div>
                                          <Autocomplete
                                            multiple
                                            id="tags-outlined"
                                            options={this.state.sectionList}
                                            options={sectionOptions.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                                            defaultValue={this.state.selectedSections}
                                            groupBy={(option) => option.firstLetter}
                                            getOptionLabel={option => option.sectionName}
                                            //   style={{ width: 500 }}
                                            filterSelectedOptions
                                            renderInput={params => <TextField {...params} variant="outlined" />}
                                            // renderInput={params => <TextField {...params} label="Section Preferences" variant="outlined" />}
                                            onChange={this.handleSectionPrefChange}
                                            // onKeyPress={this.handleSectionPrefress}
                                          />
                                    </div>
                                </div>
                            </div>
                        {/* </Col> */}

                    {/* </Row> */}

                </div>
                : 
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "90vh"}}>
                    <ReactLoading type={'spin'} color={'#9BCFB8'} height={'5%'} width={'5%'}/>
                </div> }
            {/* </div> */}

            {this.state.dataSaved ?
                
                // <center><button onClick={this.handleSave} class="savePrefBtn" disabled>Save Preferences</button></center>
                <center><Button
                    variant="contained"
                    className={classes.buttonStyle}
                    onClick={this.handleSave}
                    disabled>
                    Save Preferences
                </Button></center>
                :
                // <center><button onClick={this.handleSave} class="savePrefBtn">Save Preferences</button></center>
                <center><Button
                    variant="contained"
                    className={classes.buttonStyle}
                    onClick={this.handleSave}
                    >
                    Save Preferences
                </Button></center>
            }

        </div>        
      );
    }
  }

  Preferences.propTypes={
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(Preferences);