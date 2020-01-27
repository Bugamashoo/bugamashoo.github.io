module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-commands');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.initConfig({

        build_dir: 'build',
        compile_dir: 'dist',
        docs_dir: 'api-docs',

        plugin: [

            'src/plugin/World.js',
            'src/plugin/Body.js',
            'src/plugin/PointProxy.js',
            'src/plugin/DefaultDebugDraw.js',
            'src/plugin/DefaultContactListener.js',
            'src/plugin/Polygon.js'

        ],

        clean: {

            docs: [ './api-docs/*' ],
            plugin: [ './dist/minified/*', './dist/testing/*' ]

        },

        concat: {

            plugin: {
                src: ['<%= plugin %>'],
                dest: '<%= build_dir %>/box2d-plugin.js'
            },

            full: {
                src: ['src/box2d/box2d-html5.js', '<%= plugin %>'],
                dest: '<%= build_dir %>/box2d-plugin-full.js'
            },

            scramble: {
                src: ['src/phaser-arcade-physics.js', 'src/box2d/box2d-html5.js', '<%= plugin %>'],
                dest: '<%= build_dir %>/phaser-230-box2d.js'
            }

        },

        uglify: {

            plugin: {
                options: {
                    banner: '/* Phaser Box2D Plugin by Photon Storm. Built: <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                },
                src: ['<%= concat.plugin.dest %>'],
                dest: '<%= build_dir %>/box2d-plugin.min.js'
            },

            box2d: {
                src: ['src/box2d/box2d-html5.js'],
                dest: '<%= build_dir %>/box2d-html5.min.js'
            },

            full: {
                options: {
                    banner: '/* Phaser Box2D Plugin by Photon Storm. Built: <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                },
                src: ['<%= concat.full.dest %>'],
                dest: '<%= build_dir %>/box2d-plugin-full.min.js'
            }

        },

        copy: {
            main: {
                files: [
                    { src: ['src/box2d/box2d-html5.js'], dest: 'dist/testing/box2d-html5.js' },
                    { src: ['build/box2d-html5.min.js'], dest: 'dist/minified/box2d-html5.min.js' },
                    { src: ['build/box2d-plugin.js'], dest: 'dist/testing/box2d-plugin.js' },
                    { src: ['build/box2d-plugin.min.js'], dest: 'dist/minified/box2d-plugin.min.js' },
                    { src: ['build/box2d-plugin-full.js'], dest: 'dist/testing/box2d-plugin-full.js' },
                    { src: ['build/box2d-plugin-full.min.js'], dest: 'dist/minified/box2d-plugin-full.min.js' },
                    { src: ['build/box2d-plugin-full.min.js'], dest: 'examples/js/box2d-plugin-full.min.js' },
                    { src: ['build/box2d-plugin-full.min.js'], dest: 'examples-extra/js/box2d-plugin-full.min.js' }
                ]
            }
        },

        jshint: {

            src: {
                src: [
                    'src/plugin/*.js',
                    '!src/box2d/box2d-html5.js'
                ],
                options: { jshintrc: '.jshintrc' }
            }

        },

        jsdoc : {
            dist : {
                src: [
                    'src/plugin/*.js', 
                    'build-docs/README.md'
                ],
                options: {
                    destination: "api-docs",
                    template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
                    configure : "./build-docs/conf.json",
                    private: false,
                    recurse: true,
                    lenient: false
                }
            }
        },

        compress: {
          standard: {
            options: {
              archive: 'phaser-box2d-plugin-standard-v10X.zip'
            },
            files: [
              {src: ['api-docs/**']}, 
              {src: ['build/**']}, 
              {src: ['build-docs/**']}, 
              {src: ['dist/**']}, 
              {src: ['examples/**']}, 
              {src: ['manual/**']}, 
              {src: ['src/**']}, 
              {src: ['.gitignore']}, 
              {src: ['.jshintrc']}, 
              {src: ['Gruntfile.js']}, 
              {src: ['package.json']}
            ]
          },
          premium: {
            options: {
              archive: 'phaser-box2d-plugin-v10X.zip'
            },
            files: [
              {src: ['api-docs/**']}, 
              {src: ['build/**']}, 
              {src: ['build-docs/**']}, 
              {src: ['dist/**']}, 
              {src: ['examples/**']}, 
              {src: ['examples-extra/**']}, 
              {src: ['manual/**']}, 
              {src: ['src/**']}, 
              {src: ['.gitignore']}, 
              {src: ['.jshintrc']}, 
              {src: ['Gruntfile.js']}, 
              {src: ['package.json']}
            ]
          }
        }

    });

    grunt.registerTask('default', ['clean:plugin', 'concat', 'uglify', 'copy']);
    grunt.registerTask('docs', ['clean:docs', 'jsdoc']);
    grunt.registerTask('scramble', ['concat:scramble']);

    /*
        Run 'grunt compress' AFTER JS Scramble on the plugin
     */
    grunt.registerTask('full', ['clean',  'concat', 'uglify', 'copy', 'jsdoc']);

};
