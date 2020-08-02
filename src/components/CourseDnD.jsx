import React, { Component } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag, generateItems } from '../components/ultils.jsx';
import '../css/CourseDnD.css';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import axios from "axios";
import Tooltip from '@material-ui/core/Tooltip';

import DragHandleIcon from '@material-ui/icons/DragHandle';
import Skeleton from '@material-ui/lab/Skeleton';
import ReactLoading from 'react-loading';
import LaunchIcon from '@material-ui/icons/Launch';
import ListIcon from '@material-ui/icons/List';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { green } from '@material-ui/core/colors';

const groupStyle = {
    marginLeft: '50px',
    flex: 1
  };

const styles = theme => ({
    iconStyle:{ 
      marginBottom: "5px", 
      float: "left", 
      marginTop: "11px", 
      marginLeft: "16px",
        '&:hover': {
          color: green[500],
          },
    },
  });

class CourseDnD extends Component {

  constructor(props) {
    super(props);
    

    this.state = {
        courses: this.props.courses,
        idTag: this.props.idTag
    };

  }

componentWillReceiveProps(props) {
  this.refreshList(props);

}

componentDidMount(){
  this.refreshList(this.props);
}

refreshList = (props) => {
    var newItems = props.courses;
    this.setState({courses:[]})

    for(let i = 0; i < newItems.length; i++) {
        this.setState(state =>{
            const courses = state.courses.concat({id: newItems[i].id, course_id: newItems[i].course_id, data:newItems[i].data, siteData:newItems[i].siteData});
            return{courses};
        });
    }   
}

removeCourse = (index) =>{
  this.props.handleCourseDelete(this.state.courses[index])
  var newCourses = [...this.state.courses];
  if(index !== -1){
    newCourses.splice(index, 1);
  }
  this.props.updateFunction(newCourses);
}

triggerModal =(courseName, siteData)=>{
    this.props.triggerModal(courseName, siteData);
}

triggerUpdate=(e)=>{
  if(e.removedIndex == null){
    if(e.addedIndex != null){
      if(this.state.idTag == "1"){
        axios.put('https://archerone-backend.herokuapp.com/api/coursepriority/'+e.payload.id+'/',{
          courses:e.payload.course_id, priority:true, user:localStorage.getItem('user_id')
        }).catch(e => {
          console.log(e.response)
        })
      }else if(this.state.idTag == "2"){
        axios.put('https://archerone-backend.herokuapp.com/api/coursepriority/'+e.payload.id+'/',{
          courses:e.payload.course_id, priority:false, user:localStorage.getItem('user_id')
        }).catch(e => {
          console.log(e.response)
        })
      }

    }

  }
  // else if(e.addedIndex == null){
  //   if(e.removedIndex != null){
  //     console.log(e.payload)

  //   }

  // }
  this.setState({ courses: applyDrag(this.state.courses, e) })
  this.props.updateFunction(this.state.courses);
  // console.log(this.props.idTag + " course state contains: " +this.state.courses);
}

  render() {
    const { classes } = this.props;

    return (
       
      <div>

        <div className="simple-page1" style={{ display: 'flex', justifyContent: 'center'}}>
          <div className= "card-container" style={{height:"452px", overflow: "auto", width: "270px"}}>
            {!this.props.loading ? 
            <Container groupName="1" getChildPayload={i => this.state.courses[i]} onDrop={this.triggerUpdate} style={{height:"100%"}}>
                {this.state.courses.map((p, index) => {
                console.log(p)
                return (
                    <Draggable key={p.id}>
                    <div className="draggable-item">
                        <Tooltip title="Select sections" placement="left">
                        <LaunchIcon id="launch" style={{cursor: "pointer"}} className={classes.iconStyle} onClick={() => this.triggerModal(p.data, p.siteData)}/>
                        </Tooltip>
                        {/* <DragHandleIcon style={{ marginBottom: "5px", float: "left", marginTop: "12px", marginLeft: "16px"}}/> */}
                        {/* <Tooltip title="Select sections" placement="left"> */}
                            <a className = "card-courseName" onClick={() => this.triggerModal(p.data, p.siteData)} /*style={{cursor: "pointer", textDecorationLine: 'underline'}}*/>{p.data}</a>
                        {/* </Tooltip> */}
                        <Button close  style={{ marginTop: "11px", marginRight: "10px"}} onClick={() => this.removeCourse(index)}/>
                    </div>
                    </Draggable>
                );
                })}
            </Container>
            :
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh"}}>
              <ReactLoading type={'spin'} color={'#9BCFB8'} height={'20%'} width={'20%'}/>
            </div> 
            }
        </div>
        </div>
 
          {/* <button className="addBtn" onClick={this.refreshList}>Add course</button> */}

      </div>
    );
  }
  
