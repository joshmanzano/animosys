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
import Grid from '@material-ui/core/Grid';
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
import { TextField } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

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
        selectedCourses: [],
        loading: false,
        radioVal: 'all',
        dataReceived: false,
        skeletons: [...Array(2).keys()],
        rowStyle: "",
        openModalCourseInfo: false,
        showPlaceholder: true,
        applyPreference: false,
        searchedCourse: '',
        toAdd: [],
        added: [],
        addedNums: [],
        snackBar: false,
        snackBarText: '',
        idnum: localStorage.getItem('idnum'),
        name: localStorage.getItem('name'),
        openModal: false
      }
      this.radioRef = React.createRef()

    }

    componentDidMount(){
        this.setState({dataReceived: true})
        this.setState({openModal: this.state.idnum == null}, () => {
          console.log('hello there')
          console.log(this.state.openModal)
        })
        const newAll = []
        const toAdd = JSON.parse(localStorage.getItem('toAdd'))
        if(toAdd != undefined){
          this.setState({toAdd}, () => {
              toAdd.map(c => {
                this.searchCourses(c)
                newAll.push(c)
              })
          })
        }
        const added = JSON.parse(localStorage.getItem('added'))
        if(added != undefined){
          this.setState({added}, () => {
              added.map(c => {
                newAll.push(c.classNmbr)
                console.log(c)
              })
          })
        }
        this.setState({allAdd: newAll})
    }

    handleCloseSnackBar = () => {
      this.setState({snackBar: false})
    }
    createData(classNmbr, course, section, faculty, day, startTime, endTime, room, capacity, enrolled) {
      return { classNmbr, course, section, faculty, day, startTime, endTime, room, capacity, enrolled };
    }

    handleChange = (field, e) => {
      let fields = this.state.fields;
      fields[field] = e.target.value;
      this.setState({fields});
    }

    enlistCourses = (c) =>{
      //start loading
        this.setState({loading: true})
        // this.setState({siteData: []})
        axios.get('https://archerone-backend.herokuapp.com/api/getclass/'+c+'/')
        .then(res => {
            const newSiteData = this.state.siteData; 
            const toAdd = this.state.toAdd;
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

                if(!(this.state.toAdd.includes(Number(classnumber)))){
                  toAdd.push(classnumber)
                }
                newSiteData.push(offering);
              }
            })
          this.setState({added: newSiteData},() => {
            this.setState({loading: false});
            console.log(this.state.toAdd)
          })
          //Finish Loading
        }).catch(err => {
          console.log(err.response)
          this.setState({loading: false});
        })

    }

    searchCourses = (c) =>{
      //start loading


        this.setState({loading: true})
        // this.setState({siteData: []})
        axios.get('https://archerone-backend.herokuapp.com/api/getclass/'+c+'/')
        .then(res => {
            const newSiteData = this.state.siteData; 
            const toAdd = this.state.toAdd;
            const newAll = this.state.allAdd;
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

                if(!(this.state.toAdd.includes(Number(classnumber)))){
                  toAdd.push(classnumber)
                  newAll.push(classnumber)
                  axios.post('https://archerone-backend.herokuapp.com/api/addcart/', {
                    classnumber,
                    idnum: this.state.idnum,
                    name: this.state.name,
                  }).then(res => {
                  }).catch(err => {
                    console.log(err.response)
                  })
                }
                newSiteData.push(offering);
              }
            })
          this.setState({siteData: newSiteData, toAdd: toAdd, allAdd: newAll},() => {
            this.setState({loading: false});
            localStorage.setItem('toAdd', JSON.stringify(toAdd))
            console.log(this.state.toAdd)
          })
          //Finish Loading
        }).catch(err => {
          console.log(err.response)
          this.setState({loading: false});
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

    clearButton = () => {
      this.setState({searchedCourse: ''})

    }

    searchButton = () => {

      if(!(this.state.toAdd.includes(Number(this.state.searchedCourse)))){
        this.searchCourses(this.state.searchedCourse)
      }

      this.setState({searchedCourse: ''})

    }

    // enlistButton = () => {
    //     this.setState({loading: true})
    //     var addedNums = this.state.addedNums
    //     var removeNums = []
    //     this.state.toAdd.map(add => {
    //       addedNums = this.state.addedNums
    //       addedNums.push(add.classNmbr)
    //       axios.post('https://archerone-backend.herokuapp.com/api/checkconflicts/', {
    //         classnumbers: addedNums,
    //         idnum: this.state.idnum 
    //       })
    //       .then(res => {
    //         if(res.data){
    //           console.log("true")
    //           removeNums.append(add.classNmbr)
    //           const newAdded = this.state.siteData
    //           this.state.added.map(a => {
    //             newAdded.push(a)
    //           })
    //           this.setState({added: newAdded, addedNums}, () => {
    //             localStorage.setItem('added', JSON.stringify(newAdded))
    //             // this.setState({siteData: []})
    //             this.setState({loading: false})
    //           })
    //         }else{

    //         }
    //       }).catch(err => {
    //         console.log(err.response)
    //         this.setState({loading: false});
    //       })
    //     })
    //     const toAdd = [];
    //     this.state.toAdd.map(add => {
    //       if(!removeNums.includes(add)){
    //         toAdd.push(add)
    //       }
    //     })
    //     this.setState({toAdd})
        
    // }

    enlistButton = () => {
      this.setState({loading: true})
      console.log(this.state.idnum)
      axios.get('https://archerone-backend.herokuapp.com/api/checkenlist/'+this.state.idnum).then(res => {
        if(res.data){
          var closedClasses = false;
          this.state.siteData.map(row => {
            if(row.capacity <= row.enrolled){
              closedClasses = true;
            }
          })
          if(closedClasses){
            this.setState({snackBarText: 'One of your classes are closed.'});
            this.setState({snackBar: true});
            this.setState({loading: false});
          }else{
            axios.post('https://archerone-backend.herokuapp.com/api/checkconflicts/', {
              classnumbers: this.state.allAdd
            })
            .then(res => {
              if(res.data){
                console.log("true")
                const newAdded = this.state.siteData
                const newAll = this.state.allAdd
                this.state.added.map(a => {
                  newAdded.push(a)
                  newAll.push(a.classNmbr)
                })
                this.setState({added: newAdded, allAdd: newAll}, () => {
                  localStorage.setItem('added', JSON.stringify(newAdded))
                  localStorage.removeItem('toAdd')
                  this.setState({siteData: []})
                  this.setState({toAdd: []})
                  this.setState({loading: false})
                })
              }else{
                console.log("false")
                this.setState({snackBarText: 'Conflicts found.'});
                this.setState({snackBar: true});
                this.setState({loading: false});
              }
            }).catch(err => {
              console.log(err.response)
              this.setState({loading: false});
            })
          }

        }else{
          this.setState({snackBarText: 'You cannot enlist at this time.'});
          this.setState({snackBar: true});
          this.setState({loading: false});
        }
      }).catch(err => {
        console.log(err.response)

      })
    }

    deleteButton = (classnumber) => {
      const newAll = []
      const newSiteData = []
      this.state.siteData.map(row => {
        if(row.classNmbr != classnumber){
          newSiteData.push(row)
          newAll.push(row.classNmbr)
        }
      })
      this.setState({siteData: newSiteData})
      const newToAdd = []
      this.state.toAdd.map(c => {
        if(c != classnumber){
          newToAdd.push(c)
          newAll.push(c)
        }
      })
      this.setState({toAdd: newToAdd})
      this.setState({allAdd: newAll})
      axios.post('https://archerone-backend.herokuapp.com/api/removecart/',{
        classnumber,
        idnum: this.state.idnum
      })
      .then(res => {

      })
      localStorage.setItem('toAdd', JSON.stringify(newToAdd))
    }
    dropButton = (classnumber) => {
      const newSiteData = []
      this.state.added.map(row => {
        if(row.classNmbr != classnumber){
          newSiteData.push(row)
        }
      })
      this.setState({added: newSiteData})
      const newAll = []
      this.state.allAdd.map(c => {
        if(c != classnumber){
          newAll.push(c)
        }
      })
      this.setState({added: newSiteData})
      this.setState({allAdd: newAll})
      localStorage.setItem('added', JSON.stringify(newSiteData))
    }
    onChangeSearch = (e) => {
      this.setState({searchedCourse: e.target.value})
    }

    toggleModal = () => {

    }

    handleLogin = () => {
      this.setState({idnum: this.state.idnumValue})
      this.setState({name: this.state.nameValue})
      localStorage.setItem('idnum',this.state.idnumValue)
      localStorage.setItem('name',this.state.nameValue)
      this.setState({openModal: false})
    }

    handleChange = (e) => {
      this.setState({idnumValue: e.target.value})
    }
    handleNameChange = (e) => {
      this.setState({nameValue: e.target.value})
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

            {(this.state.idnum != null) ? 
            <div className="search-container">
                <div className="searcundehBar">
                  <h2>Add Classes</h2>
                </div>
                <hr class="solid"></hr>

              <span>

                <div>
                    <div>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                      </Grid>
                      <Grid item xs={4}>
                        <div className="searchBar">
                          <div style={{display: "flex", justifyContent: "center"}}>
                          <TextField value={this.state.searchedCourse} onChange={this.onChangeSearch} margin="dense" label="Class number" variant="outlined"></TextField>
                          </div>
                        </div>
                        <div className="searchBar">
                          <div style={{display: "flex", justifyContent: "center"}}>
                            <Button disabled={this.state.loading} onClick={this.searchButton} variant="contained" size="small">Add</Button>
                          </div>
                        </div>
                      </Grid>
                      <Grid item xs={8}>
                        <div>
                          <div style={{display: "flex", justifyContent: "center"}}>
                          <TableContainer component={Paper}>
                              <Table aria-label="customized table">
                                <TableHead>
                                  <TableRow>
                                    <StyledTableCell> Delete </StyledTableCell>
                                    <StyledTableCell> Class </StyledTableCell>
                                    <StyledTableCell> Day </StyledTableCell>
                                    <StyledTableCell> Time </StyledTableCell>
                                    <StyledTableCell> Room </StyledTableCell>
                                    <StyledTableCell> Status </StyledTableCell>
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
                                      </StyledTableRow>
                                    ))}
                                </TableBody>
                                : 
                                <TableBody>
                                  {this.state.siteData.map(row => (
                                    <StyledTableRow key={row.classNmbr} style={(row.capacity == row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}>
                                      <StyledTableCell>
                                        <IconButton onClick={() => this.deleteButton(row.classNmbr)} aria-label="delete">
                                          <DeleteIcon />
                                        </IconButton> 
                                      </StyledTableCell>
                                      <StyledTableCell> {row.course + ' ' + row.section + ' (' + row.classNmbr + ')'} </StyledTableCell>
                                      <StyledTableCell> {row.day} </StyledTableCell>
                                      <StyledTableCell> {row.startTime} - {row.endTime} </StyledTableCell>
                                      <StyledTableCell> {row.room} </StyledTableCell>
                                      <StyledTableCell style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {(row.capacity <= row.enrolled) ? "CLOSED" : "OPEN"} </StyledTableCell>
                                    </StyledTableRow>
                                  ))}
                                </TableBody>
                                }
                              </Table>
                            </TableContainer>
                          </div>
                        </div>

                        <div className="searchBar">
                          <div style={{display: "flex", justifyContent: "center"}}>
                            <Button disabled={this.state.loading} onClick={this.enlistButton} variant="contained" size="small">Enlist</Button>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                    </div>
                </div>




              </span>

                <hr class="solid"></hr>

                <div className="searchBar">
                  <h2>Your schedule</h2>
                </div>
                <div className="viewCourses">
                  <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell> Drop </StyledTableCell>
                          <StyledTableCell> Class</StyledTableCell>
                          <StyledTableCell> Description </StyledTableCell>
                          <StyledTableCell> Day </StyledTableCell>
                          <StyledTableCell> Times </StyledTableCell>
                          <StyledTableCell> Room </StyledTableCell>
                          <StyledTableCell> Instructor </StyledTableCell>
                          <StyledTableCell> Units </StyledTableCell>
                          <StyledTableCell> Status </StyledTableCell>
                          {/* <StyledTableCell> Status </StyledTableCell> */}
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
                              {/* <StyledTableCell> <Skeleton width={'100%'} height={'100%'}></Skeleton> </StyledTableCell> */}
                            </StyledTableRow>
                          ))}
                      </TableBody>
                      : 
                      <TableBody>
                        {this.state.added.map(row => (
                          <StyledTableRow key={row.classNmbr}>
                            <StyledTableCell>
                              <IconButton onClick={() => this.dropButton(row.classNmbr)} aria-label="delete">
                                <DeleteIcon />
                              </IconButton> 
                            </StyledTableCell>
                            <StyledTableCell> {row.course + ' ' + row.section + ' (' + row.classNmbr + ')'} </StyledTableCell>
                            <StyledTableCell> {} </StyledTableCell>
                            <StyledTableCell> {row.day} </StyledTableCell>
                            <StyledTableCell> {row.startTime} - {row.endTime} </StyledTableCell>
                            <StyledTableCell> {row.room} </StyledTableCell>
                            <StyledTableCell> Staff </StyledTableCell>
                            <StyledTableCell>  </StyledTableCell>
                            <StyledTableCell>  </StyledTableCell>
                            {/* <StyledTableCell align="right" style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {row.capacity} </StyledTableCell> */}
                            {/* <StyledTableCell align="right" style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {color: "#006600"}}> {row.enrolled} </StyledTableCell> */}
                          </StyledTableRow>
                        ))}
                      </TableBody>
                      }
                    </Table>
                  </TableContainer>

                </div>
            </div>
            : 
            <Modal isOpen={this.state.openModal} toggle={this.toggleModal} returnFocusAfterClose={false} backdrop={true} data-keyboard="false" >
              <ModalHeader toggle={this.toggleModal}></ModalHeader>
              <ModalBody>
                <div className="searchBarEdit">
                  <h5>Enter your ID Number:</h5>                              
                    <div style={{display: "flex", justifyContent: "center", width: "-webkit-fill-available", marginBottom: "15px"}}>
                      <TextField value={this.state.idnumValue} onChange={this.handleChange}></TextField>
                    </div>
                  <h5>Enter your name:</h5>                              
                    <div style={{display: "flex", justifyContent: "center", width: "-webkit-fill-available", marginBottom: "15px"}}>
                      <TextField value={this.state.nameValue} onChange={this.handleNameChange}></TextField>
                    </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.handleLogin}>Login</Button>{' '}
              </ModalFooter>
            </Modal> 
            }
            <Snackbar open={this.state.snackBar} autoHideDuration={4000} onClose={this.handleCloseSnackBar}>
              <Alert onClose={this.handleCloseSnackBar} severity="error">
                {this.state.snackBarText}
              </Alert>
            </Snackbar>
        </div>        
      );
    }
  }

  SearchCourses.propTypes={
    classes: PropTypes.object.isRequired,
  };
    export default withStyles(styles)(SearchCourses);