import React, { Component } from "react";
import { Column, Row } from 'simple-flexbox';
import Menu from '../components/Menu.jsx';
import axios from 'axios';
import ReactDOM from "react-dom";
import { Pagination, PaginationItem, PaginationLink} from 'reactstrap';
import '../css/Index.css'

import SchedViewHome from '../components/SchedViewHome';

import Background from '../assets/Gradient_BG.png'
import calendarIcon from '../assets/calendar.png'
import attachIcon from '../assets/attach.png'
import laughIcon from '../assets/laugh.png'
import whiteBlob from '../assets/whiteBlob.png'
// import { Container, Row, Col } from 'reactstrap';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import PropTypes from 'prop-types';
import { isThisMonth } from "date-fns/esm";
import groupArray from 'group-array';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Snackbar from '@material-ui/core/Snackbar';

import html2canvas from 'html2canvas';
import { Steps, Hints } from 'intro.js-react';
import 'intro.js/introjs.css';
import '../css/introjs-modern.css';

// import Modal from '@material-ui/core/Modal';

import GetAppIcon from '@material-ui/icons/GetApp';
import PaletteIcon from '@material-ui/icons/Palette';
import DeleteIcon from '@material-ui/icons/Delete';
import DateRangeIcon from '@material-ui/icons/DateRange';

import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Paper from '@material-ui/core/Paper';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ReactLoading from 'react-loading';

import SearchIcon from '@material-ui/icons/Search';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { Chip } from "@material-ui/core";
import ComboBox from "../components/ComboBox.jsx";

import { Redirect } from "react-router-dom";
import MuiAlert from '@material-ui/lab/Alert';

