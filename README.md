# commits-graph

A git commits graph widget using HTML5/Canvas.
Provide a jQuery plugin which make it easy to use.

*inspired by bitbucket*

## Demo

1. [Here](http://oct.tclh123.com/commits-graph/) is a pure HTML5+JS version, which hosted by github pages.
2. [Demo](https://github.com/tclh123/commits-graph/tree/master/demo) is a python version, which shows how I get preformatted data.

    To run it, you should install [libgit2](https://github.com/libgit2/pygit2) first, and then install all python dependencies through `pip install -r demo/requirements.txt`.
    Finally, you can `./tools/run_demo.sh`.

    Try visit,
    - http://localhost:8887
    - http://localhost:8887/?{path}
    
## Options

All of the options have defaults and are not required for execution of the script. (See `demo/` for example)

* `height|width: 600` - Input the desired height|width of the canvas in pixels.
* `orientation: "horizontal"|"vertical"` - Allows the user to plot the graph either horizontally or vertically.
* `margin: "0 0 0 0"` - Specify the margins of the div containing the graph, allowing the user to e.g. center the graph easily in the script.
* `x\_step|y\_step: 20` - Select the step sizes of the graph, i.e. how many pixels between branches and commits.
* `id: "commits-graph"` - Specify which id these options should apply to if the user wishes to have different options for different graphs on a page.
* `dotRadius: 3` - Specify the radius in pixels of the commit dots.
* `lineWidth: 2` - Specify the width of the lines in pixels.

## FAQ

1. How do you get preformatted data to draw this graph?

    see `git/` & `demo/`.

## Preview

![](https://raw2.github.com/tclh123/commits-graph/master/ScreenShot.png)

## License

http://tclh123.mit-license.org/
