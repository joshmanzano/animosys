import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import _ from 'underscore';
import axios from 'axios'
import groupArray from 'group-array';

class ComboBox extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            college: '',
            programList: [],
            degrees: [],
            courseList: [],
            offeringList: [],
            value: this.props.value,
            loading: false
        }
        this.handleSearchInputThrottled = _.debounce(this.handleSearchInput, 500)
        this.handleOfferingThrottled = _.debounce(this.handleOfferingSearchInput, 500)
    }

    componentWillReceiveProps(props){
        this.setState({
            value: props.value,
        });
        this.changeProgramList(props);
    }

    changeProgramList(props) {

        var updatedProgramList = [];
        
        if(props.degrees != undefined){
            props.degrees.map(degree => {
                if(String(props.college) == String(degree.college)){
                    const program = {'id':degree.id, 'name':degree.degree_name};
                    updatedProgramList = updatedProgramList.concat(program);
                }
            })
        }

        this.state.programList = updatedProgramList;

    }

    handleSearchInput = (e, val) =>{
      if(val.trim() != ''){
        this.setState({loading: true, courseList: []}, () => {
          axios.get('https://archerone-backend.herokuapp.com/api/searchcourse/'+val+'/')
          .then(res => {
            res.data.map(course => {
                var courses = this.state.courseList;
                courses.push({'id':course.id, 'course_code':course.course_code})
                this.setState({courseList: courses})
            })
            this.setState({loading: false})
          })
        })
      }else{
        this.setState({courseList: []})
      }
    }

    createData(classNmbr, course, course_id, section, faculty, day, startTime, endTime, room, capacity, enrolled) {
        return { classNmbr, course, course_id, section, faculty, day, startTime, endTime, room, capacity, enrolled };
    }

    handleOfferingSearchInput = (e, val) =>{
        if(val.trim() != ''){
            this.setState({loading: true})
            const offeringList = [];
            const courses = [];
            axios.get('https://archerone-backend.herokuapp.com/api/searchcourse/'+val+'/')
            .then(res => {
                res.data.map(course => {
                    courses.push(course.id)
                })
                axios.post('https://archerone-backend.herokuapp.com/api/courseofferingslist/',{
                    courses,
                    applyPreference: false,
                    user_id: localStorage.getItem('user_id')
                }).then(res => {
                    res.data.map(bundle => {
                        var arranged = groupArray(bundle, 'classnumber');
                        console.log(arranged)
                        for (let key in arranged) {
                        console.log(key, arranged[key]);
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
                        const offering = this.createData(classnumber, course, course_id, section, faculty, day, timeslot_begin, timeslot_end, room, max_enrolled, current_enrolled);
                        console.log(offering)
                        offeringList.push(offering);
                        }
                    })
                    this.setState({offeringList, loading: false})
                })
            })
        }else{
            this.setState({offeringList: []})
        }
    }

    render (){
   
        if(this.props.page == "register"){
            return (
                <Autocomplete
                  id="combo-box-demo"
                  options={this.state.programList}
                  getOptionLabel={option => option.name}
                  style={{ width: 500 }}
                  renderInput={params => <TextField {...params} label="Degree Program" variant="outlined" />}
                  value={this.state.value}
                  inputValue={this.state.value}
                  searchText={this.state.value}
                  onChange={this.props.onChange}
                />
            );
        } else if(this.props.page == "search"){
            return (
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={this.state.courseList}
                  getOptionLabel={option => option.course_code}
                //   style={{ width: 500 }}
                  defaultValue={this.props.defaultValue}
                  filterSelectedOptions
                  loading={this.state.loading}
                  noOptionsText={"Start typing to search for a course!"}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search Course"
                        variant="outlined"
                        InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                            {this.state.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                        }}
                    />
                )}
                //   renderInput={params => <TextField {...params} label="Search Courses" variant="outlined" />}
                onChange={this.props.onChange}
                onKeyPress={this.props.onKeyPress}
                onInputChange={this.handleSearchInputThrottled}
                />
            );
        } else if(this.props.page == "search_simple"){
            return (
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={this.state.courseList}
                  getOptionLabel={option => option.course_code}
                //   style={{ width: 500 }}
                  filterSelectedOptions
                  loading={this.state.loading}
                  noOptionsText={"Start typing to search for a course!"}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search Course"
                        variant="outlined"
                        InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                            {this.state.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                        }}
                    />
                )}
                //   renderInput={params => <TextField {...params} label="Search Courses" variant="outlined" />}
                  onChange={this.props.onChange}
                  onInputChange={this.handleSearchInputThrottled}
                />
            )
        } else if(this.props.page == "add"){

            return(
            <Autocomplete
            multiple
            options={this.state.courseList}
            disabled={this.props.disabled}
            getOptionLabel={option => option.course_code}
            filterSelectedOptions
            noOptionsText={"Start typing to add a course!"}
            style={{ width: 500 }}
            loading={this.state.loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Course"
                    variant="outlined"
                    InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                        <React.Fragment>
                        {this.state.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                        </React.Fragment>
                    ),
                    }}
                />
            )}
            onChange={this.props.onChange}
            onKeyPress={this.props.onKeyPress}
            onInputChange={this.handleSearchInputThrottled}
            value={this.props.value}
            />
            )
        } else if(this.props.page == "edit"){
            return(
            <Autocomplete
            multiple
            options={this.state.offeringList}
            getOptionLabel={option => option.course + ' ' + option.section + ' (' + option.classNmbr + ') ' + option.day + ' ' + option.startTime + ' - ' + option.endTime}
            filterSelectedOptions
            noOptionsText={"Start typing to search for a course offering!"}
            style={{ width: 500 }}
            loading={this.state.loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search Course"
                    helperText="Search for a course code or class number to select a class to add to this schedule."
                    variant="outlined"
                    InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                        <React.Fragment>
                        {this.state.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                        </React.Fragment>
                    ),
                    }}
                />
            )}
            onChange={this.props.onChange}
            // onKeyPress={this.props.onKeyPress}
            onInputChange={this.handleOfferingThrottled}
            value={this.props.value}
            />
            )
        } else if(this.props.page == "generate"){
            return(
            <Autocomplete
            multiple
            options={this.state.offeringList}
            getOptionLabel={option => option.course + ' ' + option.section + ' (' + option.classNmbr + ')'}
            filterSelectedOptions
            noOptionsText={"Start typing to add a specific course offering!"}
            style={{ width: 500 }}
            loading={this.state.loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Add specific course offerings"
                    variant="outlined"
                    InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                        <React.Fragment>
                        {this.state.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                        </React.Fragment>
                    ),
                    }}
                />
            )}
            onChange={this.props.onChange}
            // onKeyPress={this.props.onKeyPress}
            onInputChange={this.handleOfferingThrottled}
            value={this.props.value}
            />
            )
        }
    }
}

export default ComboBox;