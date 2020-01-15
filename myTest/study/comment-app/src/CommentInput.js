// 上面部分是负责用户输入可操作的输入区域，包括输入评论的用户名、评论内容和发布按钮，这一部分功能划分到一个单独的组件 CommentInput 中。
import React,{Component} from 'react';

class CommentInput extends Component {
    constructor (){
        super();
        this.state = {
            username:'',
            content:''
        }
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    // 控制用户名的改变
    handleUsernameChange(e){
        this.setState({
            username: e.target.value
        });
    }
    // 控制输入内容的改变
    handleContentChange(e) {
        this.setState({
            content: e.target.value
        });
    }
    // 提交数据，即将CommentInput内的state数据提交给父组件CommentApp
    handleSubmit(){
        // 判断是否传入了onSubmit属性,需要在父组件中提前接收该属性
        if(this.props.onSubmit) {
            // ES6解构赋值
           const {username,content} = this.state;
           // 将用户输入的名字以及内容传递给父组件
           this.props.onSubmit({username,content})

        }
        this.setState({
            content:''
        })
    }
    render(){
        return (
            <div className='comment-input'>
               <div className='comment-field'>
                   <span className='comment-field-name'>用户名:</span>
                   <div className='comment-field-input'>
                       <input onChange={this.handleUsernameChange} value={this.state.username}/>
                   </div>
               </div>
               <div className='comment-field'>
                   <span className='comment-field-name'>评论内容:</span>
                   <div className='comment-field-input'>
                       <textarea onChange={this.handleContentChange} value={this.state.content}/>
                   </div>
               </div>
               <div className='comment-field-button'>
                   <button onClick={this.handleSubmit}>发布</button>
               </div>
            </div>
        )
    }
}

export default CommentInput;