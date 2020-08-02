import React, {Component} from 'react';
// import { Table } from 'reactstrap';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


class ClassesTable extends Component {
    state = {  

        tableContent: this.props.content
    }

    dummyData = [
        {
            id: 3, 
            course: "DUMMY1", 
            section:"S17", 
            faculty: "DELA CRUZ, JUAN", 
            day:"MAR 30", 
            time:"08:00AM-5:00PM",
            room: "G310"
        },
        {
            id: 4, 
            course: "DUMMY2", 
            section:"S15", 
            faculty: "DEL TORRE, MARIA", 
            day:"APR 05", 
            time:"08:00AM-5:00PM",
            room: "G304"
        }
    ];
    renderTableData(){
        if(this.state.tableContent != null){
            return this.state.tableContent.map((data, index)=>{
                const {id, course, section, faculty, day, time, room} = data
                return(
                    <tr key={id}>
                        <td>{course}</td>
                        <td>{section}</td>
                        <td>{faculty}</td>
                        <td>{day}</td>
                        <td>{time}</td>
                        <td>{room}</td>
                    </tr>
                )
            });
        }
        
    }


     createTable = (tableArray) =>{     
         //pass data with unique id number   
        this.setState(
            {tableContent: tableArray}
        );
    }

    render() { 
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
          
          function createData(classNmbr, course, section, faculty, day, startTime, endTime, room) {
            return {classNmbr,course, section, faculty, day, startTime, endTime, room};
          }

          const rows = [
            createData(2258, 'INOVATE', 'S17', 'DELA CRUZ, JUAN', 'TH', '12:45', '14:15', 'GK210'),
            createData(2259, 'INOVATE', 'S18', 'DELA CRUZ, JUAN', 'TH', '14:30', '16:00', 'GK210'),
            createData(2043,'TREDTRI', 'S17', 'TORRES, MARIA', 'TH', '14:30', '16:00', 'GK301'),
            createData(2044,'TREDTRI', 'S18', 'TORRES, MARIA', 'TH', '12:45', '14:15', 'GK301')
          ];

        return (  
            // <div>
            //    <h3 id="title">Non-Credit Courses</h3>
            //    <Table id = "classes">
            //         <thead>
            //             <tr>
            //             <th>Course</th>
            //             <th>Section</th>
            //             <th>Faculty</th>
            //             <th>Day</th>
            //             <th>Time</th>
            //             <th>Room</th>
            //             </tr>
            //         </thead>
            //         <tbody>
            //             {this.renderTableData()}

            //         </tbody>
            //     </Table> 
            // </div>

            <div>
                <h3>Non-credited Course Details</h3>
                <div className="viewCourses">
                  <TableContainer component={Paper} style={{maxHeight: "428px", overflowY: "auto", overflowX: "hidden"}}>
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell> Course </StyledTableCell>
                          <StyledTableCell> Section </StyledTableCell>
                          <StyledTableCell> Faculty </StyledTableCell>
                          <StyledTableCell> Day </StyledTableCell>
                          <StyledTableCell> Time </StyledTableCell>
                          <StyledTableCell> Room </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.tableContent.map(row => (
                          <StyledTableRow key={row.id}>
                            <StyledTableCell> {row.course} </StyledTableCell>
                            <StyledTableCell> {row.section} </StyledTableCell>
                            <StyledTableCell> {row.faculty} </StyledTableCell>
                            <StyledTableCell> {row.day} </StyledTableCell>
                            <StyledTableCell> {row.startTime} - {row.endTime} </StyledTableCell>
                            <StyledTableCell> {row.room} </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
            </div>

        );
    }
}
 
export default ClassesTable;