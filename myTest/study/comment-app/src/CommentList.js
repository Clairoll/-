// 面部分是评论列表，用一个叫 CommentList 的组件负责列表的展示。ß
import React,{Component} from 'react';
import Comment from './Comment';

class CommentList extends Component {

    //  设置评论的默认数据
    static defaultProps = {
        comments:[]
    }
    render(){
        return (
            <div>
                {/* 使用map遍历从父组件CommentApp传递过来的comments，并将遍历的结果comment传递给字组件Comment */}
                {this.props.comments.map((comment,i)=> 
                    <Comment comment={comment} key={i}/>  
                )}   
            </div>
        )
    }
}

export default CommentList;