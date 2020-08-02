import React, { Component } from "react";
import '../css/Flowchart.css';
import SidebarIMG from '../images/Login.svg';
import Menu from '../components/Menu.jsx';

import { Flowpoint, Flowspace } from 'flowpoints';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import ReactLoading from 'react-loading';

import Button from '@material-ui/core/Button';
import GetAppIcon from '@material-ui/icons/GetApp';
import html2canvas from 'html2canvas';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { Chip } from "@material-ui/core";

import Grid from '@material-ui/core/Grid';
import { Pagination, PaginationItem, PaginationLink} from 'reactstrap';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const styles = theme => ({
  flowchartText:{
      overflow: 'hidden',
      textOverflow: "ellipsis",
      textAlign: "center",
      fontSize: "0.7rem",
      // color: "green", 
      '&:hover': {
          color: "green"
        },
  },
    buttonStyle:{
        fontSize: "95%",
      textTransform: "none",
      width: "10%",
      borderRadius: "25px",
//      padding: "10px",
      paddingLeft: "5%",
      paddingRight: "5%",
      backgroundColor: "#16775D",
      border: "none",
      color: "white",
      boxShadow: "6px 5px #e8f4ea",
      borderStyle: "solid",
      borderColor: "#16775D",
//      marginTop: "20px",
      justifyContent: 'center',
      '&:hover': {
          backgroundColor: "white",
          color: "#16775D"
        },
    },
     buttonStyleOption:{
      textTransform: "none",
      width: "55%",
      borderRadius: "25px",
//      padding: "10px",
      paddingLeft: "5%",
      paddingRight: "3%",
      backgroundColor: "white",
        border: "solid 2px #16775D",
      color: "#16775D",
      boxShadow: "6px 5px #e8f4ea",
      borderStyle: "solid",
      borderColor: "#16775D",
//      marginTop: "20px",
      justifyContent: 'center',
      '&:hover': {
          
          backgroundColor: "#16775D",
          border: "none",
          color: "white",
        },
    }
});

class Flowchart extends Component {
    constructor(props){
      super(props);
      this.state = {
        terms: [],
        courses: [],
        flowpoints: [],
        degreekey: '1',
        batchkey: '116',
        dataReceived: false,
        snackbar: false,
        currentPage: 0,
        currentContent: "",
        generatedContents: [],
        pagesCount: 1,
        pagesEnabled: true,
      }
    }

