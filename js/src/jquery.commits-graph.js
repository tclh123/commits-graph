// -- Route --------------------------------------------------------

function Route( data, options ) {
  var self = this;

  self._data = data;
  self.options = options;
  self.from = data[0];
  self.to = data[1];
  self.branch = data[2];
}

// -- Commit Node --------------------------------------------------------

function Commit(idx, data, options ) {
  var self = this;

  self._data = data;
  self.idx = idx;
  self.options = options;
  self.sha = data[0];
  self.dot = data[1];
  self.dot_offset = self.dot[0];
  self.dot_branch = self.dot[1];
  self.routes = $.map(data[2], function(e) { return new Route(e, options) });
}

Commit.prototype.drawDot = function ( ctx ) {
  var self = this;

  x = self.options.width - (self.dot_offset + 1) * 20;
  y = (self.idx + 1) * 20;

  ctx.beginPath();
  ctx.arc(x, y, 1, 0, 2 * Math.PI, true);
  ctx.stroke();
}

// -- Graph Canvas --------------------------------------------------------

function GraphCanvas( data, options ) {
  var self = this;

  self.data = data;
  self.options = options;
  self.canvas = document.createElement("canvas");
  self.canvas.height = options.height;
  self.canvas.width = options.width;
}

GraphCanvas.prototype.toHTML = function () {
  var self = this;

  self.draw();

  return $(self.canvas);
};

/*

[
  sha,
  [offset, branch], //点
  [
    [from, to, branch],  // 线1
    [from, to, branch],  // 线2
    [from, to, branch],
  ]  // 线
],

*/
// draw
GraphCanvas.prototype.draw = function () {
  var self = this,
      ctx = self.canvas.getContext("2d");

  console.log(self.data);

  var n_commits = self.data.length;
  for (var i=0; i<n_commits; i++) {
    var commit = new Commit(i, self.data[i], self.options);
    commit.drawDot(ctx);
  }

  ctx.fillStyle = '#FF0000';
  //ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
};

// -- Graph Plugin ------------------------------------------------------------

function Graph( element, options ) {
	var self = this,
			defaults = {
        height: 800,
        width: 200
			};

	self.element    = element;
	self.$container = $( element );
	self.data = self.$container.data( "graph" );

	self.options = $.extend( {}, defaults, options ) ;

	self._defaults = defaults;

	self.applyTemplate();
}

// Apply results to HTML template
Graph.prototype.applyTemplate = function () {
	var self  = this,
			graphCanvas = new GraphCanvas( self.data, self.options ),
			$canvas = graphCanvas.toHTML();

	$canvas.appendTo( self.$container );
};

// -- Attach plugin to jQuery's prototype --------------------------------------

;( function ( $, window, undefined ) {

	$.fn.commits = function ( options ) {
		return this.each(function () {
			if ( !$( this ).data( "plugin_commits_graph" ) ) {
				$( this ).data( "plugin_commits_graph", new Graph( this, options ) );
			}
		});
	};

}( window.jQuery, window ) );
