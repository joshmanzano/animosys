import React, { Component } from "react";
import { Column, Row } from 'simple-flexbox';
import ScheduleView from '../components/ScheduleView';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class SavedSchedule extends Component {
    constructor(props){
        super(props);
    }
    state = {
        scheduleContent: [
            {
                id: 3,
                title: "CSSERVM",
                section: "S15",
                startDate: new Date(2018, 5, 26, 10, 0),
                endDate: new Date(2018, 5, 26, 11, 0),
                location: "G302",
                professor: "Flowers, Fritz",
                startTime: "09:30AM",
                endTime: "11:30AM",
                days: ['T', 'H'],
                classCode: "2453"
              },
              {
                title: "INOVATE",
                section: "EB14",
                startDate: new Date(2018, 5, 26, 12, 0),
                endDate: new Date(2018, 5, 26, 13, 30),
                id: 4,
                location: "G305",
                professor: "Tuazon, James Dean",
                startTime: "12:00PM",
                endTime: "01:30PM",
                days: ['T', 'H'],
                classCode: "2453"
              },
              {
                  title: "HUMAART",
                  section: "S17",
                  startDate: new Date(2018, 5, 27, 9, 30),
                  endDate: new Date(2018, 5, 27, 11, 30),
                  id: 0,
                  location: "G302",
                  professor: "Sangi, April",
                  startTime: "09:30AM",
                  endTime: "11:30AM",
                  days: ['M', 'W'],
                  classCode: "2453"
                  },
          ],
        //tableContent: this.props.tableContent,
      }
    render() { 

        var schedSample =[
            {
                
              title: "HUMAART",
              startDate: new Date(2018, 5, 25, 9, 30),
              endDate: new Date(2018, 5, 25, 11, 30),
              id: 0,
              location: "Room 1",
              source: "G302",
              description: "Professor lulu"
             
            }
          ]

        const StyledTableCell = withStyles(theme => ({
            head: {
              backgroundColor: '#006A4E',
              color: theme.palette.common.white,
            },
            body: {
              fontSize: 14,
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
          ]
          
        return (  
            
            <Row vertical='center'>
                <ScheduleView height='300px' content={this.state.scheduleContent}/>
            </Row>

            
            // <div className="viewCourses">
            //     <TableContainer component={Paper}>
            //     <Table aria-label="customized table">
            //         <TableHead>
            //         <TableRow>
            //             <StyledTableCell> Class Number </StyledTableCell>
            //             <StyledTableCell> Course </StyledTableCell>
            //             <StyledTableCell> Section </StyledTableCell>
            //             <StyledTableCell> Faculty </StyledTableCell>
            //             <StyledTableCell> Day </StyledTableCell>
            //             <StyledTableCell> Time </StyledTableCell>
            //             <StyledTableCell> Room </StyledTableCell>
            //             <StyledTableCell> Capacity </StyledTableCell>
            //             <StyledTableCell> Enrolled </StyledTableCell>
            //         </TableRow>
            //         </TableHead>
            //         <TableBody>
            //         {rows.map(row => (
            //             <StyledTableRow key={row.classNmbr}>
            //             <StyledTableCell> {row.classNmbr} </StyledTableCell>
            //             <StyledTableCell> {row.course} </StyledTableCell>
            //             <StyledTableCell> {row.section} </StyledTableCell>
            //             <StyledTableCell> {row.faculty} </StyledTableCell>
            //             <StyledTableCell> {row.day} </StyledTableCell>
            //             <StyledTableCell> {row.startTime} - {row.startTime} </StyledTableCell>
            //             <StyledTableCell> {row.room} </StyledTableCell>
            //             <StyledTableCell align="right"> {row.capacity} </StyledTableCell>
            //             <StyledTableCell align="right"> {row.enrolled} </StyledTableCell>
            //             </StyledTableRow>
            //         ))}
            //         </TableBody>
            //     </Table>
            //     </TableContainer>
            // </div>
           
        );
    }
}
 
export default SavedSchedule   ;