    componentDidMount() {
      // const degreekey = '1';
      // const batchkey = '116';
      axios.get('https://archerone-backend.herokuapp.com/api/flowcharttermslist/'+this.state.degreekey+'/'+this.state.batchkey+'/')
      .then(res => {
        res.data.map((term, i) => {
                var coursesList = this.state.courses;
                var flowpointsList = this.state.flowpoints;
                var newTerm = {'id':term.id, 'degree':term.degree, 'batch': term.batch, 'courses': term.courses, 'tracks': term.tracks, 'year': term.year, 'term': term.term} 
                var currentTerm = term.term + 3 * (term.year - 1);
                var tracks = newTerm.tracks.split(',');
                var tempCoursesList = [];
                term.courses.map((course, j) => {
                  var tempCourse = course;
                  tempCourse.year = term.year;
                  tempCourse.term = term.term;
                  tempCourse.prerequisites = [];
                  tempCourse.softPrerequisites = [];
                  tempCourse.corequisites = [];
                  // console.log(tempCourse);
                  // var outputsList = {};
                  coursesList.push(tempCourse);
                  tempCoursesList.push(tempCourse);
                  // course.prerequisite_to.map((prereq_to) => {
                  //   outputsList[prereq_to] = { output: "right", input: "left" }                    
                  // })            
                  // flowpointsList.push({'key': course.id, 'name': course.course_code, 'units': course.units, 'startPosition': { x:(currentTerm-1)*85, y:tracks[j]*45 }, 'width': 70, 'height': 40, 'dragX': false, 'dragY': false, 'outputs': outputsList, 'year': term.year, 'term': term.term});
                })
                
                tempCoursesList.sort(function(a, b) {
                  var keyA = new String(a.course_code),
                    keyB = new String(b.course_code);
                  if (keyA < keyB) return -1;
                  if (keyA > keyB) return 1;
                  return 0;
                });

                coursesList.sort(function (a, b) {
                  if(a.year == b.year) {
                    if(a.term == b.term) {
                      return (a.units < b.units) ? 1 : -1;
                    }
                    else {                    
                      return (a.term > b.term) ? 1 : -1;
                    }
                  }
                  else {
                      return (a.year > b.year) ? 1 : -1;
                  }
                });

                for(var k = 0; k < tempCoursesList.length; k++) {
                  var outputsList = {};
                  tempCoursesList[k].prerequisite_to.map((prereq_to) => {
                    outputsList[prereq_to] = { output: "right", input: "left", inputColor: "#16775d", outputColor: "#16775d" }
                  })
                  tempCoursesList[k].soft_prerequisite_to.map((prereq_to) => {
                    outputsList[prereq_to] = { output: "right", input: "left", inputColor: "#16775d", outputColor: "#16775d", dash: "3" }                    
                  })
                  tempCoursesList[k].co_requisite.map((coreq) => {
                    outputsList[coreq] = { output: "auto", input: "auto", inputColor: "#16775d", outputColor: "#16775d"}                    
                  })
                  flowpointsList.push({'key': tempCoursesList[k].id, 'name': tempCoursesList[k].course_code, 'units': tempCoursesList[k].units, 'startPosition': { x:(currentTerm-1)*85, y:tracks[k]*50 }, 'width': 70, 'height': 40, 'dragX': false, 'dragY': false, 'outputs': outputsList, 'year': term.year, 'term': term.term});
                }
                
                var tempTerm = {'year': term.year, 'term':term.term, 'courses':[]};
                this.state.terms.push(tempTerm);

                this.setState({courses: coursesList})
                this.setState({flowpoints: flowpointsList})
        })

        for(var k = 0; k < this.state.courses.length; k++) {
          this.state.courses[k].prerequisite_to.map((prereq_to) => {
            var tempCourse = this.state.courses.findIndex(course => (course.id).toString() === prereq_to.toString());
            if(tempCourse != -1) {
              this.state.courses[tempCourse].prerequisites.push(this.state.courses[k]);
            }
          })
          this.state.courses[k].soft_prerequisite_to.map((prereq_to) => {
            var tempCourse = this.state.courses.findIndex(course => (course.id).toString() === prereq_to.toString());
            if(tempCourse != -1) {
              this.state.courses[tempCourse].softPrerequisites.push(this.state.courses[k]);
            }
          })
          this.state.courses[k].co_requisite.map((prereq_to) => {
            var tempCourse = this.state.courses.findIndex(course => (course.id).toString() === prereq_to.toString());
            if(tempCourse != -1) {
              this.state.courses[tempCourse].corequisites.push(this.state.courses[k]);
            }
          })
        }

        this.state.terms.sort(function (a, b) {
          if(a.year == b.year) {
            return (a.term > b.term) ? 1 : -1;
          }
          else {
              return (a.year > b.year) ? 1 : -1;
          }
        });

        for(var k = 0; k < this.state.courses.length; k++) {
          var tempTerm = this.state.terms.findIndex(term => ((term.year === this.state.courses[k].year) && (term.term === this.state.courses[k].term)));
          this.state.terms[tempTerm].courses.push(this.state.courses[k]);
        }
        console.log(this.state.terms);

        this.setFlowchartTables();
        this.setState({currentPage: 0})
        this.setState({currentContent: this.state.generatedContents[0]});
        this.setState({dataReceived: true})
      })
    }

    componentDidUpdate(prevProp, prevState) {
      if(prevState.currentPage != this.state.currentPage){    
        console.log("blah");
        this.setState({currentContent: this.state.generatedContents[this.state.currentPage]});
        this.handleScrollToGen();
      }     
    }

