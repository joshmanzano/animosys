import React, { Component } from "react";
import { Column, Row } from 'simple-flexbox';
import Menu from '../components/Menu.jsx';
import '../css/SearchCourses.css';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';

import ComboBox from '../components/ComboBox.jsx';
import axios from 'axios';

import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import groupArray from 'group-array';

import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import ReactLoading from 'react-loading';
import Skeleton from '@material-ui/lab/Skeleton';

import searchIMG from '../assets/search_engine.png';

import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Switch from '@material-ui/core/Switch';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    
  },
  wrapper: {
    // margin: theme.spacing(1),
    position: 'relative',
    

  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
    paddingTop: '5px',
    paddingBottom: '5px',
  },
});

const GreenRadio = withStyles({
  root: {
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const GreenSwitch = withStyles({
  switchBase: {
    // color: green[600],
    '&$checked': {
      color: green[600],
    },
    '&$checked + $track': {
      backgroundColor: green[600],
    },
  },
  checked: {},
  track: {},
})(Switch);

class SearchCourses extends Component {
    constructor(props){
      super(props);
      this.state = {
        fields: {},
        database: [],
        siteData: [],
        allSiteData: [],
        selectedCourses: [],
        loading: false,
        radioVal: 'all',
        dataReceived: false,
        skeletons: [...Array(8).keys()],
        rowStyle: "",
        openModalCourseInfo: false,
        showPlaceholder: true,
        applyPreference: false
      }
      this.radioRef = React.createRef()
    }

    componentDidMount(){
        // axios.get('https://archerone-backend.herokuapp.com/api/courses/')
        // .then(res => {
        //     res.data.map(course => {
        //         var courses = this.state.courseList;
        //         courses.push({'id':course.id, 'course_code':course.course_code})
        //         this.setState({courseList: courses, dataReceived: true})
        //     })
        // })
        this.setState({dataReceived: true})
    }

    createData(classNmbr, course, section, faculty, day, startTime, endTime, room, capacity, enrolled) {
      return { classNmbr, course, section, faculty, day, startTime, endTime, room, capacity, enrolled };
    }

    handleChange = (field, e) => {
      let fields = this.state.fields;
      fields[field] = e.target.value;
      this.setState({fields});
    }

    setFilter = () => {
      let option = this.state.radioVal;
      let filteredList = [];

      if(option == "all"){
        console.log("all");
        filteredList = this.state.allSiteData;

        this.setState({siteData: filteredList});

        console.log(filteredList);
      }
      else if(option == "open"){
        console.log("open");

        var i;
        for(i = 0; i < this.state.allSiteData.length; i++) {
          if(this.state.allSiteData[i].enrolled < this.state.allSiteData[i].capacity){
            // console.log(this.state.database[i]);
            filteredList.push(this.state.allSiteData[i]);
          }
        }

        this.setState({siteData: filteredList});

        console.log(filteredList);
      }
      else{
        console.log("closed");

        var i;
        for(i = 0; i < this.state.allSiteData.length; i++) {
          if(this.state.allSiteData[i].enrolled >= this.state.allSiteData[i].capacity){
            // console.log(this.state.database[i]);
            filteredList.push(this.state.allSiteData[i]);
          }
        }

        this.setState({siteData: filteredList});

        console.log(filteredList);
      }
    }

    handleFilter = (field, e) => {
      this.setState({radioVal: e.target.value}, () => {
        this.setFilter()
      })
    }

    searchCourses = () =>{
      //start loading

      if(this.state.selectedCourses.length > 0){
        this.setState({siteData: []})
        this.setState({showPlaceholder: false},()=>{
          this.setState({loading: true});
        });
      }

      const selectedCourses = []
      this.state.selectedCourses.map(course => {
        selectedCourses.push(course.id)
      })
     
      axios.post('https://archerone-backend.herokuapp.com/api/courseofferingslist/',{
        courses: selectedCourses,
        applyPreference: this.state.applyPreference,
        user_id: localStorage.getItem('user_id')
      })
      .then(res => {
          const newSiteData = [];
          console.log(res.data)
          res.data.map(bundle => {
            var arranged = groupArray(bundle, 'classnumber');
            console.log(arranged)
            for (let key in arranged) {
              console.log(key, arranged[key]);
              var days = []
              var day = ''
              var classnumber = ''
              var course = ''
              var section = ''
              var faculty = ''
              var timeslot_begin = ''
              var timeslot_end = ''
              var room = ''
              var max_enrolled = ''
              var current_enrolled = ''
              arranged[key].map(offering => {
                days.push(offering.day)
                classnumber = offering.classnumber
                course = offering.course
                section = offering.section
                faculty = offering.faculty
                timeslot_begin = offering.timeslot_begin
                timeslot_end = offering.timeslot_end
                room = offering.room
                max_enrolled = offering.max_enrolled
                current_enrolled = offering.current_enrolled
              })
              days.map(day_code => {
                day += day_code;
              })
              const offering = this.createData(classnumber, course, section, faculty, day, timeslot_begin, timeslot_end, room, max_enrolled, current_enrolled);
              newSiteData.push(offering);
            }
          })
        this.setState({siteData: newSiteData, allSiteData: newSiteData},() => {
          this.setFilter()
          this.setState({loading: false});
        })
        //Finish Loading
      }).catch(err => {
        console.log(err.response)
      })
    }

    handleSearch = (e, val) =>{
      this.setState({selectedCourses: val})
    }

    handleClick = (id, column) => {
      return (event) => {
        console.log(`You clicked on row with id ${id}, in column ${column}.`);
      }
    }

    handleCloseModalCourseInfo = ()=>{
      this.setState({openModalCourseInfo: false})
    }
  
    handleOpenModalCourseInfo = (courseCode, courseName, courseUnits)=>{
      courseName = "Lorem ipsum"
      var courseDesc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      var coursePre = "N/A"
      var courseCo = "N/A"
      var courseEq = "N/A"
      this.setState({courseCode, courseName, courseUnits})
      this.setState({courseDesc, coursePre, courseCo, courseEq})
      this.setState({openModalCourseInfo: true})
    }

    handleApplyPreference = () => {
      this.setState({applyPreference: !this.state.applyPreference})
    }
  
    toggleModal = () => {
      var openModalVar = this.state.openModalCourseInfo;
      this.setState({openModalCourseInfo: !openModalVar});
    }

    render() {
      const { classes } = this.props;

      const StyledTableCell = withStyles(theme => ({
        head: {
          backgroundColor: '#006A4E',
          color: theme.palette.common.white,
        },
        body: {
          fontSize: 14,
          borderBottom: "1px solid white",
        },
      }))(TableCell);
      
      const StyledTableRow = withStyles(theme => ({
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
          },
        },
      }))(TableRow);

      return (
          <div>
            {this.props.menu('search_courses')}

            {this.state.dataReceived ? 
            <div className="search-container">

                <div className="searchBar">
                  <h2>Search Course Offerings</h2>
                    <div style={{display: "flex", justifyContent: "center"}}>
                      <ComboBox style={{width: "-webkit-fill-available"}} page="search_simple" onChange={this.handleSearch}/>
                      <div className={classes.root}>
                          <div className={classes.wrapper} >
                            <Button
                                  variant="contained"
                                  color = "Primary"
                                  disabled={this.state.loading}
                                  style={{backgroundColor: "green", color:"white", height:"55px"}}
                                  onClick={this.searchCourses}>
                                  <SearchIcon/>  
                            </Button>
                            {this.state.loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
                          </div>
                      </div>
                      
                    </div>
                    
                  
                </div>

                <div className="viewCourses" style={!this.state.showPlaceholder ? {} : {display: "none"}}>
                  <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell> Class Number </StyledTableCell>
                          <StyledTableCell> Course </StyledTableCell>
                          <StyledTableCell> Section </StyledTableCell>
                          <StyledTableCell> Faculty </StyledTableCell>
                          <StyledTableCell> Day </StyledTableCell>
                          <StyledTableCell> Time </StyledTableCell>
                          <StyledTableCell> Room </StyledTableCell>
                          <StyledTableCell> Capacity </StyledTableCell>
                          <StyledTableCell> Enrolled </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      {this.state.loading ? 
                      <TableBody>
                          {this.state.skeletons.map(skeleton =>(
                            <StyledTableRow>
                              <StyledTableCell> <Skeleton width={'100%'} height={'100%'}></Skeleton> </StyledTableCell>
                              <StyledTableCell> <Skeleton width={'100%'} height={'100%'}></Skeleton> </StyledTableCell>
                              <StyledTableCell> <Skeleton width={'100%'} height={'100%'}></Skeleton> </StyledTableCell>
                              <StyledTableCell> <Skeleton width={'100%'} height={'100%'}></Skeleton> </StyledTableCell>
                              <StyledTableCell> <Skeleton width={'100%'} height={'100%'}></Skeleton> </StyledTableCell>
                              <StyledTableCell> <Skeleton width={'100%'} height={'100%'}></Skeleton> </StyledTableCell>
                              <StyledTableCell> <Skeleton width={'100%'} height={'100%'}></Skeleton> </StyledTableCell>
                              <StyledTableCell> <Skeleton width={'100%'} height={'100%'}></Skeleton> </StyledTableCell>
                              <StyledTableCell> <Skeleton width={'100%'} height={'100%'}></Skeleton> </StyledTableCell>
                            </StyledTableRow>
                          ))}
                      </TableBody>
                      : 
                      <TableBody>
                        {this.state.siteData.map(row => (
                          <StyledTableRow key={row.classNmbr} style={(row.capacity == row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}>
                            <StyledTableCell style={(row.capacity == row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {row.classNmbr} </StyledTableCell>
                            <Tooltip title="More Details" placement="left"><StyledTableCell onClick={() => this.handleOpenModalCourseInfo(row.course, "", "3")} style={(row.capacity == row.enrolled) ? {color: "#0099CC", cursor: "pointer", textDecorationLine: 'underline'} : {color: "#006600", cursor: "pointer", textDecorationLine: 'underline'}} > {row.course} </StyledTableCell></Tooltip>
                            <StyledTableCell style={(row.capacity == row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {row.section} </StyledTableCell>
                            <StyledTableCell style={(row.capacity == row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {row.faculty} </StyledTableCell>
                            <StyledTableCell style={(row.capacity == row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {row.day} </StyledTableCell>
                            <StyledTableCell style={(row.capacity == row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {row.startTime} - {row.endTime} </StyledTableCell>
                            <StyledTableCell style={(row.capacity == row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {row.room} </StyledTableCell>
                            <StyledTableCell align="right" style={(row.capacity == row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {row.capacity} </StyledTableCell>
                            <StyledTableCell align="right" style={(row.capacity == row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {row.enrolled} </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                      }
                    </Table>
                  </TableContainer>

                  <Modal isOpen={this.state.openModalCourseInfo} toggle={this.toggleModal} returnFocusAfterClose={false} backdrop="static" data-keyboard="false">
                      <ModalHeader toggle={this.toggleModal}>Course Information</ModalHeader>
                      
                      <ModalBody>
                        <h4>{this.state.courseCode}</h4>
                        <h5>{this.state.courseName}</h5>
                        <br/>

                        <u><h5>Description</h5></u>
                        <p>{this.state.courseDesc}</p>
                        <br/>

                        <u><h5>Pre-requisite/s</h5></u>
                        <p>{this.state.coursePre}</p>
                        <br/>

                        <u><h5>Co-requisite/s</h5></u>
                        <p>{this.state.courseCo}</p>
                        <br/>

                        <u><h5>Course Equivalent</h5></u>
                        <p>{this.state.courseEq}</p>
                        <br/>

                        <u><h5>Number of Units</h5></u>
                        <p>{this.state.courseUnits}</p>
                      </ModalBody>
                      
                  </Modal> 
                </div>
                
                
                <div className={"noContent"} style={this.state.showPlaceholder ? {} : {display: "none"}}>
                    <center><img style={{width:"30%"}} src={searchIMG}/></center>
                </div>
            </div>
                     
            : 
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh"}}>
              <ReactLoading type={'spin'} color={'#9BCFB8'} height={'5%'} width={'5%'}/>
            </div> }
        </div>        
      );
    }
  }

  SearchCourses.propTypes={
    classes: PropTypes.object.isRequired,
  };
    export default withStyles(styles)(SearchCourses);