import React, {Component} from 'react';
import {hashHistory} from 'react-router';
import '../css/App.css'
import {Input, Button} from 'antd';
class App extends Component{
  constructor() {
    super();
    this.state = {
      username:'',
      password:''
    }
  }
  handleLogin=(e)=>{
    if(this.state.username === 'mwee' && this.state.password === '123') {
      this._saveUsername();
      e.preventDefault()
      hashHistory.push({pathname:'/main'})
    }else {
      console.log('登陆失败')
    }
  }
  handleUsernameChange=(e)=>{
    this.setState({
      username: e.target.value
    })
  }
  handlePasswordChange=(e)=>{
    this.setState({
      password: e.target.value
    })
  }
  _saveUsername() {
    localStorage.setItem('username',this.state.username);
  }
  render() {
    return (
      <div className='App-input'>
        <Input size="large" onChange={this.handleUsernameChange} value={this.state.username} placeholder="账号" />
        <Input size="large" onChange={this.handlePasswordChange} value={this.state.password} placeholder="密码" />
        <Button type="primary" onClick={this.handleLogin}>登陆</Button>
      </div>
    )
  }
}

export default App;
