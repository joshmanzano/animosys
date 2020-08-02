import React, {Component} from 'react';
import {Column, Row} from 'simple-flexbox';
import {Input} from 'reactstrap';
import Menu from '../components/Menu.jsx';
import CourseDnD from '../components/CourseDnD';
import '../css/GenerateSchedule.css';
import GenSchedInfo from '../components/GenSchedInfo';
import axios from 'axios';
import ReactDOM from "react-dom";
import { Pagination, PaginationItem, PaginationLink} from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import PropTypes from 'prop-types';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import ReactLoading from 'react-loading';
import ComboBox from '../components/ComboBox.jsx';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';

import groupArray from 'group-array'

import { Steps, Hints } from 'intro.js-react';
import 'intro.js/introjs.css';
import '../css/introjs-modern.css';

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
    //   color: green[500],
      position: 'absolute',
      top: '65%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
    buttonProgressSave: {
        //   color: green[500],
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: -12,
          marginLeft: -12,
        },
    schedButton:{
        textTransform: "none",
        borderRadius: "25px",
        padding: "10px",
        paddingLeft: "30px",
        paddingRight: "30px",
        backgroundColor: "#16775D",
        border: "none",
        color: "white",
        boxShadow: "6px 5px #e8f4ea",
        borderStyle: "solid",
        borderColor: "#16775D",
        marginTop: "20px",
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
     
     const WhiteCheckbox = withStyles({
    root: {
        color: "white",
      '&$checked': {
        color: "white",
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

class GenerateSchedule extends Component {

    constructor(props) {
        super(props);
        this.updateHighPriority = this.updateHighPriority.bind(this);
        this.updateLowPriority = this.updateLowPriority.bind(this);
        // this.handleKeyPress = this.handleKeyPress.bind(this);
        this.generatedRef = React.createRef();
        this.handleScrollToGen = this.handleScrollToGen.bind(this);
        this.handleSaveChange = this.handleSaveChange.bind(this);
      
        // this.updateSchedTitle = this.updateSchedTitle.bind(this);
        this.state = {
            highPriorityId: "1",
            lowPriorityId: "2",
            value: "",
            highCourses: [],
            lowCourses: [],
            courseList: [],
            currentPage: 0,
            currentContent: "",
            currentCourse: "",
            generatedContents: [],
            // generatedContents : ['Hello', 'There', 'Josh'],
            // currentContent: ['Hello'],
            pagesCount: 1,
            searchedCourse: "",
            hideGenContent:true,
            savedScheds: [],
            saveButtonLabel: "Save Schedule",
            saveButtonStyle: {margin: "30px"},
            AutoCompleteValue: [],
            schedules: [],
            dataReceived: false,

            snackBar: false,
            loading: false,
            success: false,
            courseAdded: true,
            filterFull: true,

            courseOfferings: [],
            
            openModalCourseOfferings: false,
            modalCourseName: "",
            siteData: [],
            siteDataArray: [],
            allCheckBox: true,
     
            skeletons: [...Array(8).keys()],

            openModalWait: false,
        };

        if(localStorage.getItem('hints') == null){
            localStorage.setItem('hints',true)
        }

    }

    getLowCourseOfferings(id, val, newCourses, _callback){
        if(val.course_code.trim() != ''){
            const offeringList = [];
            const courses = [];
            axios.get('https://archerone-backend.herokuapp.com/api/searchcourse/'+val.course_code.trim()+'/')
            .then(res => {
                res.data.map(course => {
                    courses.push(course.id)
                })
                console.log(courses)
                axios.post('https://archerone-backend.herokuapp.com/api/courseofferingslist/',{
                    courses,
                    applyPreference: false,
                    user_id: localStorage.getItem('user_id')
                }).then(res => {
                    res.data.map(bundle => {
                        var arranged = groupArray(bundle, 'classnumber');
                        for (let key in arranged) {
                        var days = []
                        var day = ''
                        var classnumber = ''
                        var course = ''
                        var course_id = ''
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
                            course_id = offering.course_id
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
                        var checked = localStorage.getItem(classnumber)
                        if(checked == null){
                            checked = true;
                            localStorage.setItem(classnumber, true);
                        }else if(checked == 'true'){
                            checked = true;
                        }else if(checked == 'false'){
                            checked = false;
                        }
                        console.log(checked)
                        const offering = this.createData(classnumber, course, section, faculty, day, timeslot_begin, timeslot_end, room, max_enrolled, current_enrolled, checked);
                        offeringList.push(offering);
                        }
                    })
                    newCourses.push({'id':id, 'course_id':val.id, 'data':val.course_code, 'siteData': offeringList})
                    console.log(newCourses)
                    this.setState({lowCourses: newCourses}, () => {
                        _callback()
                    })
                })
            })
        }else{
            newCourses.push({'id':id, 'course_id':val.id, 'data':val.course_code, 'siteData': []})
            this.setState({lowCourses: newCourses}, () => {
                _callback()
            })
        }
    }

    getCourseOfferings(id, val, newCourses, _callback){
        if(val.course_code.trim() != ''){
            const offeringList = [];
            const courses = [];
            axios.get('https://archerone-backend.herokuapp.com/api/searchcourse/'+val.course_code.trim()+'/')
            .then(res => {
                res.data.map(course => {
                    courses.push(course.id)
                })
                console.log(courses)
                axios.post('https://archerone-backend.herokuapp.com/api/courseofferingslist/',{
                    courses,
                    applyPreference: false,
                    user_id: localStorage.getItem('user_id')
                }).then(res => {
                    res.data.map(bundle => {
                        var arranged = groupArray(bundle, 'classnumber');
                        for (let key in arranged) {
                        var days = []
                        var day = ''
                        var classnumber = ''
                        var course = ''
                        var course_id = ''
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
                            course_id = offering.course_id
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
                        var checked = localStorage.getItem(classnumber)
                        if(checked == null){
                            checked = true;
                            localStorage.setItem(classnumber, true);
                        }else if(checked == 'true'){
                            checked = true;
                        }else if(checked == 'false'){
                            checked = false;
                        }
                        console.log(checked)
                        const offering = this.createData(classnumber, course, section, faculty, day, timeslot_begin, timeslot_end, room, max_enrolled, current_enrolled, checked);
                        offeringList.push(offering);
                        }
                    })
                    newCourses.push({'id':id, 'course_id':val.id, 'data':val.course_code, 'siteData': offeringList})
                    console.log(newCourses)
                    this.setState({highCourses: newCourses}, () => {
                        _callback()
                    })
                })
            })
        }else{
            newCourses.push({'id':id, 'course_id':val.id, 'data':val.course_code, 'siteData': []})
            this.setState({highCourses: newCourses}, () => {
                _callback()
            })
        }
    }

    getSingleCourseOfferings(id, val, _callback){
        if(val.course_code.trim() != ''){
            const offeringList = [];
            const courses = [];
            axios.get('https://archerone-backend.herokuapp.com/api/searchcourse/'+val.course_code.trim()+'/')
            .then(res => {
                res.data.map(course => {
                    courses.push(course.id)
                })
                console.log(courses)
                axios.post('https://archerone-backend.herokuapp.com/api/courseofferingslist/',{
                    courses,
                    applyPreference: false,
                    user_id: localStorage.getItem('user_id')
                }).then(res => {
                    res.data.map(bundle => {
                        var arranged = groupArray(bundle, 'classnumber');
                        for (let key in arranged) {
                        var days = []
                        var day = ''
                        var classnumber = ''
                        var course = ''
                        var course_id = ''
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
                            course_id = offering.course_id
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
                        var checked = localStorage.getItem(classnumber)
                        if(checked == null){
                            checked = true;
                            localStorage.setItem(classnumber, true);
                        }else if(checked == 'true'){
                            checked = true;
                        }else if(checked == 'false'){
                            checked = false;
                        }
                        const offering = this.createData(classnumber, course, section, faculty, day, timeslot_begin, timeslot_end, room, max_enrolled, current_enrolled, checked);
                        offeringList.push(offering);
                        }
                    })
                    const newCourse = {'id':id,'course_id':val.id,'data':val.course_code,'siteData':offeringList}; 
                    this.setState(state =>{
                        const highCourses = state.highCourses.concat(newCourse);
                        return{highCourses};
                    });
                    _callback()
                })
            })
        }else{
            const newCourse = {'id':id,'course_id':val.id,'data':val.course_code,'siteData':[]}; 
            this.setState(state =>{
                const highCourses = state.highCourses.concat(newCourse);
                return{highCourses};
            });
            _callback()
        }
    }

    componentDidMount(){
        const id = localStorage.getItem('user_id');
        var AutoCompleteValue = JSON.parse(localStorage.getItem('addCourses'))
        if(AutoCompleteValue != null){
            this.setState({AutoCompleteValue})
            this.setState({currentCourse: AutoCompleteValue});
        }
        axios.get('https://archerone-backend.herokuapp.com/api/courses/')
        .then(res => {
            res.data.map(course => {
                var courses = this.state.courseList;
                var addCourse = {'id':course.id,'course_code':course.course_code}
                courses.push(addCourse)
                this.setState({courseList: courses})
            })
            axios.get('https://archerone-backend.herokuapp.com/api/courseprioritylist/'+id+'/')
            .then(res => {
                console.log(res.data)
                var total = res.data.length;
                var done = 0;
                res.data.map(coursepriority => {
                    const id = coursepriority.id
                    const priority = coursepriority.priority
                    var newCourseList = []
                    this.state.courseList.map(course =>{
                        if(course.id == coursepriority.courses){
                            if(priority){
                                this.getCourseOfferings(id, course, this.state.highCourses, () => {
                                    done += 1;
                                    if(total <= done){
                                        this.setState({dataReceived: true})
                                    }
                                })
                            }else{
                                this.getLowCourseOfferings(id, course, this.state.lowCourses, () => {
                                    done += 1;
                                    if(total <= done){
                                        this.setState({dataReceived: true})
                                    }
                                })
                            }
                        }else{
                            newCourseList.push(course)
                        }
                    })
                    this.setState({courseList:newCourseList})
                })
                if(total <= done){
                    this.setState({dataReceived: true})
                }
                console.log(this.state.highCourses.length)
                console.log(this.state.lowCourses.length)
                console.log(this.state.loading || this.state.highCourses.length + this.state.lowCourses.length <= 0);
            });
        })
    }

    saveCourses = () => {
        // const priority = res.data.priority
        // var newCourseList = []
        // this.state.courseList.map(course =>{
        //     if(course.id == res.data.courses){
        //         if(priority){
        //             var courses = this.state.highCourses;
        //             courses.push(course.course_code)
        //             this.setState({highCourses: courses})
        //         }else{
        //             var courses = this.state.lowCourses;
        //             courses.push(course.course_code)
        //             this.setState({lowCourses: courses})
        //         }
        //     }else{
        //         newCourseList.push(course)
        //     }
        // })
        // this.setState({courseList:newCourseList})
    }

    componentDidUpdate(prevProp, prevState){
        if(prevState.generatedContents !== this.state.generatedContents){
            this.handleScrollToGen();
            prevState.generatedContents = this.state.generatedContents;
        }
       
    }

    // handleKeyPress = (event) => {
    //     if(event.key === 'Enter'){
    //         const newCourse = event.target.value;
    //         this.setState(state =>{
    //             const highCourses = state.highCourses.concat(newCourse);
    //             return{highCourses};
    //         });
    //         console.log(this.state.highCourses)
    //     }
    // }
    handleCourseDelete = (addCourse) => {
        axios.delete('https://archerone-backend.herokuapp.com/api/courseprioritylist/'+addCourse.id+'/')
        .then(res => {
            console.log("deleted "+addCourse.id)
            const newCourseList = [];
            this.state.courseList.map(course => {
                newCourseList.push(course)
            })
            newCourseList.push({'id':addCourse.course_id, 'course_code':addCourse.data})
            this.setState({courseList:newCourseList})
        }).catch(error =>{
            console.log(error.response)
        })
    }

    handleAutoCompleteChange = (e, val) => {
        this.setState({currentCourse: val});
        this.setState({AutoCompleteValue: val},() => {
            localStorage.setItem('addCourses', JSON.stringify(val))
        });
    }

    handleAutoCompletePress = (e) => {
        const val = this.state.currentCourse;
        if(e.key === 'Enter'){
            this.handleAddCoursePriority();
        }
    }

    handleAddCoursePriority = () => {
        console.log(this.state.currentCourse)
        const val = this.state.currentCourse;
        localStorage.removeItem('addCourses')

        if(val != undefined && val != [] && val.length != 0){
            this.setState({AutoCompleteValue: []})
            this.setState({currentCourse: []})
            this.setState({courseAdded: false})
            this.setState({loading: true})
            const newCourseList = [];
            // this.state.courseList.map(course => {
            //     if(course.id != val.id){
            //         newCourseList.push(course)
            //     }
            // })
            // this.setState({courseList:newCourseList})
            var count = 0
            var max = val.length
            val.map(course => {
                if(course.course_code != undefined && course.course_code.trim() != ''){
                    const id = localStorage.getItem('user_id');
                    const data = {
                        courses: course.id,
                        priority: true,
                        user: id
                    }
                    axios.post('https://archerone-backend.herokuapp.com/api/coursepriority/', data,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(res => {
                        this.getSingleCourseOfferings(res.data.id, course, () => {
                            count += 1
                            if(max >= count){
                                this.setState({loading: false}, () => {
                                })
                            }

                        })

                    })
                    .catch(error => {
                        console.log(error.response)
                        this.setState({loading: false})
                    });
                }
            })
        }       
    }

    handlePageChange = (e,index) => {
        this.setState(state =>{
            var currentContent = state.generatedContents[index];
            return {currentContent};
        });
        
        this.setState({currentPage: index});
        this.setState(state =>{
            var currentPage = index;
            return {currentPage};
            });

        this.handleScrollToGen();

        if(this.state.savedScheds.includes(this.state.generatedContents[index].key)){
            this.setState({saveButtonLabel: "Saved"});
            const styleChange = {margin: "30px", backgroundColor: "white", color: "#16775D"};
            this.setState({saveButtonStyle: styleChange});
        }else{
            this.setState({saveButtonLabel: "Save Schedule"});
            const styleChange = {margin: "30px", backgroundColor: "#16775D", color: "white"};
            this.setState({saveButtonStyle: styleChange});
        }
    }

    createTimeslot = (day, hour, minute) =>{
        if(day == 'M'){
            return new Date(2018, 5, 25, hour, minute);
        }else if(day == 'T'){
            return new Date(2018, 5, 26, hour, minute);
        }else if(day == 'W'){
            return new Date(2018, 5, 27, hour, minute);
        }else if(day == 'H'){
            return new Date(2018, 5, 28, hour, minute);
        }else if(day == 'F'){
            return new Date(2018, 5, 29, hour, minute);
        }else if(day == 'S'){
            return new Date(2018, 5, 30, hour, minute);
        }
    }

    setSchedInfo = () => {
        console.log(this.state.schedules)
        var generatedContents = this.state.schedules.map((item, index) =>
            <GenSchedInfo key={item.id} id={item.id} offerings={item.offerings} scheduleContent={item.scheduleContent} tableContent={item.tableContent} prefContent={item.prefContent} conflictsContent={item.conflictsContent} titleName={item.title} earliest={item.earliest} latest={item.latest} updateSchedTitle={this.updateSchedTitle}/>
        );
        this.setState({currentPage: 0})
        this.setState({generatedContents});
        this.setState({hideGenContent: false});
        this.setState({pagesCount: generatedContents.length});
        this.setState({currentContent: generatedContents[0]})

        this.handleScrollToGen();
    }

    createData(classNmbr, course, section, faculty, day, startTime, endTime, room, capacity, enrolled, checked) {
        return { classNmbr, course, section, faculty, day, startTime, endTime, room, capacity, enrolled, checked };
    }

    createSchedInfo = () =>{
        if(!this.state.loading){
            this.setState({loading: true});
            this.setState({success: false});
            this.toggleModalWait();
            //modal popped out here
          }else{
            this.setState({success: true});
            this.setState({loading: false});
            this.toggleModalWait();
        } 
        this.setState({savedScheds: [], hideGenContent: true, generatedContents: [], currentContent: ""});

        this.setState({saveButtonLabel: "Save Schedule"});
        const styleChange = {margin: "30px", backgroundColor: "#16775D", color: "white"};
        this.setState({saveButtonStyle: styleChange});

        const courseOfferings = []

        this.state.highCourses.map(course => {
            course.siteData.map(c => {
                if(!c.checked){
                    courseOfferings.push(c)
                }
            })
        })

        this.state.lowCourses.map(course => {
            course.siteData.map(c => {
                if(!c.checked){
                    courseOfferings.push(c)
                }
            })
        })

        this.setState({courseOfferings:courseOfferings}, () => {
            console.log(courseOfferings)
            axios.post('https://archerone-backend.herokuapp.com/api/generateschedule/',
            {
                highCourses: this.state.highCourses, 
                lowCourses: this.state.lowCourses,
                user_id: localStorage.getItem('user_id'),
                filterFull: this.state.filterFull,
                courseOfferings: courseOfferings 
            })
            .then(res => {
                console.log(res)
                const schedules = []
                var schedCount = 0;
                res.data.map(newSchedule =>{
                    var count = 0;
                    const scheduleContent = []
                    const tableContent = []
                    var earliest = 9
                    var latest = 17


                    newSchedule.offerings.map(offering=>{
                        var startTime = offering.timeslot_begin.split(':');
                        var endTime = offering.timeslot_end.split(':');
                        const newContent = 
                        {
                            id: count,
                            title: offering.course + ' ' + offering.section,
                            section: offering.section,
                            startDate: this.createTimeslot(offering.day,startTime[0],startTime[1]),
                            endDate: this.createTimeslot(offering.day,endTime[0],endTime[1]),
                            priorityId: 3,
                            location: offering.room,
                            professor: offering.faculty,
                            startTime: offering.timeslot_begin.substring(0, offering.timeslot_begin.length - 3),
                            endTime: offering.timeslot_end.substring(0, offering.timeslot_end.length - 3),
                            days: offering.day,
                            classCode: offering.classnumber 
                        }
                        if(earliest > Number(startTime[0])){
                            earliest = Number(startTime[0])
                        }
                        if(latest < Number(endTime[0]) + 1){
                            latest = Number(endTime[0]) + 1
                        }
                        scheduleContent.push(newContent);
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

                        day = offering.day
                        classnumber = offering.classnumber
                        course = offering.course
                        section = offering.section
                        faculty = offering.faculty
                        timeslot_begin = offering.timeslot_begin
                        timeslot_end = offering.timeslot_end
                        room = offering.room
                        max_enrolled = offering.max_enrolled
                        current_enrolled = offering.current_enrolled
                        const newTableContent = this.createData(classnumber, course, section, faculty, day, timeslot_begin, timeslot_end, room, max_enrolled, current_enrolled);
                        // tableContent.push(newTableContent)
                        count += 1;
                    })
                    schedCount += 1;
                    schedules.push({
                        id: schedCount,
                        title: "Schedule "+schedCount.toString(),
                        scheduleContent: scheduleContent,
                        tableContent: tableContent,
                        prefContent: [],
                        prefContent: newSchedule.preferences,
                        conflictsContent: newSchedule.information,
                        earliest: earliest,
                        latest: latest,
                        offerings: newSchedule.offerings
                    });
                })
                console.log(schedules)
                this.setState({schedules});
                this.setSchedInfo();
                this.setState({success: true});
                this.setState({loading: false});
                this.toggleModalWait();
            }).catch(error => {
                console.log(error.response)
                this.setState({success: false});
                this.setState({loading: false});
                this.toggleModalWait();
            })
        })


    }

    updateHighPriority(courseUpdate){
        var newArray = [];
        courseUpdate.map(course=>{
            newArray.push(course);
        })
        this.setState({highCourses: newArray})
    }

    updateLowPriority(courseUpdate){
        var newArray = [];
        courseUpdate.map(course=>{
            newArray.push(course);
        })
        this.setState({lowCourses: newArray})
    }
    
    updateSchedTitle=(text)=>{
         var newArray = [];
         const currentContent = this.state.currentContent;
        // var index = newArray.findIndex(this.state.currentContent);
        const newContent = <GenSchedInfo key={currentContent.props.id} earliest={currentContent.props.earliest} latest={currentContent.props.latest} id={currentContent.props.id} offerings={currentContent.props.offerings} scheduleContent={currentContent.props.scheduleContent} tableContent={currentContent.props.tableContent} prefContent={currentContent.props.prefContent} conflictsContent={currentContent.props.conflictsContent} titleName={text} updateSchedTitle={this.updateSchedTitle}/>

        this.state.generatedContents.map(value=>{
            if(value.key == this.state.currentContent.key){
                newArray.push(newContent)
            }else{
                newArray.push(value)
            }
        })

        this.setState({generatedContents: newArray});
        this.setState({currentContent: newContent});
    }
    
    handleScrollToGen=()=>{
        window.scrollTo({
            top: this.generatedRef.current.offsetTop,
            behavior: "smooth"
        })
    }

    handleSaveChange=()=>{
        if(this.state.savedScheds.includes(this.state.currentContent.key)){
        }else{
            this.setState({loading: true});
            const courseOfferings = []
            const user_id = localStorage.getItem('user_id')
            console.log(this.state.currentContent)
            this.state.currentContent.props.offerings.map(offering => {
                courseOfferings.push(offering.id)
            })
            axios.post('https://archerone-backend.herokuapp.com/api/schedules/',{
                title: this.state.currentContent.props.titleName,
                courseOfferings: courseOfferings,
                user: user_id
            }).then(res => {
                // axios.get('https://archerone-backend.herokuapp.com/api/users/'+user_id+'/')
                // .then(res => {
                //     const schedules = res.data.schedules;
                //     schedules.push(sched_id);
                //     axios.patch('https://archerone-backend.herokuapp.com/api/users/'+user_id+'/',{
                //         schedules: schedules
                //     }).then(res => {
                //         console.log(res)
                        
                //     }).catch(err => {
                //         console.log(err.response)
                //     })
                // })
            }).catch(err => {
                console.log(err.response)

            })
            this.setState(state=>{
                const savedScheds = state.savedScheds.concat(state.currentContent.key);
                return {savedScheds};
            })
            this.setState({loading: false});
            this.setState({saveButtonLabel: "Saved"});
            const styleChange = {margin: "30px", backgroundColor: "white", color: "#16775D", borderStyle: "solid", borderColor: "#16775D"};
            this.setState({saveButtonStyle: styleChange});
            this.setState({snackBar: true});
        }
        

    }

    handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({snackBar: false});
      }
    
    handleFilterFull = () => {
        this.setState({filterFull: !this.state.filterFull});
    }

    handleCheckbox = (index) => {
        this.setState(state =>{
            const siteData  = state.siteData
            siteData[index].checked = !siteData[index].checked
            localStorage.setItem(siteData[index].classNmbr, siteData[index].checked)
            return{siteData};
        });
        console.log(this.state.siteData[index]) 
    }
    
    handleAllCheckbox = () => {
        this.setState(state =>{
            const siteData = state.siteData
            siteData.map(c => {
                if(this.state.allCheckBox){
                    c.checked = false 
                }else{
                    c.checked = true 
                }
                localStorage.setItem(c.classNmbr, c.checked)
            })
            return{siteData};
        }, () => {
            this.setState({allCheckBox: !this.state.allCheckBox})
        });
    }

    handleCourseOfferingChange =(e, val)=>{
        this.setState({courseOfferings: val});
    }
    
    triggerModal=(courseName, siteData)=>{
        this.setState({siteData})
        this.setState({allCheckBox: false}, () => {
            this.state.siteData.map(c => {
                if(c.checked){
                    this.setState({allCheckBox: true})
                }
            })
        })
        this.setState({openModalCourseOfferings: true});
        this.setState({modalCourseName: courseName});
    }

    handleCloseModalCourseOfferings = ()=>{
      this.setState({openModalCourseOfferings: false})
    }
  
    handleOpenModalCourseOfferings = () =>{
        this.setState({openModalCourseOfferings: true})
    }
  
    toggleModal = () => {
        var openModalVar = this.state.openModalCourseOfferings;
        this.setState({openModalCourseOfferings: !openModalVar});
    }
    
    handleSaveCourseOfferings = () =>{
        console.log("Course Offerings changes saved");
        this.setState({openModalCourseOfferings: false});
      } 
    
    toggleModalWait = () => {
        var openModalVar = this.state.openModalWait;
        this.setState({openModalWait: !openModalVar});
      }
    render() { 
        let search_field = this.props.search_field;
        // const { currentPage } = this.state;
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

          const hints = [
                    {
                        element: '#launch',
                        hint:"Click here to filter out your classes!",
                        hintPosition: 'top-middle',
                    }
                ];

        return (
            <div>
                {this.props.menu('generateSchedule')}
                {this.state.dataReceived ?
                <div>
                    <Column flexGrow={1} style={{margin: "40px"}}>
                        <div className="courseInputContainer">
                            <Row horizontal = 'center'>
                                <h1>SECOND TRIMESTER, AY 2019 - 2020</h1>
                            </Row>
                            <Hints
                                enabled={(localStorage.getItem('hints') == 'true')}
                                hints={hints}
                                onClose={() => {localStorage.setItem('hints',false)}}
                            />
                            <Row horizontal = 'center' style={{margin: "20px"}}>
                                <div id="search_container">
                                    {/* <Input
                                    type="search"
                                    name={search_field}
                                    id="exampleSearch"
                                    placeholder="Enter Course Name..."
                                    value = {this.state.Input}
                                    onKeyPress={this.handleKeyPress}
                                    /> */}
                                    <ComboBox
                                    page={"add"}
                                    disabled={this.state.loading}
                                    onChange={this.handleAutoCompleteChange}
                                    onKeyPress={this.handleAutoCompletePress}
                                    value={this.state.AutoCompleteValue}
                                    defaultValue={this.state.AutoCompleteValue}
                                    />
                                     
                                </div>
                                <div>
                                    <Button
                                        variant="contained"
                                        color = "Primary"
                                        disabled={this.state.loading}
                                        style={{backgroundColor: "green", color:"white", height:"56px"}}
                                        data-hint="hello"
                                        onClick={this.handleAddCoursePriority}>
                                        <AddIcon fontSize="medium"/>  
                                    </Button>

                                </div>
                            </Row>
                            <Row horizontal='center' style={{margin: "20px"}}>
                                <FormControlLabel
                                control = {<GreenCheckbox disabled={this.state.loading} checked={this.state.filterFull} onChange={this.handleFilterFull} color="primary"/>}label="Filter out closed classes" />
                            </Row>
                            <div className={"DnDContainer"}>
                                <Row vertical = 'center'>
                                    <Column flexGrow={1} horizontal = 'center'>
                                        <h3 className='priortyTitle'>Highest Priority</h3>
                                        <CourseDnD idTag={this.state.highPriorityId} courses={this.state.highCourses} updateFunction={this.updateHighPriority} handleCourseDelete={this.handleCourseDelete} triggerModal={this.triggerModal} loading={this.state.loading}/>

                                    </Column>
                                    <Column flexGrow={1} horizontal = 'center'>
                                        <h3 className='priortyTitle'>Lowest Priority</h3>
                                        <CourseDnD idTag={this.state.lowPriorityId} courses={this.state.lowCourses} updateFunction={this.updateLowPriority} handleCourseDelete={this.handleCourseDelete} triggerModal={this.triggerModal} loading={this.state.loading}/>
                                    </Column>
                                </Row>
                            </div>
                            {/*============MODAL EXERPIMENT HERE======================*/}
                            <Modal dialogClassName="modal-90w" size="lg" style={{maxWidth: '1600px', width: '80%'}} isOpen={this.state.openModalCourseOfferings} toggle={this.toggleModal} returnFocusAfterClose={false} backdrop="static" data-keyboard="false">
                              <ModalHeader toggle={this.toggleModal}>Course Information</ModalHeader>

                              <ModalBody>
                                <h4>{this.state.modalCourseName}</h4>
                                <br/>

                                <TableContainer component={Paper}>
                                    <Table aria-label="customized table">
                                      <TableHead>
                                        <TableRow>
                                            <StyledTableCell> <WhiteCheckbox onClick={() => this.handleAllCheckbox()} checked={this.state.allCheckBox}/> </StyledTableCell>
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
                                              <StyledTableCell> <Skeleton width={'100%'} height={'100%'}></Skeleton> </StyledTableCell>
                                            </StyledTableRow>
                                          ))}
                                      </TableBody>
                                      : 
                                      <TableBody>
                                        {this.state.siteData.map((row, index) => (
                                                
                                          <StyledTableRow key={row.classNmbr} style={(row.capacity == row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}>
                                            <StyledTableCell> <GreenCheckbox onClick={() => this.handleCheckbox(index)} checked={row.checked}/></StyledTableCell>
                                                    
                                            <StyledTableCell style={(row.capacity == row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {row.classNmbr} </StyledTableCell>
                                            <StyledTableCell onClick={this.handleOpenModalCourseInfo} style={(row.capacity == row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}} > {row.course} </StyledTableCell>
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

                              </ModalBody>
                                
                                <ModalFooter>
                                  <Button color="primary" onClick={this.handleSaveCourseOfferings}>Save Changes</Button>{' '}
                                  <Button style={{color: "gray"}}onClick={this.toggleModal}>Cancel</Button>
                                </ModalFooter>

                          </Modal> 
                            
                            {/* <Row horizontal='center' style={{margin: "20px"}}>
                                <ComboBox page={"edit"} value={this.state.courseOfferings} onChange={this.handleCourseOfferingChange}></ComboBox>
                            </Row> */}
                            <Row horizontal = 'center' style={{margin: "20px"}}>
                                <div className={classes.root}>
                                    <div className={classes.wrapper} ref={this.generatedRef}> 
                                        <Button
                                        variant="contained"
                                        className={classes.schedButton}
                                        disabled={this.state.loading || this.state.highCourses.length + this.state.lowCourses.length <= 0}
                                        onClick={()=>this.createSchedInfo()}
                                         
                                        // style={{backgroundColor: "green"}}
                                        >
                                        Generate Schedule
                                        </Button>
                                        {this.state.loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
                                    </div>
                                </div>
                                {/* <button className="schedButton" onClick={()=>this.createSchedInfo()} style={{marginTop: "20px"}}>Generate Schedule</button> */}
                            </Row>

                            <Modal isOpen={this.state.openModalWait} toggle={this.toggleModalWait} returnFocusAfterClose={false} backdrop={true} data-keyboard="false" centered={true}>
                                <ModalHeader toggle={this.toggleModalWait}>
                                    <center>
                                        <br></br><p>Please wait...In the process of making your schedule</p>
                                        <ReactLoading type={'spin'} color={'#9BCFB8'} height={'10%'} width={'10%'}/>
                                    </center>
                                    </ModalHeader>
                                
                                    <ModalFooter>
                                        
                                        <Button style={{color: "gray"}}>Cancel</Button>
                                    </ModalFooter>
                                
                            </Modal> 
                        </div>

                        <div   className = "genSchedInfoContainer" style={this.state.hideGenContent ? {display: "none"} :  {margin: "40px"}}>
                            <span>{this.state.currentContent}</span>
                        
                            <div className = "paginationContainer">
                                <Pagination aria-label="Page navigation example" style={{justifyContent: "center"}}>
                                    <PaginationItem disabled={this.state.currentPage <= 0}>
                                        <PaginationLink onClick={e => this.handlePageChange(e, this.state.currentPage - 1)}
                                            previous/>
                                    </PaginationItem>
                                    {[...Array(this.state.pagesCount)].map((page, i) => 
                                        <PaginationItem active={i === this.state.currentPage} key={i} className={'paginationItemStyle'}>
                                            <PaginationLink onClick={e => this.handlePageChange(e, i)} className={'paginationLinkStyle'}>
                                            {i + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                        )}
                                    <PaginationItem disabled={this.state.currentPage >= this.state.generatedContents.length - 1}>
                                        <PaginationLink
                                            onClick={e => this.handlePageChange(e, this.state.currentPage + 1)}
                                            next
                                        />
                                        
                                        </PaginationItem>
                                </Pagination>
                            </div>
                            <Row horizontal='center'>
                                <div className={classes.root}>
                                        <div className={classes.wrapper}> 
                                            <Button
                                            variant="contained"
                                            className={classes.schedButton}
                                            onClick={this.handleSaveChange}
                                            style={this.state.saveButtonStyle}
                                            >
                                            {this.state.saveButtonLabel}
                                            </Button>
                                            {this.state.loading && <CircularProgress size={24} className={classes.buttonProgressSave}/>}
                                        </div>
                                        <Snackbar open={this.state.snackBar} autoHideDuration={4000} onClose={this.handleCloseSnackBar}>
                                            <Alert onClose={this.handleCloseSnackBar} severity="success">
                                                Your schedule have been successfully saved! View in <a href="/" style={{color:"#D3D3D3"}}>homepage</a>
                                            </Alert>
                                        </Snackbar>
                                    </div>
                                {/* <button className={"schedButton"} style={this.state.saveButtonStyle} onClick={this.handleSaveChange}>{this.state.saveButtonLabel}</button> */}
                            </Row>  
                        </div>
                    </Column>
                </div>
                : 
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh"}}>
                    <ReactLoading type={'spin'} color={'#9BCFB8'} height={'5%'} width={'5%'}/>
                </div> }
            </div>  
        );
    }
}

GenerateSchedule.propTypes={
    classes: PropTypes.object.isRequired,
  };


export default withStyles(styles)(GenerateSchedule);