import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import '../css/CompareSchedule.css';

import Grid from '@material-ui/core/Grid';

import { Pagination, PaginationItem, PaginationLink} from 'reactstrap';

import SchedViewHome from '../components/SchedViewHome';
import axios from 'axios';
import groupArray from 'group-array'
import ReactLoading from 'react-loading';



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
      /*marginLeft: "5px",*/
    '&:hover': {
        color: "#d3d3d3"
      },
    },
  });

class CompareSchedule extends Component {
     constructor(props){
        super(props);

        this.state = {
            currentPageUser: 0,
            currentContentUser: "",
            generatedContentsUser: [],
            pagesCountUser: 1,
            currentPageFriend: 0,
            currentContentFriend: "",
            generatedContentsFriend: [],
            pagesCountFriend: 1,
            schedulesUser: [],
            schedulesFriend: [],
            dataReceived: false,
            friendName: "",
            matched: []
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

    createData(classNmbr, course, section, faculty, day, startTime, endTime, room, capacity, enrolled, compareMatch) {
      return { classNmbr, course, section, faculty, day, startTime, endTime, room, capacity, enrolled, compareMatch };
    }

    checkCompare(){
        var user = this.state.generatedContentsUser;
        var friend = this.state.generatedContentsFriend;
        for(var i = 0 ; i < user.length ; i++){
          for(var j = 0 ; j < friend.length ; j++){
            console.log(user)
            console.log(friend)
            var userContent = user[i].props.tableContent
            var friendContent = friend[j].props.tableContent
            var newMatched = [];
            for(var k = 0 ; k < userContent.length ; k++){
              for(var l = 0 ; l < friendContent.length ; l++){
                if(userContent[k].classNmbr == friendContent[l].classNmbr){
                  user[i].props.tableContent[k].compareMatch = true
                  friend[j].props.tableContent[l].compareMatch = true
                  newMatched.push(user[i].title);
                  
                  this.setState({generatedContentsUser: user})
                  this.setState({generatedContentsFriend: friend})
                  console.log(user)
                  console.log(friend)
                }else{
                  // user[i].props.tableContent.compareMatch = false
                  // friend[i].props.tableContent.compareMatch = false
                  // this.setState({generatedContentsUser: user})
                  // this.setState({generatedContentsFriend: friend})
                  // console.log("no hit")
                }
              }
            }
          }
        }
        console.log(newMatched);
        this.setState({matched: newMatched});
        this.state.currentContentUser.props = newMatched;
        this.state.currentContentFriend.props = newMatched;
        console.log(this.state.matched);
    }

    componentDidMount(){
      if(!this.state.dataReceived){
        axios.get('https://archerone-backend.herokuapp.com/api/schedulelist/'+localStorage.getItem('user_id')+'/')
        .then(res => {
            const schedules = []
            res.data.map(newSchedule =>{
                var count = 0;
                const scheduleContent = []
                const tableContent = []
                var matched = []
                var earliest = 9
                var latest = 17
                var arranged = groupArray(newSchedule.courseOfferings, 'classnumber');
                for (let key in arranged) {
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
                  const newTableContent = this.createData(classnumber, course, section, faculty, day, timeslot_begin, timeslot_end, room, max_enrolled, current_enrolled, false);
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
                schedules.push({
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
            this.setState({schedulesUser: schedules});
            axios.get('https://archerone-backend.herokuapp.com/api/schedulelist/'+this.props.params.id+'/')
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
                      const newTableContent = this.createData(classnumber, course, section, faculty, day, timeslot_begin, timeslot_end, room, max_enrolled, current_enrolled, false);
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
                    schedules.push({
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
                this.setState({schedulesFriend: schedules});
                this.setSchedInfo();
                this.setState({success: true});
                this.setState({loading: false});
                this.setState({dataReceived: true})
            }).catch(error => {
                console.log(error)
            })
            axios.get('https://archerone-backend.herokuapp.com/api/users/'+this.props.params.id+'/')
            .then(res => {
                this.setState({friendName: res.data.first_name})
            }).catch(error => {
                console.log(error)
            })
        }).catch(error => {
            console.log(error)
        })

      }
    }
    
    handlePageChange = (e,index, type) => {
        
        if(type == "user"){
            this.setState(state =>{
            var currentContentUser = state.generatedContentsUser[index];
            return {currentContentUser};
          });

          this.setState({currentPageUser: index});
          this.setState(state =>{
            var currentPageUser = index;
            return {currentPageUser};
          });
          console.log("pressed page " + index);
        }else if (type == "friend"){
            this.setState(state =>{
            var currentContentFriend = state.generatedContentsFriend[index];
            return {currentContentFriend};
          });

          this.setState({currentPageFriend: index});
          this.setState(state =>{
            var currentPageFriend = index;
            return {currentPageFriend};
          });
          console.log("pressed page " + index);
        }

  }
    
componentWillMount(){
    this.setState({pagesCountUser: this.state.generatedContentsUser.length});
    this.setState({pagesCountFriend: this.state.generatedContentsFriend.length});
    this.setState({currentContentUser: this.state.generatedContentsUser[this.state.currentPageUser]}, () => {
    });
    this.setState({currentContentFriend: this.state.generatedContentsFriend[this.state.currentPageFriend]}, () => {
    });
}

setSchedInfo = () => {
    const palette = JSON.parse(localStorage.getItem('palette'))
    
        console.log(this.state.schedulesUser)
         var generatedContentsUser = this.state.schedulesUser.map((item, index) =>
        <SchedViewHome key={item.id} id={item.id} offerings={item.offerings} tableContent={item.tableContent} scheduleContent={item.scheduleContent} titleName={item.title} allowEdit={this.state.allowEdit} palette={palette} matched={[]}/>
        );
        // this.setState({hideGenContent: false});

        console.log(this.state.schedulesFriend)
         var generatedContentsFriend = this.state.schedulesFriend.map((item, index) =>
        <SchedViewHome key={item.id} id={item.id} offerings={item.offerings} tableContent={item.tableContent} scheduleContent={item.scheduleContent} titleName={item.title} allowEdit={this.state.allowEdit} palette={palette} matched={[]}/>
        );
        // this.setState({hideGenContent: false});
        this.setState({generatedContentsFriend}, ()=>{
            this.setState({currentContentFriend: generatedContentsFriend[0]}, () => {
//                this.setState({hasSelectedFriend: true})
              console.log(this.state.currentContentFriend)

            })
            this.setState({pagesCountFriend: generatedContentsFriend.length});
            this.setState({currentPageFriend: 0})
         });
        this.setState({generatedContentsUser}, ()=>{
            this.setState({currentContentUser: generatedContentsUser[0]}, () => {
//                this.setState({hasSelectedFriend: true})
              console.log(this.state.currentContentUser)

            })
            this.setState({pagesCountUser: generatedContentsUser.length});
            this.setState({currentPageUser: 0})
        });

        var user = this.state.generatedContentsUser;
        var friend = this.state.generatedContentsFriend;
        var newMatched = [];
        for(var i = 0 ; i < user.length ; i++){
          for(var j = 0 ; j < friend.length ; j++){
            console.log(user)
            console.log(friend)
            var userContent = user[i].props.tableContent
            var friendContent = friend[j].props.tableContent
            var newMatched = [];
            for(var k = 0 ; k < userContent.length ; k++){
              for(var l = 0 ; l < friendContent.length ; l++){
                if(userContent[k].classNmbr == friendContent[l].classNmbr){
                  user[i].props.tableContent[k].compareMatch = true
                  friend[j].props.tableContent[l].compareMatch = true
                  // user[i].props.matched
                  // friend[j].props.matched
                  user[i].props.matched.push(userContent[k].course + ' ' + userContent[k].section);
                  friend[i].props.matched.push(userContent[k].course + ' ' + userContent[k].section);
                  console.log(user)
                  console.log(friend)
                 
                }else{
                  // user[i].props.tableContent.compareMatch = false
                  // friend[i].props.tableContent.compareMatch = false
                  // this.setState({generatedContentsUser: user})
                  // this.setState({generatedContentsFriend: friend})
                  // console.log("no hit")
                }
              }
            }
          }
        }
        this.setState({generatedContentsUser: user})
        this.setState({generatedContentsFriend: friend})
        console.log(newMatched);

  }
    
    render() {

        
        const { classes } = this.props; 
        return (  
            <div>
                <div class="header" style={{backgroundColor: "#006A4E", padding:"10px"}}>
                    <a className="backBtn" href="/view_friends">
                    <div className={"backBtn"} style={{marginTop: "5px"}}></div>
                    <ArrowBackIosIcon fontSize="large"className={classes.backBtn} viewBox="0 0 1 24"/> <span className="backBtn">Back</span>
                    </a>
                    <div style={{color:"white"}}>
                        <center><h5 >SECOND TRIMESTER, AY 2019 - 2020</h5></center>
                    </div>
                    {/* <img class='img-responsive' id='lower' src={SidebarIMG}/> */}
                </div>

                {this.state.dataReceived ?
                <div>
                     <Grid container style={{marginTop: "30px"}}>
                          <Grid item xs={6}>

                           <center><h6>Your Schedule</h6></center>
                            <div className={"scheduleContent"}>
                                  <center><span>{this.state.currentContentUser}</span></center>
                            </div>
                         
                              <div className = "paginationContainer" style={(this.state.generatedContentsUser != null) ? {} : {display: "none"}}>
                                  <Pagination aria-label="Page navigation example" style={{justifyContent: "center"}}>
                                      <PaginationItem disabled={this.state.currentPageUser <= 0}>
                                          <PaginationLink onClick={e => this.handlePageChange(e, this.state.currentPageUser - 1, "user")}
                                              previous/>
                                      </PaginationItem>
                                      {[...Array(this.state.pagesCountUser)].map((page, i) => 
                                          <PaginationItem active={i === this.state.currentPageUser} key={i} className={'paginationItemStyle'}>
                                              <PaginationLink onClick={e => this.handlePageChange(e, i, "user")} className={'paginationLinkStyle'}>
                                              {i + 1}
                                              </PaginationLink>
                                          </PaginationItem>
                                          )}
                                      <PaginationItem disabled={this.state.currentPageUser >= this.state.generatedContentsUser.length - 1}>
                                          <PaginationLink
                                              onClick={e => this.handlePageChange(e, this.state.currentPageUser + 1, "user")}
                                              next
                                          />

                                          </PaginationItem>
                                  </Pagination>
                            </div>
                          </Grid>
                          <Grid item xs={6}>
  
                            <center><h6>{this.state.friendName}'s Schedule</h6></center>
                            <div className={"scheduleContent"}>
                                <center><span>{this.state.currentContentFriend}</span></center>
                            </div>
                            
                            <div className = "paginationContainer" style={(this.state.generatedContentsFriend != null) ? {} : {display: "none"}}>
                              <Pagination aria-label="Page navigation example" style={{justifyContent: "center"}}>
                                  <PaginationItem disabled={this.state.currentPageFriend <= 0}>
                                      <PaginationLink onClick={e => this.handlePageChange(e, this.state.currentPageFriend - 1, "friend")}
                                          previous/>
                                  </PaginationItem>
                                  {[...Array(this.state.pagesCountFriend)].map((page, i) => 
                                      <PaginationItem active={i === this.state.currentPageFriend} key={i} className={'paginationItemStyle'}>
                                          <PaginationLink onClick={e => this.handlePageChange(e, i, "friend")} className={'paginationLinkStyle'}>
                                          {i + 1}
                                          </PaginationLink>
                                      </PaginationItem>
                                      )}
                                  <PaginationItem disabled={this.state.currentPageFriend >= this.state.generatedContentsFriend.length - 1}>
                                      <PaginationLink
                                          onClick={e => this.handlePageChange(e, this.state.currentPageFriend + 1, "friend")}
                                          next
                                      />

                                      </PaginationItem>
                              </Pagination>
                            </div>
                      
                          </Grid>
                      </Grid>
                </div>
                : 
                  <div style={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh"}}>
                    <ReactLoading type={'spin'} color={'#9BCFB8'} height={'5%'} width={'5%'}/>
                  </div>
                }

            </div>
        );
    }
}

CompareSchedule.propTypes={
    classes: PropTypes.object.isRequired,
  };
    export default withStyles(styles)(CompareSchedule);