    exportFlowchart = () => {
        window.scrollTo(0, 0);
        html2canvas(document.querySelector("#flowchart-area")).then(canvas => {
    //      document.location.href = canvas.toDataURL().replace('image/png', 'image/octet-stream');
            var filename = "flowchart" + ".png";
            this.saveAs(canvas.toDataURL(), filename); 
        });
        
        this.setState({snackbar: true});

//        let snackBarVariables = [...this.state.snackBarVariables];
//        this.setState({snackbarMsg: "Your schedule image is downloading!"});
//        snackBarVariables[0].snackBarSuccess = true;
        // snackBarVariables[1].snackBarFailed = true;
//        this.setState({snackBarVariables});
//        console.log(snackBarVariables);
      }
    
      exportFlowchartTable = () => {
            window.scrollTo(0, 0);
            html2canvas(document.querySelector("#flowchart-table-area")).then(canvas => {
        //      document.location.href = canvas.toDataURL().replace('image/png', 'image/octet-stream');
                var filename = "flowchart" + ".png";
                this.saveAs(canvas.toDataURL(), filename); 
            });
              
              this.setState({snackbar: true});
        }

    setFlowchartTables = () => {
      const StyledTableCell = withStyles(theme => ({
        head: {
          backgroundColor: '#006A4E',
          color: theme.palette.common.white,
        },
        body: {
          fontSize: 12,
          // borderBottom: "1px solid white",
        },
      }))(TableCell);

      const StyledTableRow = withStyles(theme => ({
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
          },
        },
      }))(TableRow);

      if(this.state.terms.length > 0) {
        var generatedContents = this.state.terms.map((term) =>
        <TableContainer component={Paper}>
        <center><div class="header-table-term"><h3>YEAR {term.year}, TERM {term.term}</h3></div></center>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {/* <StyledTableCell> Year </StyledTableCell>
                <StyledTableCell> Term </StyledTableCell> */}
                <StyledTableCell> Code </StyledTableCell>
                <StyledTableCell style={{width: "20em"}}> Title </StyledTableCell>
                <StyledTableCell> Units </StyledTableCell>
                <StyledTableCell> Prerequisites and Corequisites </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {term.courses.map((row) => (                                  
                <StyledTableRow key={row.course_name} style={{color: "#006600", height: '30px'}}>
                  {/* <StyledTableCell style={{color: "#006600"}}> {row.year} </StyledTableCell>
                  <StyledTableCell style={{color: "#006600"}}> {row.term} </StyledTableCell> */}
                  <StyledTableCell style={{color: "#006600"}}> {row.course_code} </StyledTableCell>
                  <StyledTableCell style={{color: "#006600"}}> {row.course_name} </StyledTableCell>
                  <StyledTableCell style={{color: "#006600"}}> {row.units} </StyledTableCell>
                  <StyledTableCell style={{color: "#006600"}}>                                
                    {row.prerequisites.map((prereq) => (
                      <Chip label={prereq.course_code} style={{width: '8em', height: '25px', borderStyle: 'solid', borderWidth: '2px', borderColor: 'lightgray'}} size="medium"></Chip>
                    ))}                                
                    {row.softPrerequisites.map((prereq) => (
                        <Chip label={prereq.course_code} style={{width: '8em', height: '25px', borderStyle: 'dotted', borderWidth: '2px', borderColor: 'grey'}} size="medium"></Chip>
                    ))}                                
                    {row.corequisites.map((prereq) => (
                        <Chip label={prereq.course_code} style={{width: '8em', height: '25px', backgroundColor: '#c7ebd1', borderStyle: 'solid', borderWidth: '2px', borderColor: 'gainsboro'}} size="medium"></Chip>
                    ))}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        );

        this.setState({generatedContents: generatedContents});
        this.setState({pagesCount: generatedContents.length});
        console.log("created stuff");
        // this.setState({currentPage: 0})
        // this.setState({currentContent: generatedContents[0]});
      }
    }

    handlePageChange = (e, index) => {
      this.setState({currentContent: ""});
      // this.setState({currentContent: this.state.generatedContents[index]});      
      // this.setState(state =>{
      //     var currentContent = state.generatedContents[index];
      //     return {currentContent};
      // });
      this.setState({currentPage: index});
      // this.setState(state =>{
      //   var currentPage = index;
      //   return {currentPage};
      // });

      console.log("soy");
      // console.log(this.state.currentPage);
      // console.log(this.state.currentContent);

      // this.handleScrollToGen();
    }
    
    handleScrollToGen = () => {
      window.scrollTo({top: 0, behavior: 'smooth'});
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

    handleCloseBar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      this.setState({snackbar: false});
    }

    onChangePagesEnabled(event) {
      this.setState({pagesEnabled: false});
    }

    render() {
      const { classes } = this.props;
        
      const StyledTableCell = withStyles(theme => ({
        head: {
          backgroundColor: '#006A4E',
          color: theme.palette.common.white,
        },
        body: {
          fontSize: 12,
          // borderBottom: "1px solid white",
        },
      }))(TableCell);

      const StyledTableRow = withStyles(theme => ({
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
          },
        },
      }))(TableRow);

      const coursesProcessing = this.state.courses;
      const termsProcessing = this.state.terms;

      return (
        <div>
            {this.props.menu('flowchart')}

            {this.state.dataReceived ? 
            <div>
               {/*<div class="sidemenu" >
                  <center>*/}
                      {/*<Button
                      variant="contained"
                      className={classes.buttonStyleOption}
                         // style={{display:"none", width: "0%", margin: "none"}}
                      >
                      CSS 116 CS
                    </Button>*/}
                      {/* <input type="submit" class="btn btn-success change-flowchart" value="CCS 116 CS" />
                  </center>*/}
                  {/* <center><input type="submit" class="btn btn-success change-flowchart" value="ID Number, Course" /></center> */}
                  {/* <center><input type="submit" class="btn btn-success change-flowchart" value="ID Number, Course" /></center> */}
               {/*</div>*/}

              <div class="sidemenu-main-flow">
                <br/>
                  <center><h2 style={{width: "80%"}}>YOUR FLOWCHART</h2></center>
                  <center><h3>CCS 116 CS</h3></center>

                  <Tabs defaultActiveKey="visual" id="uncontrolled-tab-example">
                    <Tab eventKey="visual" title="Visual">
                      <div class="tabArea">
                        <center>
                          <Button
                            variant="contained"
                            className={classes.buttonStyle}
                            onClick={this.exportFlowchart}
                            endIcon={ <GetAppIcon/>}
                            >
                            Export
                          </Button>
                        </center>
                        <Snackbar open={this.state.snackbar} autoHideDuration={4000} onClose={this.handleCloseBar}>
                          <Alert onClose={this.handleCloseBar} severity="success">
                          Your flowchart image is downloading!
                          </Alert>
                        </Snackbar>
                        <div class="flowchart-area" id="flowchart-area">                          
                          <div class="legendArea">
                            <div class="header"><h5>Legend</h5></div>
                              <div class="legendEntryFlowchart"><div class="flowchartLegendLine"><hr style={{borderColor: "#16775d", borderWidth: "2px"}}></hr></div><div class="flowchartLegendText">Prerequisite or corequisite</div></div>
                              <div class="legendEntryFlowchart"><div class="flowchartLegendLine"><hr style={{borderColor: "#16775d", borderWidth: "1px", borderStyle: "dashed"}}></hr></div><div class="flowchartLegendText">Soft prerequisite</div></div>
                          </div>
                          <div class="flowchart-header-parent">
                            <div class="header-year-parent">
                              <div class="header-year">Year 1</div>
                              <div class="header-term-parent">
                                <div class="header-term">Term 1</div>
                                <div class="header-term">Term 2</div>
                                <div class="header-term">Term 3</div>
                              </div>
                            </div>
                            <div class="header-year-parent">
                              <div class="header-year">Year 2</div>
                              <div class="header-term-parent">
                                <div class="header-term">Term 1</div>
                                <div class="header-term">Term 2</div>
                                <div class="header-term">Term 3</div>
                              </div>
                            </div>
                            <div class="header-year-parent">
                              <div class="header-year">Year 3</div>
                              <div class="header-term-parent">
                                <div class="header-term">Term 1</div>
                                <div class="header-term">Term 2</div>
                                <div class="header-term">Term 3</div>
                              </div>
                            </div>
                            <div class="header-year-parent">
                              <div class="header-year">Year 4</div>
                              <div class="header-term-parent">
                                <div class="header-term">Term 1</div>
                                <div class="header-term">Term 2</div>
                                <div class="header-term">Term 3</div>
                              </div>
                            </div>
                          </div>
                            <Flowspace theme="green" variant="paper" background="white" connectionSize="2" style={{ overflow: 'hidden', height:"100%", width:"100",}}>
                              {
                                Object.keys(this.state.flowpoints).map(key => {
                                  const point = this.state.flowpoints[key]
                                  return (
                                    <Flowpoint
                                      key={point.key}
                                      startPosition={point.startPosition} 
                                      width={point.width} 
                                      height={point.height} 
                                      dragX={point.dragX} 
                                      dragY={point.dragY} 
                                      outputs={point.outputs}>
                                      <div className={classes.flowchartText}>{point.name}<br />{point.units}</div>
                                    </Flowpoint>

                                    // <Flowpoint
                                    //   key={key}
                                    //   startPosition={point.pos}
                                    //   onClick={() => {
                                    //     var selected_point = this.state.selected_point
                                    //     if (selected_point === key) {
                                    //       selected_point = null
                                    //     } else {
                                    //       selected_point = key
                                    //     }
                                    //     this.setState({selected_point})
                                    //   }}
                                    //   onDrag={position => {
                                    //     var flowpoints = this.state.flowpoints
                                    //     flowpoints[key].position = position
                                    //     this.setState({flowpoints})
                                    //   }}>                                
                                    // </Flowpoint>
                                  )
                                })
                              }
                          </Flowspace>
                        </div>
                    </div>
                  </Tab>
                  <Tab eventKey="table" title="Table">
                    <div class="tabArea">
                    <center>
                      <Button
                        variant="contained"
                        className={classes.buttonStyle}
                        onClick={this.exportFlowchartTable}
                        endIcon={ <GetAppIcon/>}
                        >
                        Export
                      </Button>
                    </center>
                    <Snackbar open={this.state.snackbar} autoHideDuration={4000} onClose={this.handleCloseBar}>
                      <Alert onClose={this.handleCloseBar} severity="success">
                      Your flowchart image is downloading!
                      </Alert>
                    </Snackbar>

                    {/* <div class="flowchart-table-options" onChange={this.onChangePagesEnabled}>
                        <input type="radio" name="pages" 
                                      value="true" /> Page view
                        <input type="radio" name="pages" 
                                      value="false"/> Consolidated view
                    </div> */}

                    <div class="flowchart-table-area" id="flowchart-table-area">
                    <div class="legendArea">
                      <div class="header"><h5>Legend</h5></div>
                        <div class="legendEntry"><Chip style={{width: '25px', height: '25px', borderRadius: "50%", borderStyle: 'solid', borderWidth: '2px', borderColor: 'lightgray'}} size="medium"></Chip> Prerequisite</div>
                        <div class="legendEntry"><Chip style={{width: '25px', height: '25px', borderRadius: "50%", borderStyle: 'dotted', borderWidth: '2px', borderColor: 'grey'}} size="medium"></Chip> Soft prerequisite</div>
                        <div class="legendEntry"><Chip style={{width: '25px', height: '25px', borderRadius: "50%", backgroundColor: '#c7ebd1', borderStyle: 'solid', borderWidth: '2px', borderColor: 'gainsboro'}} size="medium"></Chip> Corerequisite</div>
                    </div>                    
                    <span style={(this.state.pagesEnabled === true) ? {} : {display: "none"}}>{this.state.currentContent}</span>

                    {/* {termsProcessing.map((term) => (    
                      <TableContainer component={Paper}>
                      <center><div class="header-table-term"><h3>YEAR {term.year}, TERM {term.term}</h3></div></center>
                        <Table aria-label="customized table">
                          <TableHead>
                            <TableRow>
                              <StyledTableCell> Code </StyledTableCell>
                              <StyledTableCell style={{width: "20em"}}> Title </StyledTableCell>
                              <StyledTableCell> Units </StyledTableCell>
                              <StyledTableCell> Prerequisites and Corequisites </StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {term.courses.map((row) => (                                  
                              <StyledTableRow key={row.course_name} style={{color: "#006600", height: '30px'}}>
                                <StyledTableCell style={{color: "#006600"}}> {row.course_code} </StyledTableCell>
                                <StyledTableCell style={{color: "#006600"}}> {row.course_name} </StyledTableCell>
                                <StyledTableCell style={{color: "#006600"}}> {row.units} </StyledTableCell>
                                <StyledTableCell style={{color: "#006600"}}>                                
                                  {row.prerequisites.map((prereq) => (
                                    <Chip label={prereq.course_code} style={{width: '8em', height: '25px', borderStyle: 'solid', borderWidth: '2px', borderColor: 'lightgray'}} size="medium"></Chip>
                                  ))}                                
                                  {row.softPrerequisites.map((prereq) => (
                                      <Chip label={prereq.course_code} style={{width: '8em', height: '25px', borderStyle: 'dotted', borderWidth: '2px', borderColor: 'grey'}} size="medium"></Chip>
                                  ))}                                
                                  {row.corequisites.map((prereq) => (
                                      <Chip label={prereq.course_code} style={{width: '8em', height: '25px', backgroundColor: '#c7ebd1', borderStyle: 'solid', borderWidth: '2px', borderColor: 'gainsboro'}} size="medium"></Chip>
                                  ))}
                                </StyledTableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ))} */}

                    {/* <TableContainer component={Paper}>
                      <Table aria-label="customized table">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell> Year </StyledTableCell>
                            <StyledTableCell> Term </StyledTableCell>
                            <StyledTableCell> Code </StyledTableCell>
                            <StyledTableCell> Title </StyledTableCell>
                            <StyledTableCell> Units </StyledTableCell>
                            <StyledTableCell> Prerequisites and Corequisites </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {coursesProcessing.map((row) => (                                  
                            <StyledTableRow key={row.course_name} style={{color: "#006600", height: '30px'}}>
                              <StyledTableCell style={{color: "#006600"}}> {row.year} </StyledTableCell>
                              <StyledTableCell style={{color: "#006600"}}> {row.term} </StyledTableCell>
                              <StyledTableCell style={{color: "#006600"}}> {row.course_code} </StyledTableCell>
                              <StyledTableCell style={{color: "#006600"}}> {row.course_name} </StyledTableCell>
                              <StyledTableCell style={{color: "#006600"}}> {row.units} </StyledTableCell>
                              <StyledTableCell style={{color: "#006600"}}>                                
                                {row.prerequisites.map((prereq) => (
                                  <Chip label={prereq.course_code} style={{width: '8em', height: '25px', borderStyle: 'solid', borderWidth: '2px', borderColor: 'lightgray'}} size="medium"></Chip>
                                ))}                                
                                {row.softPrerequisites.map((prereq) => (
                                    <Chip label={prereq.course_code} style={{width: '8em', height: '25px', borderStyle: 'dotted', borderWidth: '2px', borderColor: 'grey'}} size="medium"></Chip>
                                ))}                                
                                {row.corequisites.map((prereq) => (
                                    <Chip label={prereq.course_code} style={{width: '8em', height: '25px', backgroundColor: '#c7ebd1', borderStyle: 'solid', borderWidth: '2px', borderColor: 'gainsboro'}} size="medium"></Chip>
                                ))}
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer> */}
                    </div>
                    
                    <Grid item xs={12} justify="center" alignItems="center">
                      <div className = "paginationContainer" style={(this.state.generatedContents != null) ? {} : {display: "none"}}>
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
                    </div>
                  </Tab>
                  </Tabs>
              </div>
                <div class="sideRight" >
                </div>
                  {/*
                <div class="exportmenu" >
                  <center><Button
                      variant="contained"
                      className={classes.buttonStyle}
                      onClick={this.exportSched}
                      endIcon={ <GetAppIcon/>}
                      >
                      Export
                    </Button></center>
                    <Snackbar open={this.state.snackbar} autoHideDuration={4000} onClose={this.handleCloseBar}>
                    <Alert onClose={this.handleCloseBar} severity="success">
                    Your flowchart image is downloading!
                    </Alert>
                </Snackbar>
                </div>*/}
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

  Flowchart.propTypes={
    classes: PropTypes.object.isRequired,
  };
  export default withStyles(styles)(Flowchart);