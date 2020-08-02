import React, {Component} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import '../css/BoxInfo.css';

class BoxInfo extends Component {
    constructor(props){
        super(props);
    }
    state = {  
        boxContent: this.props.content,
        id: this.props.id,
        // boxContent: ['Match Preferences','> Earliest Start Time: 9:15 AM', '> earliest End Time: 2:15 PM', '> Break Preferences: 15 minutes', '', 'Unmatched Preferences', '> Professor Bob Uy not included'],
        // courseConflicts: ['> HUMALIT conflicts with with ClassB2', '> KASPIL conflicts with with ClassC3']
    }

    render() { 
        
        return ( 
            <div className="boxinfoContainer" key={this.state.id}>
                <List>
                {this.state.boxContent.map((pref, index)=>(
                    <ListItem>
                        <ListItemText primary={pref}/>
                    </ListItem>
                    // <p key={index + this.state.id}>{pref}</p>
                ))}
                </List>
            </div>
         );
    }
}
 
export default BoxInfo;