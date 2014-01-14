/*
 *  jQuery Commits Graph - v0.1.0
 *  A jQuery plugin to display git commits graph using HTML5/Canvas.
 *  https://github.com/tclh123/commits-graph
 *
 *  Copyright (c) 2014
 *  MIT License
 */

// -- Route --------------------------------------------------------

function Route( commit, data, options ) {
  var self = this;

  self._data = data;
  self.commit = commit;
  self.options = options;
  self.from = data[0];
  self.to = data[1];
  self.branch = data[2];
}

Route.prototype.drawRoute = function ( ctx ) {
  var self = this;

  var from_x = self.options.width - (self.from + 1) * self.options.x_step;
  var from_y = (self.commit.idx + 1) * self.options.y_step;

  var to_x = self.options.width - (self.to + 1) * self.options.x_step;
  var to_y = (self.commit.idx + 1 + 1) * self.options.y_step;


  ctx.strokeStyle = self.commit.graph.get_color(self.branch);
  ctx.beginPath();
  ctx.moveTo(from_x, from_y);
  if (from_x == to_x) {
    ctx.lineTo(to_x, to_y);
  } else {
    ctx.bezierCurveTo(from_x - self.options.x_step / 4,
                      from_y + self.options.y_step / 3 * 2,
                      to_x + self.options.x_step / 4,
                      to_y - self.options.y_step / 3 * 2,
                      to_x, to_y);
  }
  ctx.stroke();
}

// -- Commit Node --------------------------------------------------------

function Commit(graph, idx, data, options ) {
  var self = this;

  self._data = data;
  self.graph = graph;
  self.idx = idx;
  self.options = options;
  self.sha = data[0];
  self.dot = data[1];
  self.dot_offset = self.dot[0];
  self.dot_branch = self.dot[1];
  self.routes = $.map(data[2], function(e) { return new Route(self, e, options) });
}

Commit.prototype.drawDot = function ( ctx ) {
  var self = this;

  var x = self.options.width - (self.dot_offset + 1) * self.options.x_step;
  var y = (self.idx + 1) * self.options.y_step;

  // ctx.strokeStyle = self.graph.get_color(self.dot_branch);
  ctx.fillStyle = self.graph.get_color(self.dot_branch);
  ctx.beginPath();
  var radius = 3;
  ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
  // ctx.stroke();
  ctx.fill();
}

// -- Graph Canvas --------------------------------------------------------

function GraphCanvas( data, options ) {
  var self = this;

  self.data = data;
  self.options = options;
  self.canvas = document.createElement("canvas");
  self.canvas.height = options.height;
  self.canvas.width = options.width;

  self.colors = [
    "#e11d21"
    , "#eb6420"
    , "#fbca04"
    , "#009800"
    , "#006b75"
    , "#207de5"
    , "#0052cc"
    , "#5319e7"
    , "#f7c6c7"
    , "#fad8c7"
    , "#fef2c0"
    , "#bfe5bf"
    , "#c7def8"
    , "#bfdadc"
    , "#bfd4f2"
    , "#d4c5f9"
    , "#cccccc"
    , "#84b6eb"
    , "#e6e6e6"
    , "#ffffff"
    , "#cc317c"
  ]
  // self.branch_color = {};
}

GraphCanvas.prototype.toHTML = function () {
  var self = this;

  self.draw();

  return $(self.canvas);
};

GraphCanvas.prototype.get_color = function (branch) {
  var self = this;

  return self.colors[branch];
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

  ctx.lineWidth = 2;
  console.log(self.data);

  var n_commits = self.data.length;
  for (var i=0; i<n_commits; i++) {
    var commit = new Commit(self, i, self.data[i], self.options);

    commit.drawDot(ctx);
    for (var j=0; j<commit.routes.length; j++) {
      var route = commit.routes[j];
      route.drawRoute(ctx);
    }
  }
};

// -- Graph Plugin ------------------------------------------------------------

function Graph( element, options ) {
	var self = this,
			defaults = {
        height: 800,
        width: 200,
        // y_step: 30,
        y_step: 20,
        x_step: 20,
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
