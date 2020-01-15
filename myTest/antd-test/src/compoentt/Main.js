import React,{Component} from 'react';
import {Link} from 'react-router';
import { Layout, Menu, Breadcrumb} from 'antd';

class Main extends Component {
    constructor(){
        super();
        this.state = {
            collapsed: false,
        }
    }
    render() {
        const { Header, Content, Footer, Sider } = Layout;
        const { SubMenu } = Menu;
        return(
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <Menu.Item key="1">
                            <Link to = {'home'}>首页</Link>
                        </Menu.Item>
                        <SubMenu key="sub2" title="商品">
                            <Menu.Item key="2">
                                <Link to = {'table'}>商品列表</Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Link to = {'echart'}>商品图表</Link>
                            </Menu.Item>
                        </SubMenu>
                        
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }} />
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>{this.props.children}</div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
         )
    }
}

export default Main;