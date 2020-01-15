/*
// 前端路由
let a = [
    '/bmanage/crm/member/member-list',
    '/bmanage/crm/member/member-list/detail',
]

// 菜单返回的路由
let menu = [
    '/bmanage/crm/member/member-list',
]

// url 获取的 pathname
let url = '/bmanage/crm/member/member-list/detail'

// 父子对应关系
let obj = {
    '/bmanage/crm/index': ['/bmanage/crm/index'],
    '/bmanage/crm/member/member-list': ['/bmanage/crm/member/member-list', '/bmanage/crm/member/member-list/detail']
}

// 1. 列出前端父子页面对应关系
// 2. 遍历菜单接口，把返回的父页面按照步骤1的对应关系找出子页面，
//    将父子页面都塞到一个可访问的权限数组中，转换为权限对象
// 3. 获取 location.pathname 在权限对象中匹配

// 问题
// 1. 404
// 2. :params
// 3. 定制化报表'/bmanage/report/general/02c66bad8df74818a6605a2bcb744f44',

*/
import { crm_routes } from './aa'
import { munu } from './bb'

function output(params) {
    return '父子对应关系'
}
export default output()
