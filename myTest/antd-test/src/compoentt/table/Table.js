import React, {Component} from 'react';
import {hashHistory} from 'react-router';

import List from './List';
import Header from './Header';
class Lists extends Component {   
    componentWillMount() {
      let username = localStorage.getItem('username');
      if(!username) {
          alert("请先登陆")
          hashHistory.push({pathname:'/'})
        }
    }
    render() {   
        return (
          <div>
            <Header />
            <List />
          </div>
        )
    }
}

export default Lists;