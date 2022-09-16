class Terminal {
  static terminalElRef = document.querySelector('#terminalOutput');

  static createLine(content = '') {
    const line = document.createElement('div');
    line.classList.add('terminal-line');
    line.innerText = content;
    return line;
  }

  static createSuccessLine(content = '') {
    const line = Terminal.createLine(content);
    line.classList.add('success');
    return line;
  }

  static createWarnLine(content = '') {
    const line = Terminal.createLine(content);
    line.classList.add('warn');
    return line;
  }

  static createErrorLine(content = '') {
    const line = Terminal.createLine(content);
    line.classList.add('error');
    return line;
  }

  static print(...args) {
    args.forEach((arg) => {
      const newLine = Terminal.createLine(arg);
      Terminal.terminalElRef.appendChild(newLine);
      Terminal.ScrollToBottom();
    });
  }

  static printSuccess(...args) {
    args.forEach((arg) => {
      const newLine = Terminal.createSuccessLine(arg);
      Terminal.terminalElRef.appendChild(newLine);
    });
    Terminal.ScrollToBottom();
  }

  static printWarn(...args) {
    args.forEach((arg) => {
      const newLine = Terminal.createWarnLine(arg);
      Terminal.terminalElRef.appendChild(newLine);
    });
    Terminal.ScrollToBottom();
  }

  static printError(...args) {
    args.forEach((arg) => {
      const newLine = Terminal.createErrorLine(arg);
      Terminal.terminalElRef.appendChild(newLine);
    });
    Terminal.ScrollToBottom();
  }

  static ScrollToBottom() {
    const viewContainer = document.querySelector('#terminal');
    viewContainer.scrollTop = viewContainer.scrollHeight;
  }
}

module.exports = Terminal;
