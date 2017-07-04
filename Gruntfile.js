module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      'js': {
        files: [{
          expand: true,
          cwd: 'src/js/',
          src: ['**'],
          dest: 'dist/js/'
        }]
      },
      'static': {
        files: [{
          expand: true,
          dot: true,
          cwd: 'src/static/',
          src: ['**'],
          dest: 'dist/'
        }]
      }
    },

    eslint: {
      "cosmos": ['src/js/**/*.js']
    },

    prettier: {
      options: {
        semi: false,
        singleQuote: true
      },
      "src": {
        src: ["src/js/**/*.js"]
      }
    },

    watch: {
      "js": {
        files: ['src/js/**/*.js'],
        tasks: ['js']
      },
      'static': {
        files: ['src/static/**/*.*'],
        tasks: ['static']
      }
    }

  })

  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-eslint')
  grunt.loadNpmTasks('grunt-prettier')

  grunt.registerTask('default', ['js', 'static'])
  grunt.registerTask('js', ['prettier', 'eslint', 'copy:js'])
  grunt.registerTask('static', ['copy:static'])

}
