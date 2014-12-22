'use strict';

module.exports = function(grunt) {

  //Load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-markdown');
  grunt.loadNpmTasks('grunt-macreload');
  grunt.loadNpmTasks('grunt-angular-gettext');

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        process: function(src, filepath) {
          if (filepath.substr(filepath.length - 2) === 'js') {
            return '// Source: ' + filepath + '\n' +
              src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          } else {
            return src;
          }
        }
      },
      main: {
        src: ['public/src/js/app.js', 'public/src/js/controllers/*.js', 'public/src/js/services/*.js', 'public/src/js/directives.js', 'public/src/js/filters.js', 'public/src/js/config.js', 'public/src/js/init.js', 'public/src/js/translations.js'],
        dest: 'public/js/main.js'
      },
      css: {
        src: ['public/lib/bootstrap/dist/css/bootstrap.min.css', 'public/src/css/**/*.css'],
        dest: 'public/css/main.css'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n',
        mangle: false
      },
      main: {
        src: 'public/js/main.js',
        dest: 'public/js/main.min.js'
      }
    },
    cssmin: {
      css: {
        src: 'public/css/main.css',
        dest: 'public/css/main.min.css'
      }
    },
    markdown: {
      all: {
        files: [
         {
           expand: true,
           src: 'README.md',
           dest: '.',
           ext: '.html'
         }
        ]
      }
    },
    macreload: {
      chrome: {
        browser: 'chrome',
        editor: 'macvim'
      }
    },
    watch: {
      main: {
        files: ['public/src/js/**/*.js'],
        tasks: ['concat:main', 'uglify:main'],
      },
      css: {
        files: ['public/src/css/**/*.css'],
        tasks: ['concat:css', 'cssmin'],
      },
    },
    nggettext_extract: {
      pot: {
        files: {
          'po/template.pot': ['public/views/*.html', 'public/views/**/*.html']
        }
      },
    },
    nggettext_compile: {
      all: {
        options: {
          module: 'insight'
        },
        files: {
          'public/src/js/translations.js': ['po/*.po']
        }
      },
    }
  });

  //Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  //Default task(s).
  grunt.registerTask('default', ['watch']);

  //Update .pot file
  grunt.registerTask('translate', ['nggettext_extract']);

  //Compile task (concat + minify)
  grunt.registerTask('compile', ['nggettext_compile', 'concat', 'uglify', 'cssmin']);


};
