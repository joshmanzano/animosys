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
    // '&label': {
    //   color: green[600],
    // }
  },
  checked: {},
  // label: {},
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
        applyPreference: false,
        noResults: false,
        testGroupedData: [],
        courseInfo: {}
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
        var selectedCourses = JSON.parse(localStorage.getItem('selectedCourses'))
        // console.log(selectedCourses)
        if(selectedCourses != null){
          this.setState({selectedCourses})
        }
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
        // console.log("all");
        filteredList = this.state.allSiteData;

        // start of grouping
        const togroupdata = filteredList;

        const groupedSiteData = togroupdata.reduce((coursesSoFar, { classNmbr, course, section, faculty, day, startTime, endTime, room, capacity, enrolled }) => {
          if(!coursesSoFar[course])
            coursesSoFar[course] = [];
          
          coursesSoFar[course].push({ classNmbr, course, section, faculty, day, startTime, endTime, room, capacity, enrolled });

          return coursesSoFar;
        }, {});


        // const newGroupTest = [];
        // for(var i=0; i < this.state.selectedCourses.length; i++){

        //   newGroupTest.push([]);

        //   for(var j=0; j < 3; j++){
        //     newGroupTest[i].push(j);
        //   }
        // }

        // end of grouping

        this.setState({siteData: filteredList, testGroupedData: groupedSiteData},() => {
        });

        // console.log(filteredList);
      }
      else if(option == "open"){
        // console.log("open");

        var i;
        for(i = 0; i < this.state.allSiteData.length; i++) {
          if(this.state.allSiteData[i].enrolled < this.state.allSiteData[i].capacity){
            // console.log(this.state.database[i]);
            filteredList.push(this.state.allSiteData[i]);
          }
        }

        // start of grouping
        const togroupdata = filteredList;

        const groupedSiteData = togroupdata.reduce((coursesSoFar, { classNmbr, course, section, faculty, day, startTime, endTime, room, capacity, enrolled }) => {
          if(!coursesSoFar[course])
            coursesSoFar[course] = [];
          
          coursesSoFar[course].push({ classNmbr, course, section, faculty, day, startTime, endTime, room, capacity, enrolled });

          return coursesSoFar;
        }, {});

        console.log("GROUPED IN OPEN");
        console.log(groupedSiteData);
        // end of grouping


        this.setState({siteData: filteredList, testGroupedData: groupedSiteData});

        // console.log(filteredList);
      }
      else{
        // console.log("closed");

        var i;
        for(i = 0; i < this.state.allSiteData.length; i++) {
          if(this.state.allSiteData[i].enrolled >= this.state.allSiteData[i].capacity){
            // console.log(this.state.database[i]);
            filteredList.push(this.state.allSiteData[i]);
          }
        }

        // console.log(filteredList);

        // start of grouping
        const togroupdata = filteredList;

        const groupedSiteData = togroupdata.reduce((coursesSoFar, { classNmbr, course, section, faculty, day, startTime, endTime, room, capacity, enrolled }) => {
          if(!coursesSoFar[course])
            coursesSoFar[course] = [];
          
          coursesSoFar[course].push({ classNmbr, course, section, faculty, day, startTime, endTime, room, capacity, enrolled });

          return coursesSoFar;
        }, {});

        console.log("GROUPED IN CLOSED");
        console.log(groupedSiteData);
        // end of grouping

        this.setState({siteData: filteredList, testGroupedData: groupedSiteData});
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
        const courseInfo = this.state.courseInfo
        axios.get('https://archerone-backend.herokuapp.com/api/courseinfo/'+course.id).then(res => {
          courseInfo[course.course_code] = res.data
          this.setState({courseInfo})
        })
      })

      axios.post('https://archerone-backend.herokuapp.com/api/courseofferingslist/',{
        courses: selectedCourses,
        applyPreference: this.state.applyPreference,
        user_id: localStorage.getItem('user_id')
      })
      .then(res => {
          const newSiteData = [];
          // console.log(res.data)
          res.data.map(bundle => {
            var arranged = groupArray(bundle, 'classnumber');
            // console.log(arranged)
            for (let key in arranged) {
              // console.log(key, arranged[key]);
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
                timeslot_begin = offering.timeslot_begin.substring(0, offering.timeslot_begin.length - 3)
                timeslot_end = offering.timeslot_end.substring(0, offering.timeslot_end.length - 3)
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
          console.log(this.state.siteData);
          this.setFilter();
          this.setState({loading: false});
        })

        //Finish Loading
      }).catch(err => {
        console.log(err.response)
      })
    }

    handleSearch = (e, val) =>{
      this.setState({selectedCourses: val}, () => {
        localStorage.setItem('selectedCourses', JSON.stringify(val))
      })
    }
    
    handleSearchPress = (e) => {
        const val = this.state.currentCourse;
        if(e.key === 'Enter'){
          this.searchCourses()
        }
    }

    // handleKeyPress = () => {
      // if(target.charCode==13) {
        // console.log("Test?")
      // }  
    // }

    handleClick = (id, column) => {
      return (event) => {
        console.log(`You clicked on row with id ${id}, in column ${column}.`);
      }
    }

    handleCloseModalCourseInfo = ()=>{
      this.setState({openModalCourseInfo: false})
    }
  
    handleOpenModalCourseInfo = (courseCode, courseName, courseUnits)=>{
      this.setState({courseCode, courseName, courseUnits}, () => {
        console.log(this.state.courseInfo[this.state.courseCode]['course_code'])
      })
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
          "&:hover": {
            backgroundColor: "#efefef"
          },
        },
      }))(TableRow);
      
      const loadedData = (index) => {
        // console.log(this.state.testGroupedData[index])
        // console.log(typeof(this.state.testGroupedData[index]))
        // console.log(index)
        // console.log(this.state.testGroupedData[index])
        // console.log(this.state.testGroupedData[index][0])
          if(this.state.siteData.length > 0 && this.state.testGroupedData[index] != undefined){
            // console.log(this.state.testGroupedData[index])
        // console.log(this.state.testGroupedData[index][0])
            return(
            <TableBody>
              {this.state.testGroupedData[index].map(row => (
                <Tooltip title="More Details" placement="bottom">
                  <StyledTableRow key={row.classNmbr} onClick={() => this.handleOpenModalCourseInfo(row.course, "", "3")} style={{cursor: "pointer"}}>
                    <StyledTableCell style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {row.classNmbr} </StyledTableCell>
                    <StyledTableCell style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {row.course} </StyledTableCell>
                    <StyledTableCell style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {row.section} </StyledTableCell>
                    <StyledTableCell style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {row.faculty} </StyledTableCell>
                    <StyledTableCell style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {row.day} </StyledTableCell>
                    <StyledTableCell style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {row.startTime} - {row.endTime} </StyledTableCell>
                    <StyledTableCell style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {row.room} </StyledTableCell>
                    <StyledTableCell align="right" style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {row.capacity} </StyledTableCell>
                    <StyledTableCell align="right" style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {row.enrolled} </StyledTableCell>
                  </StyledTableRow>
                </Tooltip>
              ))}
            </TableBody>
            )
          }else{
            return(
            <TableBody>
              <StyledTableRow>
                <StyledTableCell colSpan={9}>
                  <center><p>
                    No available course offerings.
                  </p></center>
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
            )
        }

      };

      return (
          <div>
            {this.props.menu('search_courses')}

            {this.state.dataReceived ? 
            <div className="search-container">

                <div className="searchBar">
                  <h2>Search all your courses in one go!</h2>
                    <div style={{display: "flex", justifyContent: "center"}}>
                    {/* <ComboBox style={{width: "-webkit-fill-available"}} page="search" onChange={this.handleSearch}/> */}
                      <div className="barArea"><ComboBox style={{width: "-webkit-fill-available"}} page="search" onChange={this.handleSearch} onKeyPress={this.handleSearchPress} defaultValue={this.state.selectedCourses}/></div>
                      <div className={classes.root}>
                          <div className={classes.wrapper} >
                            <Button
                                  variant="contained"
                                  color="Primary"
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

                <div className="filters">
                    <center>
                      {/* <span className="filterLabel">Filters:</span> */}
                  <FormControl component="fieldset">
                    <RadioGroup ref={this.radioRef} row aria-label="filter" name="filter" onChange={this.handleFilter.bind(this, "filter")} value={this.state.radioVal}>
                      <FormControlLabel value="all" control={<GreenRadio />} label="All Sections" />
                      <FormControlLabel value="open" control={<GreenRadio />} label="Open Sections" />
                      <FormControlLabel value="closed" control={<GreenRadio />} label="Closed Sections" />
                    </RadioGroup>
                  </FormControl>
                    </center>
                </div>
                <div>
                    <center>
                      {/* <span className="filterLabel">Filters:</span> */}
                  <FormControl component="fieldset">
                    <FormControlLabel value="closed" control={
                      <GreenSwitch
                      checked={this.state.applyPreference}
                      onChange={this.handleApplyPreference}
                      color="primary"
                      name="checkedB"
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                      />
                    } label="Apply Preferences" />
                  </FormControl>
                    </center>
                </div>
                <div className="legend">
                    <div className="legendItems">
                        <center>
                            <div>Open Sections - <Paper style={{backgroundColor:"#006600", height: "15px", width: "15px", display: "inline-flex"}}> </Paper> Green</div> 
                       </center>
                    </div>
                  
                    <div className="legendItems">
                        <center>
                            <div>Closed Sections - <Paper style={{backgroundColor:  "#0099CC", height: "15px", width: "15px", display: "inline-flex"}}> </Paper> Blue</div>
                        </center>
                    </div>
                </div>
                
                {/* start of table */}
                <div className="viewCourses" style={!this.state.showPlaceholder ? {} : {display: "none"}}>
                  <TableContainer>

                    {this.state.selectedCourses.map(index => (
                      <Table aria-label="customized table" style={{marginBottom: 25}} component={Paper}>
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
                        loadedData(index.course_code)
                        }
                      </Table>
                    ))}

                    {/* <Table aria-label="customized table">
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
                        loadedData()
                        }
                      </Table> */}
                    </TableContainer>

                    {this.state.openModalCourseInfo ?
                    <Modal isOpen={this.state.openModalCourseInfo} toggle={this.toggleModal} returnFocusAfterClose={false} backdrop={true} data-keyboard="false">
                        <ModalHeader toggle={this.toggleModal}><h4>Course Information</h4></ModalHeader>
                        
                        <ModalBody>
                          <h4>{this.state.courseInfo[this.state.courseCode]['course_code']}</h4>
                          <h5>{this.state.courseInfo[this.state.courseCode]['course_name']}</h5>
                          <br/>

                          <u><h5>Description</h5></u>
                          <p>{this.state.courseInfo[this.state.courseCode]['course_desc']}</p>
                          <br/>

                          <u><h5>Pre-requisite/s</h5></u>
                          <p>{this.state.courseInfo[this.state.courseCode]['prerequisite_to'].toString()}</p>
                          <p>{this.state.courseInfo[this.state.courseCode]['soft_prerequisite_to'].toString()}</p>
                          <br/>

                          <u><h5>Co-requisite/s</h5></u>
                          <p>{this.state.courseInfo[this.state.courseCode]['co_requisite'].toString()}</p>
                          <br/>

                          {/* <u><h5>Course Equivalent</h5></u>
                          <p>{this.state.courseEq}</p>
                          <br/> */}

                          <u><h5>Number of Units</h5></u>
                          <p>{this.state.courseInfo[this.state.courseCode]['units']}</p>
                        </ModalBody>
                        
                    </Modal> 
                    : null}
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