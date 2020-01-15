import React from 'react';
import ReactDOM from 'react-dom';
import {Route,Router,hashHistory} from 'react-router'
// import './index.css';
import App from './App';
import Users from './Users'
import * as serviceWorker from './serviceWorker';
// const routes = (
    
// )
ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}/>
        <Route path="/users" component={Users} />
    </Router>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
