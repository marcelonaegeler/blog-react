var CommentBox = React.createClass({
  render: function() {
  	var comments = this.props.data.map(function(el) {
  		return (
  			<div className="post" key={el.id}>
  				<h1>{el.title}</h1>
  				<p>{el.content}</p>
				</div>
			);
  	});
    return (
    	<div>
    		{comments}
    	</div>
  	);
  }
});


var data = [
	{ id: 1, title: 'Marcelo', content: 'Teste de post' }
	, { id: 2, title: 'Teste 02', content: 'Teste de post 2' }
];
React.render(
	React.createElement(CommentBox, { data: data })
	, document.body.querySelector('.content')
);