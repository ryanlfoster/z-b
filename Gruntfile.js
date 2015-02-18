/*
    Gruntfile. To run:
    - install node
    - run `npm install` in the root directory
    - type in `grunt` to do run the build
    - type in `grunt watch` whilst developing


    Check out the registerTask statements at the bottom for an idea of
    task grouping.
*/
module.exports = function(grunt) {

    grunt.initConfig({
        /*  Read the package.json file for config values.
            package.json keeps devDependencies as well, which make it easy
            for us to track and install node dependencies
        */
        pkg: grunt.file.readJSON('package.json'),

        // Compass uses config.rb automatically so we don't need to specify anything
        compass: {
            build: {
                options: {
                    outputStyle: 'expanded'
                }
            }
        },

        /*  Concat concatenates the minified jQuery and our uglified code.
            We should try to refrain from re-minifying libraries because
            they probably do a better job of minifying their own code then us.
        */
        concat: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */\n'
            },
            dist: {
                src: [
                    'javascripts/vendor/jquery-1.10.2.min.js',
                    'javascripts/main.min.js'
                ],
                dest: 'javascripts/dist.min.js'
            }
        },

        /*  Uglify seems to be the industry standard for minification and obfuscation nowadays.
            TODO: rework the plugins file, remove the already-minified bits and add them to the concat task
            TODO: optimise uglify parameters to give better results
        */
        uglify: {
            build: {
                src: [
                    'javascripts/plugins.js',
                    'javascripts/foundation/foundation.dropdown.js',
                    'javascripts/foundation/foundation.interchange.js',
                    'javascripts/foundation/foundation.section.js',
                    'javascripts/foundation/foundation.forms.js',
                    'javascripts/foundation/foundation.magellan.js',
                    'javascripts/main.js'
                ],
                dest: 'javascripts/main.min.js'
            }
        },

        // minify css
        cssmin: {
          add_banner: {
            options: {
               banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */\n'
            },
            files: {
              'stylesheets/app.min.css': ['stylesheets/app.css']
            }
          }
        },

        uncss: {
            dist: {
                files: {
                    'stylesheets/app.tidy.css': ['*.html', 'includes/containers/*.html']
                }
            },
            options: {
                // compress: true,
                // csspath: "stylesheets",
                stylesheets: ['/stylesheets/app.min.css'],
                ignore: ['.js', '.off-canvas-menu']
            }
        },

        processhtml: {
            dist: {
                files: {
                    'includes/site-chrome/header.html': ['includes/site-chrome/header.html']
                }
            }
        },
        bless: {
            css: {
                options: {
                    cacheBuster: false,
                    compress: true
                },
                files: {
                    'stylesheets/app-ie.css': 'stylesheets/ie.tmp.css'
                }
            }
        },
        stripmq: {
            options: {
                width: 769,     // viewport width, default is 1024
                height: 480,    // viewport height, default is 768
                resolution: '2dppx'          // default is 1dppx
            },
            all: {
                files: {
                    'stylesheets/ie.tmp.css': ['stylesheets/app.min.css']
                }
            }
        },

        watch: {
            css: {
                files: 'sass/**/*.scss',
                tasks: ['compass'],
                options: {
                    livereload: true
                }
            }
        }
    });

    /*  Loading the grunt plugins.
        If you're having problems loading any plugins, make sure you have the latest package.json file
        and try running `npm install`.
    */
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-bless');
    grunt.loadNpmTasks('grunt-stripmq');

    /*  The default task runs when you just run `grunt`.
        "js" and "css" tasks process their respective files.

        TODO: add a cleanup task
    */
    grunt.registerTask('css', ['compass']);
    grunt.registerTask('js', ['uglify', 'concat']);

    grunt.registerTask('default', ['compass', 'uncss', 'processhtml']);

    // split out css for IE
    grunt.registerTask('ie', ['compass', 'cssmin', 'stripmq', 'bless']);
};