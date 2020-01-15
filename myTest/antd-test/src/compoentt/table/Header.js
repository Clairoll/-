import React,{Component} from 'react';
import {Select} from 'antd'
class Header extends Component {
    
    render(){
    const { Option } = Select;
    return(
        <Select defaultValue="0" style={{width:200}} showSearch>
            <Option value="0">所有状态</Option>
            <Option value="1">正在售卖</Option>
            <Option value="2">即将上架</Option>
            <Option value="3">已下架</Option>
            <Option value="4">没有此商品</Option>
        </Select>
    )
   } 
}

export default Header;