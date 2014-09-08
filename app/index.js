'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var WebKickstartGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to Web Kickstart Generator!'
    ));

    var prompts = [{
      name: 'appName',
      message: 'Would you mind telling me your project base name?',
      default: 'my-project'
    }];

    this.prompt(prompts, function (props) {
      this.appName = props.appName;

      done();
    }.bind(this));
  },

  writing: {

    projectfiles: function () {
      this.template('_package.json', 'package.json');
      this.template('_config.json', 'config.json');
      this.template('_bower.json', 'bower.json');
      this.template('editorconfig', '.editorconfig');
    },

    gitfiles: function() {
      this.src.copy('gitignore', '.gitignore');
    },

    gruntfile: function() {
      this.src.copy('Gruntfile.js', 'Gruntfile.js');
    },

    app: function () {
      // App
      this.dest.mkdir('app');
      // Images + Sprites
      this.dest.mkdir('app/images');
      this.dest.mkdir('app/images/sprites');
      // JS
      this.dest.mkdir('app/js');
      // Sass
      this.dest.mkdir('app/scss');
      this.dest.mkdir('app/scss/_utils');
      // Assemble
      this.dest.mkdir('app/theme');
      this.dest.mkdir('app/theme/common');
      this.dest.mkdir('app/theme/layouts');
      this.dest.mkdir('app/theme/pages');
      this.dest.mkdir('app/theme/partials');

      // Files
      // Images
      this.src.copy('app/images/logo.png', 'app/images/logo.png');
      this.src.copy('app/images/sprites/button.png', 'app/images/sprites/button.png');
      this.src.copy('app/images/sprites/button_hover.png', 'app/images/sprites/button_hover.png');

      // JS
      this.template('app/js/main.js', 'app/js/main.js');

      // Sass
      this.template('app/scss/main.scss', 'app/scss/main.scss');
      this.template('app/scss/_utils/_sprites.scss', 'app/scss/_utils/_sprites.scss');

      // Assemble
      this.template('app/theme/common/form.hbs', 'app/theme/common/form.hbs');
      this.template('app/theme/common/video.hbs', 'app/theme/common/video.hbs');

      this.template('app/theme/layouts/common.hbs', 'app/theme/layouts/common.hbs');
      this.template('app/theme/layouts/default.hbs', 'app/theme/layouts/default.hbs');

      this.template('app/theme/pages/index.hbs', 'app/theme/pages/index.hbs');
      this.template('app/theme/pages/internal.hbs', 'app/theme/pages/internal.hbs');
      
      this.template('app/theme/partials/header.hbs', 'app/theme/partials/header.hbs');
      this.template('app/theme/partials/footer.hbs', 'app/theme/partials/footer.hbs');
    },

  },

  end: function () {
    this.installDependencies();
  }
});

module.exports = WebKickstartGenerator;
