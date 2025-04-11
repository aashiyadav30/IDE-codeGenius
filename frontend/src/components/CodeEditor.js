import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const languageMap = {
  Cpp: "cpp",
  Java: "java",
  Python: "python",
};

const extensionMap = {
  Cpp: ".cpp",
  Java: ".java",
  Python: ".py",
};

const CodeEditor = () => {
  const [language, setLanguage] = useState("Cpp");
  const [filename, setFilename] = useState("untitled.cpp");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const editorRef = useRef(null);

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
  
    setFilename((prev) => {
      const nameWithoutExt = prev.replace(/\.\w+$/, '');
      return nameWithoutExt + extensionMap[selectedLang];
    });
  };
  
  const handleRun = async () => {
    try {
      const response = await axios.post("http://localhost:8000/compile", {
        code,
        input,
        lang: language,
      });
      setOutput(response.data.output);
    } catch (err) {
      setOutput("Error connecting to server.");
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  // ✅ Dispose editor on unmount to avoid memory leaks or "Canceled" error
  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  return (
    <div>
      <div className="toolbar">
        <select value={language} onChange={handleLanguageChange}>
          <option value="Cpp">C++</option>
          <option value="Java">Java</option>
          <option value="Python">Python</option>
        </select>
        <input
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />
        <button onClick={handleRun}>Run</button>
      </div>

      <Editor
        height="400px"
        language={languageMap[language]}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
        onMount={handleEditorDidMount}
      />

      <div className="io">
        <textarea
          placeholder="Input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <textarea placeholder="Output" value={output} readOnly />
      </div>
    </div>
  );
};

export default CodeEditor;