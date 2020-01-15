import React from 'react'  
import { Router, Route ,IndexRoute} from 'react-router'
import App from '../compoentt/App';
import Main from '../../../../../myblog/admin/src/Main';
import Home from '../compoentt/home/Home';
import Echart from '../compoentt/echart/Echart';
import Table from '../compoentt/table/Table'

export default class RouteMap extends React.Component {  
    updateHandle () {  
        console.log('每次router变化之后都会触发')  
    }  
    render () {  
        return (  
            <Router history={this.props.history}  onUpdate={this.updateHandle.bind(this)}>  
                <Route path='/' component={App}>
                </Route> 
                <Route path='/main' component={Main}>
                    <IndexRoute component={Home}/>
                    <Route path='/home' component={Home} breadcrumbName="首页"></Route>
                    <Route path='/goods/echart' component={Echart} breadcrumbName="首页"></Route>
                    <Route path='/goods/table' component={Table} breadcrumbName="首页"></Route>
                </Route> 
            </Router>  
        )  
    }  
}  
