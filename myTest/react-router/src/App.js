import React, {Component} from 'react';
import {Link} from 'react-router';
import './App.css';

class App extends Component {
    render(){
        return (
            <div>  
               <Link to="/users">users</Link>
            </div>
        )
    }
}


export default App;