import StarIcon from '@material-ui/icons/Star';
import TodayIcon from '@material-ui/icons/Today';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const GreenCheckbox = withStyles({
  root: {
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const styles = theme => ({
  buttonStyle:{
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
  },
prefbuttonStyle:{
    textTransform: "none",
    width: "15%",
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
},

testbuttonStyle:{
  fontSize: "1vw",
  textTransform: "none",
  width: "100%",
  height: "100%",
  borderRadius: "10px",
  // padding: "2%",
  // paddingLeft: "15px",
  // paddingRight: "15px",
  border: "2px solid #16775D",
  // backgroundColor: "white",
  backgroundColor: "#16775D",
  color: "white",
  // color: "#16775D",
  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  // borderStyle: "solid",
  // borderColor: "#16775D",
  // marginTop: "20px",
  // justifyContent: 'center',
  '&:hover': {
    // backgroundColor: "#16775D",
    // color: "white",
    color: "#16775D",
    backgroundColor: "white",
    },
},

    deleteButtonStyle:{
      textTransform: "none",
      width: "160px",
      borderRadius: "25px",
      padding: "10px",
      paddingLeft: "10px",
      paddingRight: "10px",
      backgroundColor: "#D3D3D3",
      border: "##D3D3D3",
      color: "black",
      boxShadow: "6px 5px #e8f4ea",
      borderStyle: "solid",
      borderColor: "#D3D3D3",
      marginTop: "20px",
      justifyContent: 'center',
      '&:hover': {
          backgroundColor: "#d11a2a",
          borderStyle: "solid",
          color: "white",
          // borderColor: "#D3D3D3",
        },
    },
    
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // transform: 'translate(-50px, -50px)',
      backgroundColor: "white",
      top:"50%",
      left:"50%",
      transform: "translate(-50%,-50%)",

    },
    
    paper: {
      position: 'absolute',
      width: "400px",
      height: "300px",
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },

    gridRoot:{
      flexGrow: 1,
    },

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

var sectionStyle = {
  // width: "100%",
  minHeight: "100vh",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  overflow: "hidden",
  backgroundImage: "linear-gradient(#086e53, #579d8b)"

};

class Index extends Component {
    constructor(props){
      super(props);
      this.state={
        openAlert: false,
        snackBarVariables: [
          {snackBarSuccess: false}, {snackBarFailed: false}],
        // snackBarFailed: false,
        currentPage: 0,
        currentContent: "",
        generatedContents: [],
        // currentContent: <SchedViewHome/>,
        // generatedContents: [<SchedViewHome/>,<SchedViewHome/>,<SchedViewHome/>],
        pagesCount: 1,
        dataReceived: !props.logged_in,
        schedules: [],
        openModalCustomize: false,
        openModalEdit: false,
        paletteChoices: [],
        // chosenPalette: ['#9BCFB8', '#7FB174', '#689C97', '#072A24', '#D1DDDB', '#85B8CB', '#1D6A96', '#283B42','#FFB53C', '#EEB3A3', '#F3355C', '#FAA98B', '#E6AECF', '#AEE0DD', '#01ACBD','#FED770', ' #F29F8F', '#FB7552', '#076A67','#324856', '#4A746A', '#D18237', '#D66C44', '#FFA289', '#6A92CC', '#706FAB', '#50293C'],
        chosenPalette: [],
        classboxDetailsList: [
          {id: 1, title: "showFaculty", checked: true},
          {id: 2, title: "showTime", checked: true},
          {id: 3, title: "showRoom", checked: true}
        ],
        classList: [],
        currentClasses:  [],
        newCurrentClasses: [],
        newClassboxDetailsList: [],
        newChosenPalette: [],
        snackbarMsg: "",
        allowEdit: true,
        scheduleChanged: true,
        goToSearch: false,
        goToCreate: false
//        this.scheduleRef = React.createRef();
        
      }
      if(localStorage.getItem('palette') == undefined){
        localStorage.setItem('palette', JSON.stringify(['#9BCFB8', '#7FB174', '#689C97', '#072A24', '#D1DDDB', '#85B8CB', '#1D6A96', '#283B42','#FFB53C', '#EEB3A3', '#F3355C', '#FAA98B', '#E6AECF', '#AEE0DD', '#01ACBD','#FED770', ' #F29F8F', '#FB7552', '#076A67','#324856', '#4A746A', '#D18237', '#D66C44', '#FFA289', '#6A92CC', '#706FAB', '#50293C']))
      }
      if(localStorage.getItem('steps') == undefined){
        localStorage.setItem('steps',true)
      }
      
    }


    handlePageChange = (e,index) => {
      this.setState(state =>{
        var currentContent = state.generatedContents[index];
        return {currentContent};
      }, () => {
        const currentClasses = [];
        const offerings = this.state.currentContent.props.offerings
        for(var i = 0 ; i < offerings.length ; i += 2){
          currentClasses.push({title: offerings[i].course + ' ' + offerings[i].section, classnumber: offerings[i].classnumber, course: offerings[i].course_id})
        }
        this.setState({currentClasses})
      });

      
      this.setState({currentPage: index});
      this.setState(state =>{
        var currentPage = index;
        return {currentPage};
      });
      console.log("pressed page " + index);
      console.log(this.state.generatedContents[index]);
      window.scrollTo({top: 0, behavior: 'smooth'});
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

  createData(classNmbr, course, section, faculty, day, startTime, endTime, room, capacity, enrolled) {
    return { classNmbr, course, section, faculty, day, startTime, endTime, room, capacity, enrolled };
  }

  componentDidMount(){
    var pal1 = ['#EAC9C0', '#DAB2D3', '#9EDAE3', '#65C4D8', '#FFD0D6', '#B7DDE0', '#FEE19F', '#735b69'];
    var pal2 = ['#A9DFED', '#EBD6E8', '#84C0E9', '#37419A', '#7CCAAE', '#A299CA', '#FFb69B', '#ECEC84'];
    var pal3 = ['#9BCFB8', '#7FB174', '#689C97', '#072A24', '#D1DDDB', '#85B8CB', '#1D6A96', '#283B42'];
    this.processPaletteChoices('Pastel Blossoms', pal1);
    this.processPaletteChoices('Halographic', pal2);
    this.processPaletteChoices('Plantita', pal3);

    var pal4 = ['#138086', '#534666', '#CD7672', '#DC8665', '#E8A49C', '#EEB462'];
    var pal5 = ['#522157', '#8B4C70', '#C2649A', '#E4C7B7', '#E4DFD9'];
    var pal6 = ['#205072', '#2C6975', '#329D9C', '#56C596', '#68B2A0', '#7BE495', '#CDE0C9', '#CFF4D2'];
    var pal7 = ['#9F8189', '#F3ABB6', '#FAA7B8', '#FBEEE6', '#FFCAD4', '#FFE5D8'];
    var pal8 = ['#0191B4', '#35BBCA', '#D3DD18', '#F8D90F', '#FE7A15'];
    var pal9 = ['#47CACC', '#63BCC9', '#CDB3D4', '#E7B7C8', '#FFBE88'];
    this.processPaletteChoices('Pal4', pal4);
    this.processPaletteChoices('Pal5', pal5);
    this.processPaletteChoices('Pal6', pal6);
    this.processPaletteChoices('Pal7', pal7);
    this.processPaletteChoices('Pal8', pal8);
    this.processPaletteChoices('Pal9', pal9);
    if(!this.state.dataReceived){
      this.retrieveSchedInfo()
    }
  }

  retrieveSchedInfo = () => {
    axios.get('https://archerone-backend.herokuapp.com/api/schedulelist/'+localStorage.getItem('user_id')+'/')
    .then(res => {
        const schedules = []
        res.data.map(newSchedule =>{
            var count = 0;
            const scheduleContent = []
            const tableContent = []
            var earliest = 9
            var latest = 17
            var arranged = groupArray(newSchedule.courseOfferings, 'classnumber');
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
                timeslot_begin = offering.timeslot_begin.substring(0, offering.timeslot_begin.length - 3)
                timeslot_end = offering.timeslot_end.substring(0, offering.timeslot_end.length - 3)
                room = offering.room
                max_enrolled = offering.max_enrolled
                current_enrolled = offering.current_enrolled
              })
              days.map(day_code => {
                day += day_code;
              })
              const newTableContent = this.createData(classnumber, course, section, faculty, day, timeslot_begin, timeslot_end, room, max_enrolled, current_enrolled);
              tableContent.push(newTableContent)
            }
            newSchedule.courseOfferings.map(offering=>{
                var startTime = offering.timeslot_begin.split(':');
                var endTime = offering.timeslot_end.split(':');
                const newContent = 
                {
                    id: count,
                    title: offering.course + ' ' + offering.section,
                    section: offering.section,
                    startDate: this.createTimeslot(offering.day,startTime[0],startTime[1]),
                    endDate: this.createTimeslot(offering.day,endTime[0],endTime[1]),
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

                count += 1;
            })
            schedules.unshift({
                id: newSchedule.id,
                title: newSchedule.title,
                scheduleContent: scheduleContent,
                tableContent: tableContent, 
                prefContent: [],
                conflictsContent: newSchedule.information,
                earliest: earliest,
                latest: latest,
                offerings: newSchedule.courseOfferings
            });
        })
        console.log(schedules)
        this.setState({schedules});
        this.setSchedInfo();
        this.setState({success: true});
        this.setState({loading: false});
        this.setState({dataReceived: true})
        this.setState({scheduleChanged: true})
    }).catch(error => {
        console.log(error)
        this.setState({success: false});
        this.setState({loading: false});
    })
  }

  setSchedInfo = () => {
    console.log(this.state.schedules)
    if(this.state.schedules.length > 0){      
      const palette = JSON.parse(localStorage.getItem('palette'))
      var generatedContents = this.state.schedules.map((item, index) =>
          <SchedViewHome key={item.id} id={item.id} offerings={item.offerings} tableContent={item.tableContent} scheduleContent={item.scheduleContent} titleName={item.title} earliest={item.earliest} latest={item.latest} updateSchedTitle={this.updateSchedTitle} palette={palette} allowEdit={this.state.allowEdit}/>
      );
      this.setState({currentPage: 0})
      this.setState({generatedContents});
      // this.setState({hideGenContent: false});
      this.setState({pagesCount: generatedContents.length});
      this.setState({currentContent: generatedContents[0]},() => {
        const currentClasses = [];
        const offerings = this.state.currentContent.props.offerings
        for(var i = 0 ; i < offerings.length ; i += 2){
          currentClasses.push({title: offerings[i].course + ' ' + offerings[i].section, classnumber: offerings[i].classnumber, course: offerings[i].course_id})
        }
        this.setState({currentClasses, scheduleChanged: true})
      })
    }
  }

  updateSchedTitle=(text)=>{
    var newArray = [];
    const currentContent = this.state.currentContent;
    // var index = newArray.findIndex(this.state.currentContent);
    axios.patch('https://archerone-backend.herokuapp.com/api/schedules/'+currentContent.props.id+'/',{
      title: text
    }).catch(err => {
      console.log(err.response)
    })

    const newContent = <SchedViewHome key={currentContent.props.id} id={currentContent.props.id} scheduleContent={currentContent.props.scheduleContent} tableContent={currentContent.props.tableContent} earliest={currentContent.props.earliest} latest={currentContent.props.latest} titleName={text} updateSchedTitle={this.updateSchedTitle} allowEdit={this.state.allowEdit} palette={currentContent.props.palette}/>

    this.state.generatedContents.map(value=>{
        if(value.key == this.state.currentContent.key){
            newArray.push(newContent)
        }else{
            newArray.push(value)
        }
    })

    this.setState({generatedContents: newArray});
    this.setState({currentContent: newContent});
    window.location.reload();
  }

 deleteSchedule=()=>{
  var newSchedule = [...this.state.generatedContents];
  var currentPage = this.state.currentPage;
  var index = currentPage;

  axios.delete('https://archerone-backend.herokuapp.com/api/schedules/'+this.state.currentContent.props.id+'/')
  .catch(err => {
    console.log(err.response)
  })
  
  if(index !== -1){
    newSchedule.splice(index, 1);
  }
  this.setState({generatedContents: newSchedule})

  if(currentPage == this.state.generatedContents.length - 1){
    currentPage = currentPage - 1;
    this.setState({currentPage});
    this.setState({currentContent: this.state.generatedContents[currentPage-1]});

  }
    this.setState({openAlert: false});

    let snackBarVariables = [...this.state.snackBarVariables];
    this.setState({snackbarMsg: "Your schedule has been successfully deleted!"});
    snackBarVariables[0].snackBarSuccess = true;
    // snackBarVariables[1].snackBarFailed = true;
    this.setState({snackBarVariables});
    console.log(snackBarVariables);
 }

 handleClickOpenAlert = () => {
   this.setState({openAlert: true});
  }

  handleCloseAlert = () => {
    this.setState({openAlert: false});
  }

  handleCloseSnackBar = (event, reason, snackBarIndex) => {
    console.log(event);
    console.log(reason);

    if (reason === 'clickaway') {
      return;
    }
    
  
    let snackBarVariables = [...this.state.snackBarVariables];
    if(snackBarIndex == 0){
      snackBarVariables[0].snackBarSuccess = false;
    }else if(snackBarIndex == 1){
      snackBarVariables[1].snackBarFailed = false;
    }
    this.setState({snackBarVariables});
  }

  exportSched = () => {
    window.scrollTo(0, 0);
    html2canvas(document.querySelector("#savedSchedContent")).then(canvas => {
//      document.location.href = canvas.toDataURL().replace('image/png', 'image/octet-stream');
        var filename = this.state.currentContent.title + ".png";
        console.log(this.state.currentContent.props.titleName);
        console.log(filename);
        this.saveAs(canvas.toDataURL(), this.state.currentContent.props.titleName+".png"); 
        

    });

    let snackBarVariables = [...this.state.snackBarVariables];
    this.setState({snackbarMsg: "Your schedule image is downloading!"});
    snackBarVariables[0].snackBarSuccess = true;
    // snackBarVariables[1].snackBarFailed = true;
    this.setState({snackBarVariables});
    console.log(snackBarVariables);
  }
  
  saveAs = (uri, filename) => {

    var link = document.createElement('a');

    if (typeof link.download === 'string') {

        link.href = uri;
        link.download = filename;

        //Firefox requires the link to be in the body
        document.body.appendChild(link);

        //simulate click
        link.click();

        //remove the link when done
        document.body.removeChild(link);

    } else {

        window.open(uri);

    }
}

  handleCloseModalCustomize = ()=>{
    this.setState({openModalCustomize: false})
  }

  handleOpenModalCustomize = ()=>{
    console.log("Hello opening modal");
    this.setState({openModalCustomize: true})
    console.log(this.state.openModalCustomize);
  }

  toggleModal = () => {
    var openModalVar = this.state.openModalCustomize;
    this.setState({openModalCustomize: !openModalVar});
  }

  toggleModalEdit = () => {
    var openModalVar = this.state.openModalEdit;
    this.setState({openModalEdit: !openModalVar});
  }
  processPaletteChoices = (title, paletteArray) => {
    const colorDiv = paletteArray.map(function(palColor, index){
                        var newstyle = {backgroundColor: palColor, color: palColor, width:"50px", fontSize:"8px", padding: "1em", display: "table-cell"};
                        if(index == 0){
                          newstyle = {backgroundColor: palColor, color: palColor, width:"50px", fontSize:"8px", padding: "1em", display: "table-cell", borderRadius: "100px 0px 0px 100px" };
                        }else if(index == paletteArray.length - 1){
                          newstyle = {backgroundColor: palColor, color: palColor, width:"50px", fontSize:"8px", padding: "1em", display: "table-cell", borderRadius: "0px 100px 100px 0px" };
                        }
                      return(
                        <div key={index} style= {newstyle}>
                          {palColor}
                        </div>
                      )
                    });

      const paletteDiv = <div className={"colorContainer"} style={{width: "50%", display: "table"}}> {colorDiv}</div>

      var paletteChoices = this.state.paletteChoices;
      paletteChoices.push({id: this.state.paletteChoices.length, title: title, paletteDiv: paletteDiv, paletteArray: paletteArray});
      console.log(paletteChoices);
      this.setState({paletteChoices});
  }

  handlePaletteChange=(event)=>{
    this.setState({chosenPalette: event.target.value})
    console.log(this.state.currentContent)
    console.log(this.state.currentContent.props)
    console.log(event.target.value);
  }

  handleClassBoxChange = (event) => {
    var newDetailsList = [...this.state.classboxDetailsList];
    newDetailsList.map(value=>{
        if(value.id === Number(event.target.id)){
            value.checked = event.target.checked;
        }
    })
    this.setState({newClassboxDetailsList: newDetailsList});
    // this.setState({[event.target.name]: event.target.checked });
  };

  handleCustomizeSave = () =>{
    console.log("Class Box changes saved");
    // this.setState({chosenPalette: this.state.newChosenPalette});
    // this.setState({classboxDetailsList: this.state.newClassboxDetailsList});
    this.setState({scheduleChanged: false})
    localStorage.setItem('palette', JSON.stringify(this.state.chosenPalette))
    this.setSchedInfo();
    this.setState({openModalCustomize: false});
    
    let snackBarVariables = [...this.state.snackBarVariables];
    this.setState({snackbarMsg: "Your schedule customization changes have been successfully saved!"});
    snackBarVariables[0].snackBarSuccess = true;
    // snackBarVariables[1].snackBarFailed = true;
    this.setState({snackBarVariables});
    console.log(snackBarVariables);
  }

  handleEditChange =(e, val)=>{
    this.setState({newCurrentClasses: val});
  }

  handleEditAdd=()=>{
    console.log("Schedule edit changes saved");
    const currentClasses = this.state.currentClasses
    this.state.newCurrentClasses.map(offering => {
      console.log(offering)
      currentClasses.push({title: offering.course + ' ' + offering.section, classnumber: offering.classNmbr, course: offering.course_id})
    })
    this.setState({currentClasses, newCurrentClasses: []}, () => {
      console.log(currentClasses)
    })
  }
  
  handleEditSave=()=>{

    this.setState({scheduleChanged: false})

    const classnumbers = []
    const courses = []
    const sched_id = this.state.currentContent.props.id
    const user_id = localStorage.getItem('user_id')

    this.state.currentClasses.map(offering => {
      classnumbers.push(offering.course)
      courses.push(offering.classnumber)
    })
    console.log(classnumbers)
    console.log(courses)

    this.setState({openModalEdit: false});

    let snackBarVariables = [...this.state.snackBarVariables];
    axios.post('https://archerone-backend.herokuapp.com/api/editschedule/',{
      classnumbers,
      courses,
      sched_id,
      user_id
    }).then(res => {
      console.log(res.data)
      this.setState({snackbarMsg: "Your schedule changes have been successfully saved!"});
      snackBarVariables[0].snackBarSuccess = true;
      // snackBarVariables[1].snackBarFailed = true;
      this.setState({snackBarVariables});
      console.log(snackBarVariables);
      // window.location.reload();
    }).catch(err => {
      console.log(err.response)
    })

  }

  handleDelete=(index)=>{
    const currentClasses = this.state.currentClasses
    if (index > -1) {
      currentClasses.splice(index, 1);
    }
    this.setState({currentClasses})

  }

  goToCreateSchedule = () => {
    this.setState({goToCreate: true});
  }
  
  goToSearchCourse = () => {
    this.setState({goToSearch: true});
  }

  renderRedirect = () => {
    if(this.state.goToSearch){
      return <Redirect to='/search_courses/'/>
    }else if(this.state.goToCreate){
      return <Redirect to='/login/'/>
    }

  }

  tutorialDone = () => {
    localStorage.setItem('steps',false)
  }

    render() {
        this.state.pagesCount = this.state.generatedContents.length;
        this.state.currentContent = this.state.generatedContents[this.state.currentPage];

        const { classes } = this.props;
        
        const steps = [
          {
            intro: 'Welcome to AnimoSched!',
          },
          {
            element: '#searchStep',
            intro: 'Use the course search to find available classes!',
            // position: 'right',
            // tooltipClass: 'myTooltipClass',
            // highlightClass: 'myHighlightClass',
          },
          {
            element: '#preferencesStep',
            intro: 'Setting your preferences allows us to generate the schedules that suit you best!',
          },
          {
            element: '#genschedStep',
            intro: 'Generate and save a schedule!',
          },
          {
            // element: '',
            // position: 'bottom-right-aligned',
            intro: 'Explore the site!',
          },
        ];

      return (
        <div style={!this.props.logged_in? sectionStyle : {}}>
          {this.props.menu('savedSchedules')}

          {this.state.dataReceived ? 
          <div className={"homepage"} style={this.props.logged_in ? {} : {display: "none"}}>
            <div className={"hasContent"} style={(this.state.generatedContents.length > 0) ? {} : {display: "none"}}>


            <Steps
              enabled={localStorage.getItem('steps') == 'true' && this.state.generatedContents.length <= 0}
              steps={steps}
              initialStep={0}
              onExit={this.tutorialDone}
              onComplete={this.tutorialDone}
            />
            <Grid container>
              <Grid item xs={12}>
                <br></br>
                    <Typography gutterBottom variant="h3" align="center">
                      SECOND TRIMESTER, AY 2019 - 2020
                    </Typography>
              </Grid>

              <Grid item xs={2}>
              </Grid>

              <Grid item xs={6} className={'gridSavedContent'}>
                <div id='savedContent' className='savedContent'>
                  {this.state.scheduleChanged ? 
                    <span>{this.state.currentContent}</span>
                  : 
                  <div style={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh"}}>
                    <ReactLoading type={'spin'} color={'#9BCFB8'} height={'5%'} width={'5%'}/>
                  </div>
                  }
                </div>
              </Grid>

              {/* <Grid item xs={1}>
              </Grid> */}
       
              <Grid item xs={4} align="center" justify="center" alignItems="center" alignContent="center" direction="column">
                <div class='optionList'>
                  <Grid item xs={1} direction="column" align="center">
                    <Button
                      variant="contained"
                      className={classes.buttonStyle}
                      endIcon={<DateRangeIcon/>}
                      onClick={this.toggleModalEdit}
                      >
                      Edit
                    </Button>
                      <Modal isOpen={this.state.openModalEdit} toggle={this.toggleModalEdit} returnFocusAfterClose={false} backdrop={true} data-keyboard="false" >
                        <ModalHeader toggle={this.toggleModalEdit}><h4>Edit Schedule</h4></ModalHeader>
                        <ModalBody>
                          <div className="searchBarEdit" >
                            <h5>Classes currently in this schedule:</h5>                              
                              {/* <h7>Your current classes</h7> */}
                              <div style={{display: "flex", justifyContent: "center", width: "-webkit-fill-available"}}>                              
                                <span style={{borderRadius: "4px", minHeight: "3.8em", width: "-webkit-fill-available"}} className={'edit-current-classes-container'}>
                                  {this.state.currentClasses.map((current, index) => (
                                    <Chip label={current.title} onDelete={() => this.handleDelete(index)} style={{marginBottom: "5px", marginRight: "5px"}}></Chip>
                                  ))}
                                </span>
                              </div>
                              <div style={{display: "flex", justifyContent: "center", width: "-webkit-fill-available", marginBottom: "15px"}}>
                                <ComboBox page={"edit"} value={this.state.newCurrentClasses} onChange={this.handleEditChange}></ComboBox>
                                  <Button
                                      variant="contained"
                                      color = "Primary"
                                      style={{backgroundColor: "green", color:"white", height:"56px"}}
                                      onClick={this.handleEditAdd}>
                                      <AddIcon fontSize="small"/>  
                                  </Button>
                              </div>
                          </div>
                        </ModalBody>
                      <ModalFooter>
                        <Button color="primary" onClick={this.handleEditSave}>Save Changes</Button>{' '}
                        <Button style={{color: "gray"}} onClick={this.toggleModalEdit}>Cancel</Button>
                      </ModalFooter>
                    </Modal>    
                  </Grid>
                  
                  <Grid item xs={1} direction="column" align="center">
                    <Button
                    variant="contained"
                    className={classes.buttonStyle}
                    onClick={this.handleOpenModalCustomize}
                    endIcon={<PaletteIcon/>}
                    >
                      Customize
                    </Button>
                    <Modal isOpen={this.state.openModalCustomize} toggle={this.toggleModal} returnFocusAfterClose={false} backdrop={true} data-keyboard="false">
                      <ModalHeader toggle={this.toggleModal}><h4>Customize Schedule</h4></ModalHeader>
                      <ModalBody>
                        {/* Select a class box color palette */}                  
                        <div>
                        <h5>Color Palette</h5>
                        <TextField
                            id="outlined-select-break"
                            select
                            label="Color Palette"
                            onChange={this.handlePaletteChange}
                            helperText="Choose a color palette for the class boxes in your schedule."
                            variant="outlined"
                            style={{width: "100%", marginTop: "10px", marginBottom: "25px"}}
                            value={this.state.chosenPalette}
                            maxRows="3"
                            autoWidth= {true}
                            >
                            
                            {/* <MenuItem key={1} value={"option.value"}>
                                {trycolor}
                            </MenuItem> */}
                                  
                            {this.state.paletteChoices.map((option) => (
                                <MenuItem key={option.title} value={option.paletteArray}>
                                {option.paletteDiv}
                                </MenuItem>
                                    ))}
                        </TextField>
                        </div>
                        
                        <h5>Class Box Details</h5>
                        <div>
                          <FormGroup>
                              <FormControlLabel
                              control = {<GreenCheckbox checked={this.state.classboxDetailsList[0].checked} onChange={this.handleClassBoxChange} id={this.state.classboxDetailsList[0].id} color="primary"/>}label="Show name of faculty" />
                              <FormControlLabel
                              control = {<GreenCheckbox checked={this.state.classboxDetailsList[1].checked} onChange={this.handleClassBoxChange} id={this.state.classboxDetailsList[1].id} color="primary"/>}label="Show start and end time" />
                              <FormControlLabel
                              control = {<GreenCheckbox checked={this.state.classboxDetailsList[2].checked} onChange={this.handleClassBoxChange} id={this.state.classboxDetailsList[2].id} color="primary"/>}label="Show room assigned" />
                          </FormGroup>
                        </div>
                      </ModalBody>
                    <ModalFooter>
                      <Button color="primary" onClick={this.handleCustomizeSave}>Save Changes</Button>{' '}
                      <Button style={{color: "gray"}}onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                  </Modal>    
                  </Grid>

                  <Grid item xs={1} direction="column" align="center">
                    <Button
                      variant="contained"
                      className={classes.buttonStyle}
                      onClick={this.exportSched}
                      endIcon={ <GetAppIcon/>}
                      >
                      Export
                    </Button>
                  </Grid>

                  <Grid item xs={1} direction="column" align="center">
                    <Button
                      variant="contained"
                      className={classes.deleteButtonStyle}
                      onClick={this.handleClickOpenAlert}
                      endIcon={<DeleteIcon/>}
                      >
                      Delete
                    </Button>
                      {this.state.currentContent != null ?
                      <Dialog
                        open={this.state.openAlert}
                        onClose={this.handleCloseAlert}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">{"Confirm Deletion of Schedule"}</DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Do you want to delete "{this.state.currentContent.props.titleName}" from your saved schedules?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.deleteSchedule} color="secondary" autoFocus>
                                Delete
                            </Button>
                            <Button onClick={this.handleCloseAlert} style={{color: "gray"}}>
                                Cancel
                            </Button>
                          
                        </DialogActions>
                      </Dialog>
                      : null }

                      <Snackbar open={this.state.snackBarVariables[0].snackBarSuccess} autoHideDuration={4000} onClose={(event, reason)=>this.handleCloseSnackBar(event, reason,0)}>
                        <Alert onClose={(event, reason)=>this.handleCloseSnackBar(event, reason, 0)} severity="success">
                          {this.state.snackbarMsg}{/* Your schedule has been successfully deleted! */}
                        </Alert>
                      </Snackbar>

                      <Snackbar open={this.state.snackBarVariables[1].snackBarFailed} autoHideDuration={4000} onClose={(event, reason)=>this.handleCloseSnackBar(event, reason, 1)}>
                        <Alert onClose={(event, reason)=>this.handleCloseSnackBar(event, reason, 1)} severity="error">
                        Delete failed
                        </Alert>
                      </Snackbar> 
                  </Grid>

                  </div>
              </Grid>

              <Grid item xs={12} justify="center" alignItems="center">
                <div id="viewCoursesHome" className = "paginationContainer" style={(this.state.generatedContents != null) ? {} : {display: "none"}}>
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
              </Grid>

            </Grid>

            </div> 
                          
                        
            <div className={"hasNoContent"} style={(this.state.generatedContents.length <= 0) ? {} : {display: "none"}}>
              <Typography gutterBottom variant="h4" align="center" style={{marginTop: "30px"}}>
                    You haven't made any schedules yet!
              </Typography>
              {/* Test A original */}
              {/* <center>
                  <a href="/preferences" style={{textDecoration: "none"}}>
                  <Button
                    variant="contained"
                    className={classes.prefbuttonStyle}
                    >
                    Set Schedule Preferences
                  </Button>
                </a>
              </center>
              <Typography gutterBottom variant="h5" align="center" style={{marginTop: "30px"}}>
                    or
              </Typography>
                <center>
                  <a href="/generateSchedule" style={{textDecoration: "none"}}>
                  <Button
                    variant="contained"
                    className={classes.buttonStyle}
                    >
                    Create Schedule
                  </Button>
                </a>
              </center> */}
            {/* Test B Big boi buttons */}
            <Typography gutterBottom variant="h5" align="center" style={{marginTop: "30px", marginBottom: "30px"}}>
                    Do you want to:
              </Typography>
            <Row horizontal='center' flexShrink={5}>
            <Column style={{marginLeft:"30px"}}>
                <a href="/search_courses" style={{textDecoration: "none"}}>
                    <Button
                      id="searchStep"
                      variant="contained"
                      className={classes.testbuttonStyle}
                      startIcon={<SearchIcon fontSize="large"/>}
                      size="large"
                      >
                      Search Classes
                    </Button>
                  </a>
              </Column>
              <Column style={{marginLeft:"30px"}}>
                <a href="/preferences" style={{textDecoration: "none"}}>
                    <Button
                      id="preferencesStep"
                      variant="contained"
                      className={classes.testbuttonStyle}
                      startIcon={<StarIcon fontSize="large"/>}
                      size="large"
                      >
                      Set Preferences
                    </Button>
                  </a>
              </Column>
              <Column style={{marginLeft:"30px"}}>
                <a href="/generateSchedule" style={{textDecoration: "none"}}>
                  <Button
                    id="genschedStep"
                    variant="contained"
                    className={classes.testbuttonStyle}
                    startIcon={<TodayIcon fontSize="large"/>}
                      size="large"
                    >
                    Create Schedule
                  </Button>
                </a>
              </Column>
            </Row>

            </div>

          </div>
          :
          <div style={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh"}}>
            <ReactLoading type={'spin'} color={'#9BCFB8'} height={'5%'} width={'5%'}/>
          </div>
          
          }

          <div className={"landingpage"} style={!this.props.logged_in? {height:"100%"} : {display: "none"}}>
          
          <img src={whiteBlob} className={"whiteBlob"}/>
          <Grid container spacing={3} style={{flexGrow: 1}}>
            <Grid item xs={12}>
            </Grid>
              <Grid item xs={12}>
            </Grid>
            <Grid item xs={6} style={{height:"100%"}}>
                  <Typography gutterBottom variant="h3" align="center">
                    Create your schedule!
                  </Typography>
            </Grid>
            <Grid item xs={6}>
            </Grid>
            <Grid item xs={1}>
            </Grid>
            <Grid item xs={1}>
              <img src={calendarIcon} className={"iconStyle"}/>
            </Grid>
            <Grid item xs={3}>
                          <Typography variant="body1" gutterBottom>
                            Enter your courses and select an automatically-generated schedule
                          </Typography>
            </Grid>
            <Grid item xs={4}>
            </Grid>
            <Grid item xs={2} style={{zIndex:"100"}}>
              {/* <center><button type="button" class="btn btn-success">Create Schedule</button></center> */}
              <center>
                <Button
                  variant="contained"
                  className={classes.buttonStyle}
                  onClick={this.goToSearchCourse}
                    style={{width: "210px"}}
                  >
                  Search Course Offerings
                </Button>
              </center>
            </Grid>
            <Grid item xs={1}>
            </Grid>
            <Grid item xs={1}>
            </Grid>
            <Grid item xs={1}>
              <img src={attachIcon} className={"iconStyle"}/>
            </Grid>
            <Grid item xs={3}>
                            <Typography variant="body1" gutterBottom>
                            Customize the look of your
                            schedule and save it as an image
                          </Typography>
            </Grid>
            <Grid item xs={4}>
            </Grid>
            <Grid item xs={2} style={{zIndex:"100"}}>
               <center>
                <Button
                  variant="contained"
                  className={classes.buttonStyle}
                  onClick={this.goToCreateSchedule}
                  style={{width: "210px"}}
                  // style={{backgroundColor: "green"}}
                  >
                  Create Schedule
                </Button>
              </center>
            </Grid>
            <Grid item xs={1}>
            </Grid>
            <Grid item xs={1}>
            </Grid>
            <Grid item xs={1}>
              <img src={laughIcon} className={"iconStyle"}/>
            </Grid>
        
            <Grid item xs={3}>
                            <Typography variant="body1" gutterBottom>
                            Share and compare schedules with your friends
                            {/* collaborate with friends
                            and create schedules
                            as a group. */}
                          </Typography>
            </Grid>
            <Grid item xs={4}>
            </Grid>
            <Grid item xs={2} style={{zIndex:"100"}}>
              {/* <center><button type="button" class="btn btn-success">Check Flowchart</button></center> */}
             
            </Grid>
            <Grid item xs={1}>
            </Grid>
          </Grid>
          {this.renderRedirect()}
          </div>
        </div>        
      );
    }
  }

  Index.propTypes={
  classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Index);