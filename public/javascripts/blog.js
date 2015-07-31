var PostForm = React.createClass({
  submitHandler: function(event) {
    event.preventDefault();
    var author = React.findDOMNode(this.refs.author)
    , title = React.findDOMNode(this.refs.title)
    , content = React.findDOMNode(this.refs.content)
    ;

    var self = this;

    api.ajax({
      url: '/api/post'
      , method: 'POST'
      , data: { author: author.value.trim(), title: title.value.trim(), content: content.value.trim() }
      , dataType: 'json'
      , success: function(data) {
        author.value = '';
        title.value = '';
        content.value = '';
        return self.props.onPostSubmit(data);
      }
    });
  }
  , render: function() {
    return (
      <form onSubmit={this.submitHandler} className="form">
        <label>Title: <input type="text" ref="title" placeholder="Title" required /></label>
        <label>Author: <input type="text" ref="author" placeholder="Author" required /></label>
        <label>Content: <textarea ref="content" required></textarea></label>
        <button type="submit">Cadastrar</button>
      </form>
    );
  }
});


var PostBox = React.createClass({
  getContent: function() {
    var self = this;
    api.ajax({
      url: this.props.url
      , method: 'GET'
      , success: function(data) {
        self.setState({ posts: data });
      }
    });
  }
  , postSubmitHandler: function(data) {
    var posts = this.state.posts;
    posts.unshift(data);
    this.setState({ posts: posts });
  }
  , deleteHandler: function(event) {
    var index = +event.target.value;
    if(!index && index != 0) return false;

    var id = this.state.posts[index]._id;
    var self = this;
    api.ajax({
      url: '/api/delete'
      , method: 'POST'
      , data: { _id: id }
      , dataType: 'json'
      , success: function(data) {
        var posts = api.arrayPop(self.state.posts, index);
        self.setState({ posts: posts });
        console.log(data);
      }
    });
  }
  , getInitialState: function() {
    return { posts: [] };
  }
  , componentDidMount: function() {
    this.getContent();
  }
  , render: function() {
    var self = this;
    var renderParagraphs = function(paragraph) {
      return (
        <p>{paragraph}</p>
      );
    };

    var renderPosts = function(post, index) {
      if(post.date) {
        var strDate = ' em ';
        var date = new Date(post.date);
        var month = date.getMonth() + 1;
        month = month < 10 ? '0'+ month : month;
        strDate += [ date.getDate(), month, date.getFullYear() ].join('/');
      }
      
      return (
        <div className="post" key={index}>
          <button onClick={self.deleteHandler} value={index}>Delete</button>
          <h2 className="heading-2">{post.title}</h2>
          <p className="author">
            <a href="">{post.author}</a>{strDate ? strDate : ''}.
          </p>
          <div className="content">{post.content.split('\n').map(renderParagraphs)}</div>
        </div>
      );
    };
    return (
      <div>
        <PostForm onPostSubmit={this.postSubmitHandler} />
        {this.state.posts.map(renderPosts)}
      </div>
    );
  }
});


React.render(
  <PostBox url="/api/posts" />
  , document.body.querySelector('.body')
);