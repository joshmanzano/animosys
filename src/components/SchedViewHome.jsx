import React, { Component } from 'react';
import { Column, Row } from 'simple-flexbox';
import Menu from '../components/Menu.jsx';
import axios from 'axios';
import ReactDOM from "react-dom";
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import ScheduleView from '../components/ScheduleView';
import '../css/Index.css'
import SavedSchedule from '../components/SavedSchedule';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';

import EditableLabel from 'react-inline-editing';

import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';

import PropTypes from 'prop-types';

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
      marginLeft: "10px",
      '&:hover': {
          backgroundColor: "white",
          color: "#79c879"
        },
  }
});

class SchedViewHome extends Component {
    constructor(props){
      super(props);
      this._handleFocus = this._handleFocus.bind(this);
      this._handleFocusOut = this._handleFocusOut.bind(this);
      this.handleKeyPress = this.handleKeyPress.bind(this);

      this.state = {  
        scheduleContent: props.scheduleContent,
        tableContent: props.tableContent,
        id: props.id,
        schedTitle: props.titleName,
        boolEdit: false,
        palette: props.palette,
        earliest: props.earliest,
        latest: props.latest,
        allowEdit: props.allowEdit,
        matched: props.matched
      }
      this.editableLabel = React.createRef();
      
      console.log("reach schedviewhome")
      console.log(props)
    }
    

    _handleFocus=(text)=> {
      this.setState({boolEdit: true});
      console.log('Focused with text: ' + text);
      
  }

  _handleFocusOut=(text)=> {
      console.log('Left editor with text: ' + text);
      this.setState({schedTitle: text});
      console.log("this is props");
      console.log(this.props);
      this.props.updateSchedTitle(text);
      this.setState({boolEdit: false});

  }

  handleKeyPress = (event) => {
      console.log("event: " + event);
      if(event.key === 'Enter'){
          this.setState({boolEdit: false});
          console.log("isEditing: " + this.state.boolEdit);

      }
  }

  editButtonPress = () =>{
      if(this.state.boolEdit === false){
          this.setState({boolEdit: true});
          this.editableLabel.current.setState({isEditing: true});
      }else if(this.state.boolEdit === true){
          this.setState({boolEdit: false});
      }
  }

  componentWillReceiveProps(props){
    this.setState({
      scheduleContent: props.scheduleContent,
      tableContent: props.tableContent,
      id: props.id,
      schedTitle: props.titleName,
      palette: props.palette,
      earliest: props.earliest,
      latest: props.latest,
      allowEdit: props.allowEdit,
      matched: props.matched,
    });
    console.log(props.palette);
  }

    render() { 
      
      const { classes } = this.props;
      
      const StyledTableCell = withStyles(theme => ({
        head: {
          backgroundColor: '#006A4E',
          color: theme.palette.common.white,
          position: "sticky",
          top: 0,
        },
        body: {
          fontSize: 12,
        },
      }))(TableCell);
      
      const StyledTableRow = withStyles(theme => ({
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
          },
        },
      }))(TableRow);
      
      function createData(classNmbr, course, section, faculty, day, startTime, endTime, room, capacity, enrolled) {
        return { classNmbr, course, section, faculty, day, startTime, endTime, room, capacity, enrolled };
      }
      
      const rows = [
        createData(2258, 'INOVATE', 'S17', 'DELA CRUZ, JUAN', 'TH', '12:45', '14:15', 'GK210', 45, 45),
        createData(2259, 'INOVATE', 'S18', 'DELA CRUZ, JUAN', 'TH', '14:30', '16:00', 'GK210', 45, 40),
        createData(2043, 'TREDTRI', 'S17', 'TORRES, MARIA', 'TH', '14:30', '16:00', 'GK301', 30, 30),
        createData(2044, 'TREDTRI', 'S18', 'TORRES, MARIA', 'TH', '12:45', '14:15', 'GK301', 30, 28)
      ];
        return (
          <div style={{marginRight:"20px"}}>
            <Row horizontal="center">
                <Column flexShrink={1}>
                  <div id='savedSchedContent' class='savedSchedContent' style={{block: "display"}}>
                
                {this.state.allowEdit ? 
                  <Row horizontal= 'center'>
                      <EditableLabel ref={this.editableLabel} text={this.state.schedTitle}
                      labelClassName='myLabelClass'
                      inputClassName='myInputClass'
                      inputWidth='200px'
                      inputHeight='25px'
                      inputMaxLength='50'
                      labelFontWeight='bold'
                      inputFontWeight='bold'
                      onFocus={this._handleFocus}
                      onFocusOut={this._handleFocusOut}
                      onChange={this.handleKeyPress}
                      /> 

                      {this.state.boolEdit ? <DoneIcon fontSize="medium" className={classes.checkIcon} onClick={this.editButtonPress}/> : <EditIcon fontSize= "small" className={classes.pencilIcon} onClick={this.editButtonPress}/>}
                    </Row>
                : 
                  <Row horizontal= 'center'>
                    <h5>{this.state.schedTitle}</h5>  
                  </Row>
                }
                    <center>
                      <ScheduleView height='300px' content={this.state.scheduleContent} earliest={this.state.earliest} latest={this.state.latest} palette={this.state.palette} matched={this.props.matched}/>
                    </center>
                  
                  <Row horizontal='center' flexShrink={1}>
                    <div className="viewCoursesHome" id="viewCoursesHome">
                      <TableContainer component={Paper} style={{maxHeight: "428px", overflowY: "auto", overflowX: "auto", width: "auto"}}>
                        <Table aria-label="customized table" fixedHeader={false} style={{ tableLayout: 'auto' }} >
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
                          <TableBody>
                            {this.state.tableContent.map(row => (
                              <StyledTableRow style={row.compareMatch ? {backgroundColor: "#b8d4cd"} : {}} key={row.classNmbr}>
                                <StyledTableCell style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {}}> {row.classNmbr} </StyledTableCell>
                                <StyledTableCell style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {}}> {row.course} </StyledTableCell>
                                <StyledTableCell style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {}}> {row.section} </StyledTableCell>
                                <StyledTableCell style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {}}> {row.faculty} </StyledTableCell>
                                <StyledTableCell style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {}}> {row.day} </StyledTableCell>
                                <StyledTableCell style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {}}> {row.startTime} - {row.endTime} </StyledTableCell>
                                <StyledTableCell style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {}}> {row.room} </StyledTableCell>
                                <StyledTableCell align="right" style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {}}> {row.capacity} </StyledTableCell>
                                <StyledTableCell align="right" style={(row.capacity <= row.enrolled) ? {color: "#0099CC"} : {}}> {row.enrolled} </StyledTableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </Row>
                </div>
                </Column>
            </Row>
          </div>
  
        );
    }
}
 
SchedViewHome.propTypes={
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(SchedViewHome);