module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-html2js');

    // Default task.
    grunt.registerTask('default', ['init-product', 'clean', 'html2js', 'concat', 'uglify', 'recess', 'copy']);
    grunt.registerTask('dev', ['init-dev', 'clean', 'html2js', 'concat', 'recess', 'copy']);
    grunt.registerTask('test', ['init-test', 'clean', 'html2js', 'concat', 'recess', 'uglify', 'copy']);

    // Print a timestamp (useful for when watching)
    grunt.registerTask('timestamp', function () {
        grunt.log.subhead(Date());
    });

    grunt.registerTask('init-dev', function () {
        grunt.config.merge({
            envVariable: require('./config')('dev'),
            copy: {
                js: {
                    files: [{dest: '<%= distdir %>/<%= pkg.name %>.js', src: 'temp/<%= pkg.name %>.js'}]
                }
            }
        });
    });

    grunt.registerTask('init-test', function () {
        grunt.config.merge({
            envVariable: require('./config')('test'),
            recess: {
                build: {
                    options: {
                        compress: true
                    }
                }
            },
            copy: {
                js: {
                    files: [{dest: '<%= distdir %>/<%= pkg.name %>.js', src: 'temp/<%= pkg.name %>.js'}]
                }
            }
        });
    });

    grunt.registerTask('init-product', function () {
        grunt.config.merge({
            envVariable: !require('./config')('product'),
            recess: {
                build: {
                    options: {
                        compress: true
                    }
                }
            },
            copy: {
                js: {
                    files: [{dest: '<%= distdir %>/<%= pkg.name %>.js', src: 'temp/<%= pkg.name %>.min.js'}]
                }
            }
        });
    });

    var karmaConfig = function (configFile, customOptions) {
        var options = {configFile: configFile, keepalive: true};
        var travisOptions = process.env.TRAVIS && {browsers: ['Chrome'], reporters: 'dots'};
        return grunt.util._.extend(options, customOptions, travisOptions);
    };

// Project configuration.
    grunt.initConfig({
        //distdir: 'C:/APICloud/workspace/fdb',
        distdir: 'dist',
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        src: {
            js: ['src/**/*.js'],
            jsTpl: ['temp/tpl/**/*.js'],
            specs: ['test/**/*.spec.js'],
            scenarios: ['test/**/*.scenario.js'],
            html: ['src/index.html'],
            tpl: {
                app: ['src/app/**/*.tpl.html'],
                common: ['src/common/**/*.tpl.html']
            },
            less: ['src/less/**/*.less'], // recess:build doesn't accept ** in its file patterns
            lessWatch: ['src/less/**/*.less']
        },
        clean: ['<%= distdir %>/*', 'temp'],
        copy: {
            assets: {
                files: [{dest: '<%= distdir %>', src: '**', expand: true, cwd: 'src/assets/'},
                    {dest: '<%= distdir %>/img', src: '**', expand: true, cwd: 'src/less/img'}]
            },
            vendor: {
                files: [
                    {
                        dest: '<%= distdir %>/vendor/ng-dialog/css',
                        src: '**',
                        expand: true,
                        cwd: 'node_modules/ng-dialog/css/'
                    },
                    {
                        dest: '<%= distdir %>/vendor/bootstrap/',
                        src: '**',
                        expand: true,
                        cwd: 'node_modules/bootstrap/dist/'
                    },
                    {dest: '<%= distdir %>/vendor/jquery/jquery.js', src: 'node_modules/jquery/dist/jquery.js'},
                    {dest: '<%= distdir %>/vendor/modernizr-2.6.2.min.js', src: 'vendor/modernizr-2.6.2.min.js'},
                    {dest: '<%= distdir %>/vendor/normalize.css', src: 'vendor/normalize.css'},
                    {
                        dest: '<%= distdir %>/vendor/iscroll.js',
                        src: 'node_modules/angular-iscroll/node_modules/iscroll/build/iscroll.js'
                    },
                    {
                        dest: '<%= distdir %>/vendor/material-date-picker/build',
                        src: '**',
                        expand: true,
                        cwd: 'node_modules/material-date-picker/build/'
                    },
                    {dest: '<%= distdir %>/vendor/moment', src: '**', expand: true, cwd: 'node_modules/moment'},
                    {dest: '<%= distdir %>/vendor/api/api.js', src: 'vendor/api.js'},
                    {dest: '<%= distdir %>/vendor/common.js', src: 'vendor/common.js'},
                    {dest: '<%= distdir %>/vendor/hammer.js', src: 'node_modules/hammerjs/hammer.js'}
                ]
            }
        },
        html2js: {
            app: {
                options: {
                    base: 'src/app'
                },
                src: ['<%= src.tpl.app %>'],
                dest: 'temp/tpl/app.js',
                module: 'templates.app'
            },
            common: {
                options: {
                    base: 'src/common'
                },
                src: ['<%= src.tpl.common %>'],
                dest: 'temp/tpl/common.js',
                module: 'templates.common'
            }
        },
        concat: {
            dist: {
                options: {
                    banner: "<%= banner %>",
                    process: true
                },
                src: ['<%= src.js %>', '<%= src.jsTpl %>'],
                dest: 'temp/<%= pkg.name %>.js'
            },
            index: {
                src: ['src/index.html'],
                dest: '<%= distdir %>/index.html',
                options: {
                    process: true
                }
            },
            angular: {
                src: ['node_modules/angular/angular.js', 'node_modules/angular-route/angular-route.js',
                    'node_modules/ng-dialog/js/ngDialog.js', 'node_modules/angular-resource/angular-resource.js',
                    'node_modules/angular-touch/angular-touch.js', 'node_modules/angular-iscroll/dist/lib/angular-iscroll.js',
                    'node_modules/material-date-picker/build/mbdatepicker.js', 'node_modules/angular-hammer/angular.hammer.js'],
                dest: '<%= distdir %>/vendor/angular/angular.js'
            }
        },
        uglify: {
            dist: {
                files: {
                    'temp/<%= pkg.name %>.min.js': 'temp/<%= pkg.name %>.js'
                }
            }
        },
        recess: {
            build: {
                files: {
                    '<%= distdir %>/<%= pkg.name %>.css': ['<%= src.less %>']
                },
                options: {
                    compile: true
                }
            }
        }
    });
}
;