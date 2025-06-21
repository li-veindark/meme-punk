import React from 'react';


export default function FlickerText({ text, highlight = "" }) {
  return (
    <h1 className=" duel text-center text-8xl pt-24 pb-12 flex flex-wrap justify-center">
      {text.split('').map((char, i) => {
        const isSpace = char === ' ';
        const isHighlight = highlight.includes(char.toUpperCase());
        return (
          <span
            key={i}
            className={`fade-flicker ${isHighlight ? 'highlight' : ''}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {isSpace ? '\u00A0' : char}
          </span>
        );
      })}
    </h1>
  );
}
