module.exports = function(grunt) {

	grunt.initConfig({

		// Meta informations
		pkg: grunt.file.readJSON('package.json'),
		meta: {
      src: 'js/src/',
      dest: 'js/dist/',
      filename: 'jquery.<%= pkg.name %>',
			banner: '/*\n' +
				' *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' +
				' *  <%= pkg.description %>\n' +
				' *  <%= pkg.homepage %>\n' +
				' *\n' +
				' *  Copyright (c) <%= grunt.template.today("yyyy") %>\n' +
				' *  MIT License\n' +
				' */\n'
		},

		concat: {
			options: {
				banner: '<%= meta.banner %>'
			},
			dist: {
				src: ['<%= meta.src %><%= meta.filename %>.js'],
				dest: '<%= meta.dest %><%= meta.filename %>.js'
			}
		},

		jshint: {
			files: ['<%= meta.src %><%= meta.filename %>.js'],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>'
			},
			my_target: {
				src: ['<%= meta.dest %><%= meta.filename %>.js'],
				dest: '<%= meta.dest %><%= meta.filename %>.min.js'
			}
		},

		// Run JSHint, concat, minify and send it to the dist folder
		// any time a file is added, changed or deleted
		watch: {
			files: ['**/*'],
			tasks: ['jshint', 'concat', 'uglify'],
		}

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
	grunt.registerTask('test', ['jshint']);

};
