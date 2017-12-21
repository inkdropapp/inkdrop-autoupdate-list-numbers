'use strict';

var _inkdrop = require('inkdrop');

var _helper = require('./helper');

module.exports = {
  activate() {
    this.originalCommand = _inkdrop.CodeMirror.commands.newlineAndIndentContinueMarkdownList;
    _inkdrop.CodeMirror.commands.newlineAndIndentContinueMarkdownList = this.command.bind(this);
  },

  command(cm) {
    (0, _helper.runCommand)(cm);
    this.originalCommand(cm);
  },

  deactivate() {
    _inkdrop.CodeMirror.commands.newlineAndIndentContinueMarkdownList = this.originalCommand;
  }
};