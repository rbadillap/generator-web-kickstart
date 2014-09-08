'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks') ( grunt, {
        pattern: [
            'grunt-*', 
            'assemble'
        ]
    });

    // Configurable paths
    var pkg = require('./package.json');
    var config = require('./config.json').directories;

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: config,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            compass: {
                files: ['<%= config.app %>/scss/**/*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            styles: {
                files: ['<%= config.app %>/css/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            scripts: {
                files: ['<%= config.app %>/js/{,*/}*.js'],
                tasks: ['newer:copy:js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '.tmp/{,*/}*.html',
                    '.tmp/css/{,*/}*.css',
                    '<%= config.app %>/images/{,*/}*',
                    '<%= config.app %>/scss/**/*.{scss,sass}',
                    '<%= config.app %>/js/**/*.js',
                ],
            },
            assemble: {
                files: [
                    '<%= config.app %>/theme/{,*/}*.hbs',
                ],
                tasks: ['assemble']
            }
        },

        assemble: {
            options: {
                layout: 'default.hbs',
                layoutdir: '<%= config.app %>/theme/layouts/',
                partials: '<%= config.app %>/theme/partials/*.hbs',
                flatten: true
            },
            pages: {
                files: {
                    '.tmp/': ['<%= config.app %>/theme/pages/*.hbs', '<%= config.app %>/theme/pages/index.hbs']
                }
            },
            index: {
                files: {
                    '.tmp/': ['<%= config.app %>/theme/pages/index.hbs']
                }
            },
            common: {
                options: {layout: 'common.hbs' },
                files: {
                    '.tmp/common/': ['<%= config.app %>/theme/common/*.hbs']
                }
            }            
        },

        compass: {
            server: {
                options: {
                    sassDir: '<%= config.app %>/scss',
                    cssDir: '.tmp/css',
                    generatedImagesDir: '.tmp/images',
                    imagesDir: '<%= config.app %>/images',
                    javascriptsDir: '<%= config.app %>/js',
                    fontsDir: '<%= config.app %>/fonts',
                    // importPath: 'app/js/vendor',
                    httpImagesPath: '/images',
                    httpGeneratedImagesPath: '/images',
                    httpFontsPath: '<%= config.app %>/fonts',
                    relativeAssets: false,
                    noLineComments: false,
                    debugInfo: false,
                    force: true,
                }
            },
            dist: {
                options: {
                    sassDir: '<%= config.app %>/scss',
                    cssDir: '.tmp/css',
                    generatedImagesDir: '<%= config.dist %>/images',
                    imagesDir: '<%= config.app %>/images',
                    javascriptsDir: '<%= config.app %>/js',
                    fontsDir: '<%= config.app %>/fonts',
                    // importPath: 'app/js/vendor',
                    httpImagesPath: '../images',
                    httpGeneratedImagesPath: '../images',
                    httpFontsPath: '<%= config.app %>/fonts',
                    relativeAssets: false,
                    noLineComments: true,
                    debugInfo: false,
                    force: true,
                }
            },
            clean: {
                options: {
                    clean: true
                }
            }
        },
        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                open: true,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                //hostname: 'localhost'
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect().use('/bower_components', connect.static('./bower_components')),
                            connect.static(config.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    open: false,
                    port: 9001,
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect.static('test'),
                            connect().use('/bower_components', connect.static('./bower_components')),
                            connect.static(config.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    base: '<%= config.dist %>',
                    livereload: false
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/css/',
                    src: '{,*/}*.css',
                    dest: '.tmp/css/'
                }]
            }
        },

        bowercopy: {
            options: {
                srcPrefix: 'bower_components'
            },
            scripts: {
                options: {
                    destPrefix: '<%= config.app %>/js'
                },
                files: {
                    'jquery.min.js': 'jquery-1.x/dist/jquery.min.js'
                }
            },
            styles: {
                options: {
                    destPrefix: '.tmp/css'
                },
                files: {
                    'normalize.css': 'normalize-css/normalize.css'
                }
            },
        },

        // CSS minify
        cssmin: {
            dist: {
                files: {
                    '<%= config.dist %>/css/main.css': [
                        '.tmp/css/{,*/}*.css',
                        '<%= config.app %>/css/{,*/}*.css',
                        '!.tmp/css/normalize.css',
                    ]
                }
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [
                { // Files present in the app folder
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,txt,xml}',
                        '.htaccess',
                        'images/{,*/}*.{jpg,png,gif}',
                        'js/{,*/}*.*',
                    ]
                },
                { // Files present in .tmp folder
                    expand: true,
                    dot: true,
                    cwd: '.tmp',
                    dest: '<%= config.dist %>',
                    src: [
                        '{,*/}*.html',
                        'js/{,*/}*.*',
                        'css/{,*/}*.*',
                    ]
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>/css',
                dest: '.tmp/css/',
                src: '{,*/}*.css'
            },
            js: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>/js',
                dest: '.tmp/js/',
                src: '{,*/}*.js'
            } 
        },

        // Run some tasks in parallel to speed up build process
        concurrent: {
            server: [
                'compass:server',
                'copy:styles',
                'copy:js',
                'assemble',
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'compass:clean',
                'compass:dist',
                'assemble',
            ],
        }
    });


    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'bowercopy',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'concurrent:dist',
        'bowercopy',
        'copy:styles',
        'copy:js',
        'copy:dist',
        'autoprefixer',
        'cssmin',
    ]);
    grunt.registerTask('default', function () {
        grunt.task.run(['server']);
    });

};
