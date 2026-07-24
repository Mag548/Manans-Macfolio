import { useEffect, useRef, useState } from 'react';
import WindowWrapper from '#hoc/WindowWrapper.jsx';
import WindowControls from '#components/WindowControls.jsx';
import useWindowStore from '#store/window.js';
import { BOOT_MESSAGE, runCommand } from '#constants/terminal.js';

const PROMPT = '@manan %';

const Terminal = () => {
  const isOpen = useWindowStore((s) => s.windows.terminal?.isOpen);
  const isMinimized = useWindowStore((s) => s.windows.terminal?.isMinimized);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: BOOT_MESSAGE },
  ]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      focusInput();
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [history, value]);

  const submit = (event) => {
    event.preventDefault();
    const raw = value;
    if (!raw.trim()) {
      setValue('');
      return;
    }

    const echoed = { type: 'input', text: `${PROMPT} ${raw.trim()}` };
    const result = runCommand(raw);

    if (result.clear) {
      setHistory([{ type: 'system', text: BOOT_MESSAGE }]);
      setValue('');
      return;
    }

    setHistory((prev) => [...prev, echoed, ...result.lines]);
    setValue('');
  };

  return (
    <>
      <div id="window-header">
        <WindowControls target="terminal" />
        <h2>Terminal</h2>
      </div>

      <div className="terminal-body" onClick={focusInput}>
        {history.map((entry, i) => {
          if (entry.type === 'link' && entry.href) {
            return (
              <p key={i} className="terminal-line terminal-link">
                <a href={entry.href} target="_blank" rel="noreferrer">
                  {entry.text}
                </a>
              </p>
            );
          }

          return (
            <p key={i} className={`terminal-line terminal-${entry.type}`}>
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
        <div ref={bottomRef} />
      </div>
    </>
  );
};

const TerminalWindow = WindowWrapper(Terminal, 'terminal');

export default TerminalWindow;
