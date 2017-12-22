'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runCommand = runCommand;
exports.incrementRemainingMarkdownListNumbers = incrementRemainingMarkdownListNumbers;

var _inkdrop = require('inkdrop');

const listRE = /^(\s*)(>[> ]*|[*+-]|(\d+)([.)]))(\s*)(\[[\sx]\]\s|)/;
const emptyListRE = /^(\s*)(>[> ]*|[*+-]|(\d+)[.)])(\s*)(\[[\sx]\]\s|)$/;
const unorderedListRE = /[*+-]/;

function runCommand(cm) {
  if (cm.getOption('disableInput')) {
    return _inkdrop.CodeMirror.Pass;
  }
  const ranges = cm.listSelections();
  for (let i = 0; i < ranges.length; i++) {
    const pos = ranges[i].head;
    const line = cm.getLine(pos.line);
    const match = listRE.exec(line);
    if (match && !emptyListRE.test(line)) {
      const numbered = !(unorderedListRE.test(match[2]) || match[2].indexOf('>') >= 0);
      if (numbered) incrementRemainingMarkdownListNumbers(cm, pos);
    }
  }
}

// Auto-updating Markdown list numbers when a new item is added to the
// middle of a list
function incrementRemainingMarkdownListNumbers(cm, pos) {
  const startLine = pos.line;
  let lookAhead = 0;
  let skipCount = 0;
  const startItem = listRE.exec(cm.getLine(startLine));
  const startIndent = startItem[1];

  let nextItem;
  do {
    lookAhead += 1;
    const nextLineNumber = startLine + lookAhead;
    const nextLine = cm.getLine(nextLineNumber);
    nextItem = listRE.exec(nextLine);

    if (nextItem) {
      const nextIndent = nextItem[1];
      const newNumber = parseInt(startItem[3], 10) + lookAhead - skipCount;
      const nextNumber = parseInt(nextItem[3], 10);
      let itemNumber = nextNumber;

      if (!isNaN(newNumber) && !isNaN(nextNumber) && startIndent === nextIndent) {
        if (newNumber === nextNumber) itemNumber = nextNumber + 1;
        if (newNumber > nextNumber) itemNumber = newNumber + 1;
        cm.replaceRange(nextLine.replace(listRE, nextIndent + itemNumber + nextItem[4] + nextItem[5]), {
          line: nextLineNumber, ch: 0
        }, {
          line: nextLineNumber, ch: nextLine.length
        });
      } else {
        if (startIndent.length > nextIndent.length) return;
        // This doesn't run if the next line immediatley indents, as it is
        // not clear of the users intention (new indented item or same level)
        if (startIndent.length < nextIndent.length && lookAhead === 1) return;
        skipCount += 1;
      }
    }
  } while (nextItem);
}