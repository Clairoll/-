import React, {Component} from 'react';
import { Table } from 'antd';

class List extends Component {
    constructor(){
      super();
      this.state= {
        goods: [],
        columns: []
      }
    }
    componentWillMount() {
      const column = [
        {
          title: '创建时间',
          dataIndex: 'createdTime',
          width: 100,
          align: 'center'
        },
        {
          title: '商品名称',
          dataIndex: 'activeName',
          width: 50,
          align: 'center'
        },
        {
          title: '商品状态',
          dataIndex: 'activeState',
          width: 100,
          align: 'center'
        },
        {
            title: '商品库存',
            dataIndex: 'activeNum',
            width: 50,
            align: 'center'
        }
      ];   
      const data = [];
      for (let i = 0; i < 50; i++) {
        let mounth = Math.floor(Math.random()*12)+1;
        let activeresult = '';
       switch (Math.floor(Math.random()*4)+1) {
            case 1:
                activeresult =  '正在售卖'
                break;
            case 2:
                activeresult =  '即将上架'
                break;
            case 3:
                activeresult =  '已下架'
                break;
            default:
                activeresult =  '没有此商品'
        }
        data.push({
          key: i,
          createdTime: `201${Math.floor(Math.random()*10)}-${mounth>=10?mounth:'0'+mounth} `,
          activeName: `商品${i+1}`,
          activeState: activeresult,
          activeNum:`${Math.floor(Math.random()*100)}`,
        });
      }

      this.setState({
        goods:data,
        columns:column
      })
    }
    render(){
        
        return (
           <Table columns={this.state.columns} dataSource={this.state.goods} pagination={{ pageSize: 10 }}/>
        )
    }
}
export default List;