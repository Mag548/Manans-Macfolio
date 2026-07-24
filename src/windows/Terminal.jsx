import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import WindowWrapper from '#hoc/WindowWrapper.jsx';
import WindowControls from '#components/WindowControls.jsx';
import useWindowStore from '#store/window.js';
import { BOOT_MESSAGE, runCommand } from '#constants/terminal.js';

const PROMPT = '@manan %';

const snapCommandToTop = (body, commandEl) => {
  if (!body || !commandEl) return;

  const paddingTop = parseFloat(getComputedStyle(body).paddingTop) || 0;
  const styles = getComputedStyle(body);
  const lineGap = parseFloat(styles.rowGap || styles.gap) || 4;
  // Nudge one line further so the command sits one line higher in the pane
  const lineNudge = (commandEl.offsetHeight || 20) + lineGap;

  const spacer = body.querySelector('.terminal-scroll-spacer');
  if (spacer) {
    spacer.style.height = `${body.clientHeight}px`;
  }

  void body.offsetHeight;
  const delta =
    commandEl.getBoundingClientRect().top -
    body.getBoundingClientRect().top -
    paddingTop +
    lineNudge;
  body.scrollTop += delta;
};

const Terminal = () => {
  const isOpen = useWindowStore((s) => s.windows.terminal?.isOpen);
  const isMinimized = useWindowStore((s) => s.windows.terminal?.isMinimized);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState([
    { id: 'boot', type: 'system', text: BOOT_MESSAGE },
  ]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (isOpen && !isMinimized) focusInput();
  }, [isOpen, isMinimized]);

  const submit = (event) => {
    event.preventDefault();
    const raw = value;
    if (!raw.trim()) {
      setValue('');
      return;
    }

    const commandId = `cmd-${Date.now()}`;
    const echoed = {
      id: commandId,
      type: 'input',
      text: `${PROMPT} ${raw.trim()}`,
    };
    const result = runCommand(raw);

    if (result.clear) {
      flushSync(() => {
        setHistory([{ id: 'boot', type: 'system', text: BOOT_MESSAGE }]);
        setValue('');
      });
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
      return;
    }

    const outputLines = result.lines.map((line, i) => ({
      ...line,
      id: `${commandId}-out-${i}`,
    }));

    flushSync(() => {
      setHistory((prev) => [...prev, echoed, ...outputLines]);
      setValue('');
    });

    const body = bodyRef.current;
    const commandEl = body?.querySelector(`[data-term-id="${commandId}"]`);
    snapCommandToTop(body, commandEl);
    // Second pass after paint in case fonts/layout shift
    requestAnimationFrame(() => snapCommandToTop(body, commandEl));
  };

  return (
    <>
      <div id="window-header">
        <WindowControls target="terminal" />
        <h2>Terminal</h2>
      </div>

      <div className="terminal-body" ref={bodyRef} onClick={focusInput}>
        {history.map((entry) => {
          const className = `terminal-line terminal-${entry.type}`;

          if (entry.type === 'link' && entry.href) {
            return (
              <p
                key={entry.id}
                data-term-id={entry.id}
                className={`${className} terminal-link`}
              >
                <a href={entry.href} target="_blank" rel="noreferrer">
                  {entry.text}
                </a>
              </p>
            );
          }

          return (
            <p key={entry.id} data-term-id={entry.id} className={className}>
              {entry.text}
            </p>
          );
        })}

        <form className="terminal-input-row" onSubmit={submit}>
          <span className="terminal-prompt">{PROMPT}</span>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal command"
          />
        </form>

        <div className="terminal-scroll-spacer" aria-hidden />
      </div>
    </>
  );
};

const TerminalWindow = WindowWrapper(Terminal, 'terminal');

export default TerminalWindow;
