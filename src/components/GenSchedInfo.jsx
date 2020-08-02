import React, {Component} from 'react';
import {Column, Row} from 'simple-flexbox';
import ScheduleView from '../components/ScheduleView';
import ClassesTable from '../components/ClassesTable';
import BoxInfo from '../components/BoxInfo';
import { Button } from 'reactstrap';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import EditableLabel from 'react-inline-editing';

import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#006A4E',
        color: theme.palette.common.white,
      },
      body: {
        fontSize: 14,
        borderBottom: "1px solid white",
      },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

function createData(name) {
    return { name };
}

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

class GenSchedInfo extends Component {
    constructor(props){
        super(props);
        this._handleFocus = this._handleFocus.bind(this);
        this._handleFocusOut = this._handleFocusOut.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.state = {  
            scheduleContent: props.scheduleContent,
            tableContent: props.tableContent,
            conflictsContent: props.conflictsContent,
            prefContent: props.prefContent,
            rowsPref: props.prefContent,
            rowsConflict: props.conflictsContent,
            id: props.id,
            schedTitle: props.titleName,
            earliest: props.earliest,
            latest: props.latest,
            boolEdit: false,
            defPalette: ['#9BCFB8', '#7FB174', '#689C97', '#072A24', '#D1DDDB', '#85B8CB', '#1D6A96', '#283B42','#FFB53C', '#EEB3A3', '#F3355C', '#FAA98B', '#E6AECF', '#AEE0DD', '#01ACBD','#FED770', ' #F29F8F', '#FB7552', '#076A67','#324856', '#4A746A', '#D18237', '#D66C44', '#FFA289', '#6A92CC', '#706FAB', '#50293C'],
        }
        this.editableLabel = React.createRef();
    }

    componentWillReceiveProps(props){
        this.setState({
            scheduleContent: props.scheduleContent,
            tableContent: props.tableContent,
            conflictsContent: props.conflictsContent,
            prefContent: props.prefContent,
            rowsPref: props.prefContent,
            rowsConflict: props.conflictsContent,
            id: props.id,
            schedTitle: props.titleName,
            earliest: props.earliest,
            latest: props.latest,
        });
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


    render() { 
        const { classes } = this.props;

        console.log(this.state.rowsPref)
        console.log(this.state.rowsConflict)

        return (
            <Column>
                <Row verticle = 'center' className = "RowSchedInfoContainer">
                    <Column flexGrow={1} horizontal = 'center' >
                        <Row horizontal= 'start'>
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
                   
                        <ScheduleView id='scheduleView' content={this.state.scheduleContent} earliest={this.state.earliest} latest={this.state.latest} palette={this.state.defPalette} />
                    </Column>
                    <Column flexGrow={1} horizontal = 'center'style={{marginLeft: "20px"}} >
                        {/* <Row horizontal = 'center'>
                            <ClassesTable content={this.state.tableContent} />
                        </Row> */}
                        <Row horizontal = 'center'>
                            <Column horizontal = 'center' style={{marginLeft: "10px"}}>
                                {/* Preferences
                                <BoxInfo content={this.state.prefContent } id={1+this.state.id}/> */}
    
                                <TableContainer component={Paper} className="boxinfoContainer" style={{width: 250}}>
                                    <Table className={classes.table} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell><center>Preferences</center></StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        
                                        <TableBody>
                                            {this.state.rowsPref.length == 0 ?
                                            <StyledTableRow key={'empty'}>
                                                <StyledTableCell rowSpan={3}>
                                                    All preferences were met.
                                                </StyledTableCell>
                                            </StyledTableRow>
                                            : null }
                                            {this.state.rowsPref.map((row) => (
                                                <StyledTableRow key={row}>
                                                    <StyledTableCell component="th" scope="row">
                                                        {row}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </Column>

                            <Column horizontal = 'center' style={{marginLeft: "20px"}}>
                                {/* Course Conflict
                                <BoxInfo content={this.state.conflictsContent} id={2+this.state.id}/> */}

                                <TableContainer component={Paper} className="boxinfoContainer" style={{width: 250}}>
                                    <Table className={classes.table} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell><center>Course Conflict</center></StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        
                                        <TableBody>
                                            {this.state.rowsConflict.length == 0 ?
                                            <StyledTableRow key={'empty'}>
                                                <StyledTableCell rowSpan={3}>
                                                    No course conflicts.
                                                </StyledTableCell>
                                            </StyledTableRow>
                                            : null}
                                            {this.state.rowsConflict.map((row) => (
                                                <StyledTableRow key={row}>
                                                    <StyledTableCell component="th" scope="row">
                                                        {row}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </Column>
                        </Row>
                            
                    </Column>
                    
                </Row>
        
                {/* <Row horizontal='center'>
                    <Button style={{margin: "40px"}}>Save Schedule</Button>
                </Row> */}
           
            </Column>
                
          );
    }
}

GenSchedInfo.propTypes={
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(GenSchedInfo);