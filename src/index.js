import { CodeMirror } from 'inkdrop'
import { runCommand } from './helper'

module.exports = {
  activate () {
    this.originalCommand = CodeMirror.commands.newlineAndIndentContinueMarkdownList
    CodeMirror.commands.newlineAndIndentContinueMarkdownList = this.command.bind(this)
  },

  command (cm) {
    runCommand(cm)
    this.originalCommand(cm)
  },

  deactivate () {
    CodeMirror.commands.newlineAndIndentContinueMarkdownList = this.originalCommand
  }
}
