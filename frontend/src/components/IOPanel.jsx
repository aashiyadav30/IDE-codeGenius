import React from "react";

const IOPanel = ({ inputText, setInputText, outputText, setOutputText }) => {
  return (
    <div className="io-container">
      <div>
        <label htmlFor="input">Input</label>
        <textarea
          id="input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="output">Output</label>
        <textarea
          id="output"
          value={outputText}
          onChange={(e) => setOutputText(e.target.value)}
        />
      </div>
    </div>
  );
};

export default IOPanel;
