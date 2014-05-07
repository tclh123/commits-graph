/*
 *  jQuery Commits Graph - v0.1.4
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

  if (self.options.orientation === "horizontal") {
	var from_x_hori = self.options.width * self.options.scaleFactor - (self.commit.idx + 0.5) * self.options.x_step * self.options.scaleFactor;
	var from_y_hori = (self.from + 1) * self.options.y_step * self.options.scaleFactor;

	var to_x_hori = self.options.width * self.options.scaleFactor - (self.commit.idx + 0.5 + 1) * self.options.x_step * self.options.scaleFactor;
	var to_y_hori = (self.to + 1) * self.options.y_step * self.options.scaleFactor;

	ctx.strokeStyle = self.commit.graph.get_color(self.branch);
	ctx.beginPath();
	ctx.moveTo(from_x_hori, from_y_hori);
	if (from_y_hori === to_y_hori) {
	  ctx.lineTo(to_x_hori, to_y_hori);
	} else if (from_y_hori > to_y_hori) {
	  ctx.bezierCurveTo(from_x_hori - self.options.x_step * self.options.scaleFactor / 3 * 2,
						from_y_hori + self.options.y_step * self.options.scaleFactor / 4,
						to_x_hori + self.options.x_step * self.options.scaleFactor / 3 * 2,
						to_y_hori - self.options.y_step * self.options.scaleFactor / 4,
						to_x_hori, to_y_hori);
	} else if (from_y_hori < to_y_hori) {
	  ctx.bezierCurveTo(from_x_hori - self.options.x_step * self.options.scaleFactor / 3 * 2,
						from_y_hori - self.options.y_step * self.options.scaleFactor / 4,
						to_x_hori + self.options.x_step * self.options.scaleFactor / 3 * 2,
						to_y_hori + self.options.y_step * self.options.scaleFactor / 4,
						to_x_hori, to_y_hori);
	}
	
  } else {
	var from_x = self.options.width * self.options.scaleFactor - (self.from + 1) * self.options.x_step * self.options.scaleFactor;
	var from_y = (self.commit.idx + 0.5) * self.options.y_step * self.options.scaleFactor;

	var to_x = self.options.width * self.options.scaleFactor - (self.to + 1) * self.options.x_step * self.options.scaleFactor;
	var to_y = (self.commit.idx + 0.5 + 1) * self.options.y_step * self.options.scaleFactor;

	ctx.strokeStyle = self.commit.graph.get_color(self.branch);
	ctx.beginPath();
	ctx.moveTo(from_x, from_y);
	if (from_x === to_x) {
	  ctx.lineTo(to_x, to_y);
	} else {
	  ctx.bezierCurveTo(from_x - self.options.x_step * self.options.scaleFactor / 4,
                        from_y + self.options.y_step * self.options.scaleFactor / 3 * 2,
                        to_x + self.options.x_step * self.options.scaleFactor / 4,
                        to_y - self.options.y_step * self.options.scaleFactor / 3 * 2,
                        to_x, to_y);
	}
  }

  ctx.stroke();
};

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
  self.routes = $.map(data[2], function(e) { return new Route(self, e, options); });
}

Commit.prototype.drawDot = function ( ctx ) {
  var self = this;
  var radius = self.options.dotRadius;	// dot radius
  
  if (self.options.orientation === "horizontal") {
	var x_hori = self.options.width * self.options.scaleFactor - (self.idx + 0.5) * self.options.x_step * self.options.scaleFactor;
	var y_hori = (self.dot_offset + 1) * self.options.y_step * self.options.scaleFactor;
    ctx.fillStyle = self.graph.get_color(self.dot_branch);
    ctx.beginPath();
    ctx.arc(x_hori, y_hori, radius * self.options.scaleFactor, 0, 2 * Math.PI, true);

  } else {
	var x = self.options.width * self.options.scaleFactor - (self.dot_offset + 1) * self.options.x_step * self.options.scaleFactor;
	var y = (self.idx + 0.5) * self.options.y_step * self.options.scaleFactor;
    ctx.fillStyle = self.graph.get_color(self.dot_branch);
    ctx.beginPath();
    ctx.arc(x, y, radius * self.options.scaleFactor, 0, 2 * Math.PI, true);
  }
  // ctx.stroke();
  ctx.fill();
};

// -- Graph Canvas --------------------------------------------------------

function backingScale() {
    if ('devicePixelRatio' in window) {
        if (window.devicePixelRatio > 1) {
            return window.devicePixelRatio;
        }
    }
    return 1;
}

function GraphCanvas( data, options ) {
  var self = this;

  self.data = data;
  self.options = options;
  self.canvas = document.createElement("canvas");
  self.canvas.style.height = options.height + "px";
  self.canvas.style.width = options.width + "px";
  self.canvas.height = options.height;
  self.canvas.width = options.width;

  var scaleFactor = backingScale();
  if (self.options.orientation === "horizontal") {
	if (scaleFactor < 1) {
	  self.canvas.width = self.canvas.width * scaleFactor;
	  self.canvas.height = self.canvas.height * scaleFactor;
	}
  } else {
	if (scaleFactor > 1) {
	  self.canvas.width = self.canvas.width * scaleFactor;
	  self.canvas.height = self.canvas.height * scaleFactor;
	}
  }
	  
  self.options.scaleFactor = scaleFactor;

  // or use context.scale(2,2) // not tested

  self.colors = [
    "#e11d21",
    //"#eb6420",
    "#fbca04",
    "#009800",
    "#006b75",
    "#207de5",
    "#0052cc",
    "#5319e7",
    "#f7c6c7",
    "#fad8c7",
    "#fef2c0",
    "#bfe5bf",
    "#c7def8",
    "#bfdadc",
    "#bfd4f2",
    "#d4c5f9",
    "#cccccc",
    "#84b6eb",
    "#e6e6e6",
    "#ffffff",
    "#cc317c"
  ];
  // self.branch_color = {};
}

GraphCanvas.prototype.toHTML = function () {
  var self = this;

  self.draw();

  return $(self.canvas);
};

GraphCanvas.prototype.get_color = function (branch) {
  var self = this;

  var n = self.colors.length;
  return self.colors[branch % n];
};

/*

[
  sha,
  [offset, branch], //dot
  [
    [from, to, branch],  // route1
    [from, to, branch],  // route2
    [from, to, branch],
  ]  // routes
],

*/
// draw
GraphCanvas.prototype.draw = function () {
  var self = this,
      ctx = self.canvas.getContext("2d");

  ctx.lineWidth = self.options.lineWidth;
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

// -- Function for finding max in data to determine total branches ------------

/*!
Maximum function is reused from the d3.js Javascript library (d3.max)

Copyright (c) 2010-2014, Michael Bostock
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* The name Michael Bostock may not be used to endorse or promote products
  derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

Maximum = function(array, f) {
    var i = -1, n = array.length, a, b;
    if (arguments.length === 1) {
      while (++i < n && !((a = array[i]) != null && a <= a)) { a = undefined; }
      while (++i < n) { if ((b = array[i]) != null && b > a) { a = b; } }
    } else {
      while (++i < n && !((a = f.call(array, array[i], i)) != null && a <= a)) { a = undefined; }
      while (++i < n) { if ((b = f.call(array, array[i], i)) != null && b > a) { a = b; } }
    }
    return a;
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
        orientation: "vertical",
        dotRadius: 3,
        lineWidth: 2,
			};

	self.element    = element;
	self.$container = $( element );
	self.data = self.$container.data( "graph" );
	
	var x_step = $.extend( {}, defaults, options ).x_step;
	var y_step = $.extend( {}, defaults, options ).y_step;

	if (options.orientation === "horizontal") {
	  defaults.width = ( self.data.length + 2 ) * x_step;
	  defaults.height = Maximum(Maximum(self.data, function(array) { return Maximum(array.slice(1)); })) * y_step;
	} else {
	  defaults.width = Maximum(Maximum(self.data, function(array) { return Maximum(array.slice(1)); })) * x_step;
	  defaults.height = ( self.data.length + 2 ) * y_step;
	}

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
