// 评论功能的整体用一个叫 CommentApp 的组件包含起来。CommentApp 包含上部和下部两部分CommentInput和CommentList
import React,{Component} from 'react';
import CommentInput from './CommentInput';
import CommentList from './CommentList';
import './index.css'

class CommentApp extends Component {
    constructor(){
        super()
        this.handleSubmitComment=this.handleSubmitComment.bind(this);
        // 初始化一个数组，用来保存用户的每条数据
        this.state = {
            comments: []
        }
    }
    // 接收从字组件CommentInput传递过来的数据
    handleSubmitComment(comment) {
        // 将用户的每条评论添加进初始化数组comments
        this.state.comments.push(comment);
        // 更新state的数据
        this.setState({
            comments:this.state.comments
        })
    }
    render(){
        return (
            <div className='wrapper'>
                <CommentInput onSubmit={this.handleSubmitComment}/>
                <CommentList comments={this.state.comments}/>
            </div>
        )
    }
}

export default CommentApp;