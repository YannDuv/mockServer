module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: {
      dev: {
        environment: 'dev'
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          delay: 1000
        }
      }
    }
  });

  // Load tasks libraries
  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', ['env:dev', 'nodemon']);

};