    // render() {
    //   return (
    //     <div className="card-scene" >
    //       <Container
    //         orientation="horizontal"
    //         onDrop={this.onColumnDrop}
    //         dragHandleSelector=".column-drag-handle"
    //         dropPlaceholder={{
    //           animationDuration: 150,
    //           showOnTop: true,
    //           className: 'cards-drop-preview'
    //         }}
    //       >
    //         {this.state.scene.children.map(column => {
    //           return (
    //             <Draggable key={column.id} >
    //               <div className={column.props.className}>
    //                 <div className="card-column-header">
    //                   <span className="column-drag-handle">&#x2630;</span>
    //                   {column.name}
    //                 </div>
    //                 <Container
    //                   {...column.props}
    //                   groupName="col"
    //                   onDragStart={e => console.log("drag started", e)}
    //                   onDragEnd={e => console.log("drag end", e)}
    //                   onDrop={e => this.onCardDrop(column.id, e)}
    //                   getChildPayload={index =>
    //                     this.getCardPayload(column.id, index)
    //                   }
    //                   dragClass="card-ghost"
    //                   dropClass="card-ghost-drop"
    //                   onDragEnter={() => {
    //                     console.log("drag enter:", column.id);
    //                   }}
    //                   onDragLeave={() => {
    //                     console.log("drag leave:", column.id);
    //                   }}
    //                   onDropReady={p => console.log('Drop ready: ', p)}
    //                   dropPlaceholder={{                      
    //                     animationDuration: 150,
    //                     showOnTop: true,
    //                     className: 'drop-preview' 
    //                   }}
    //                   dropPlaceholderAnimationDuration={200}
    //                 >
    //                   {column.children.map(card => {
    //                     return (
    //                       <Draggable key={card.id}>
    //                         <div {...card.props}>
    //                           <p>{card.data}</p>
    //                         </div>
    //                       </Draggable>
    //                     );
    //                   })}
    //                 </Container>
    //               </div>
    //             </Draggable>
    //           );
    //         })}
    //       </Container>
    //     </div>
    //   );
    // }
  
    getCardPayload(columnId, index) {
      return this.state.scene.children.filter(p => p.id === columnId)[0].children[
        index
      ];
    }
  
    onColumnDrop(dropResult) {
      const scene = Object.assign({}, this.state.scene);
      scene.children = applyDrag(scene.children, dropResult);
      this.setState({
        scene
      });
    }
  
    onCardDrop(columnId, dropResult) {
      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
        const scene = Object.assign({}, this.state.scene);
        const column = scene.children.filter(p => p.id === columnId)[0];
        const columnIndex = scene.children.indexOf(column);
  
        const newColumn = Object.assign({}, column);
        newColumn.children = applyDrag(newColumn.children, dropResult);
        scene.children.splice(columnIndex, 1, newColumn);
  
        this.setState({
          scene
        });
      }
    }

    addCard = (name) => {
      this.setState(state =>{
        const oldItems = state.courses;
        const courses = state.courses.concat({id: this.props.idTag + oldItems.length, data: name});
        return{courses};
      });
    };


    onClearArray = () => {
      this.setState({courses: []});
    };
  }

  CourseDnD.propTypes={
    classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles)(CourseDnD);