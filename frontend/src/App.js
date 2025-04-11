import React, { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import "./App.css";
import Sidebar from "./components/Sidebar";
import axios from "axios";
import AIAssistant from './components/AIAssistant';

const languageToExtension = {
  Cpp: "cpp",
  Java: "java",
  Python: "py",
};

function App() {
  
  const monacoRef = useRef(null);
  const [language, setLanguage] = useState("Cpp");
  const [filename, setFilename] = useState("untitled.cpp");
  const [code, setCode] = useState("// Write your code here");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [files, setFiles] = useState([]);
  const [openFiles, setOpenFiles] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  // AI Assistant related
  const [inlineOn, setInlineOn] = useState(false);
  const [model, setModel] = useState("gpt-4o-mini");
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [activeTab, setActiveTab] = useState("input");
  const [isTyping, setIsTyping] = useState(false);

  const toggleInline = () => setInlineOn(!inlineOn);
  const handleModelChange = (e) => setModel(e.target.value);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;
    const newMessages = [...messages, { sender: "user", text: userMessage }];
    setMessages(newMessages);
    setUserMessage("");

    try {

      const res = await axios.post("https://ide-codegeniusbackend.onrender.com/api/gpt", {
        message: userMessage,
        model,
      });

      setMessages([
        ...newMessages,
        { sender: "ai", text: res.data.reply || "No response." },
      ]);
    } catch (err) {
      console.error("GPT fetch error:", err);
      setMessages([
        ...newMessages,
        { sender: "ai", text: "AI Error: Unable to fetch response." },
      ]);
    }
  };

  useEffect(() => {
    const editor = monaco.editor.create(document.getElementById("editor"), {
      value: code,
      language: language.toLowerCase(),
      theme: isDark ? "vs-dark" : "vs-light",
      automaticLayout: true,
    });
    monacoRef.current = editor;

    return () => editor.dispose();
  }, []);

  useEffect(() => {
    monaco.editor.setTheme(isDark ? "vs-dark" : "vs-light");
  }, [isDark]);

  useEffect(() => {
    monacoRef.current?.setValue(code);
    monaco.editor.setModelLanguage(
      monacoRef.current.getModel(),
      language.toLowerCase()
    );
  }, [language]);

  const handleRun = async () => {
    try {
      const code = monacoRef.current.getValue();

      const res = await axios.post("https://ide-codegeniusbackend.onrender.com/compile", {

        code,
        input: inputText,
        language,
      });
  
      setActiveTab("output");
      
      if (res.data.error) {
        setOutputText(res.data.error);  // Show error
      } else {
        setOutputText(res.data.output || "No output received");
      }
    } catch (err) {
      console.error("Run error:", err);
      setOutputText("⚠️ Error connecting to the compiler.");
    }
  };
  
  

  const handleSave = () => {
    const savedFiles = JSON.parse(localStorage.getItem("codeFiles") || "[]");
    const currentCode = monacoRef.current.getValue();
  
    const fileExists = savedFiles.find((file) => file.name === filename);
    let updatedFiles;
  
    if (fileExists) {
      // Update existing file
      updatedFiles = savedFiles.map((file) =>
        file.name === filename ? { ...file, code: currentCode } : file
      );
    } else {
      // Add new file
      const newFile = { name: filename, code: currentCode };
      updatedFiles = [...savedFiles, newFile];
  
      // ✅ Open sidebar and show updated files
      setShowSidebar(true);
    }
  
    localStorage.setItem("codeFiles", JSON.stringify(updatedFiles));
    setFiles(updatedFiles);
  };
  
  

  const handleImport = (e) => {
    const reader = new FileReader();
    reader.onload = (e) => monacoRef.current.setValue(e.target.result);
    reader.readAsText(e.target.files[0]);
  };

  const handleExport = () => {
    const blob = new Blob([monacoRef.current.getValue()], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = filename;
    a.href = url;
    a.click();
  };

  const loadFile = (file) => {
    setFilename(file.name);
    monacoRef.current.setValue(file.code);
    setShowSidebar(false);

    const isAlreadyOpen = openFiles.some(f => f.name === file.name);
    if (!isAlreadyOpen) {
      setOpenFiles([...openFiles, file]);
    }
  };

  const handleRenameFile = (oldName, newName) => {
    if (files.some(f => f.name === newName)) {
      alert("File name already exists.");
      return;
    }

    const updatedFiles = files.map((f) =>
      f.name === oldName ? { ...f, name: newName } : f
    );
    const updatedOpenFiles = openFiles.map((f) =>
      f.name === oldName ? { ...f, name: newName } : f
    );

    localStorage.setItem("codeFiles", JSON.stringify(updatedFiles));
    setFiles(updatedFiles);
    setOpenFiles(updatedOpenFiles);
    if (filename === oldName) setFilename(newName);
  };

  const handleDeleteFile = (name) => {
    const updatedFiles = files.filter((f) => f.name !== name);
    const updatedOpenFiles = openFiles.filter((f) => f.name !== name);

    localStorage.setItem("codeFiles", JSON.stringify(updatedFiles));
    setFiles(updatedFiles);
    setOpenFiles(updatedOpenFiles);

    if (filename === name && updatedOpenFiles.length > 0) {
      setFilename(updatedOpenFiles[0].name);
      monacoRef.current.setValue(updatedOpenFiles[0].code);
    } else if (updatedOpenFiles.length === 0) {
      setFilename("untitled.cpp");
      monacoRef.current.setValue("// Write your code here");
    }
  };

  const toggleSidebar = () => {
    const latestFiles = JSON.parse(localStorage.getItem("codeFiles") || "[]");
    setFiles(latestFiles);
    setShowSidebar((prev) => !prev);
  };

  const closeTab = (filename) => {
    const updatedOpen = openFiles.filter((f) => f.name !== filename);
    setOpenFiles(updatedOpen);

    if (filename === filename && updatedOpen.length > 0) {
      setFilename(updatedOpen[0].name);
      monacoRef.current.setValue(updatedOpen[0].code);
    } else if (updatedOpen.length === 0) {
      setFilename("untitled.cpp");
      monacoRef.current.setValue("// Write your code here");
    }
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("codeFiles") || "[]");
    setFiles(saved);
  }, []);

  return (
    <div className="main-content">
      <div className="header">
        <img src="logo.png" alt="Logo" width="50" height="50" />
        <h3 className="name"><b>CodeGenius</b></h3>

        <button className="explorer-button" onClick={toggleSidebar}>📁 Explorer</button>

        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="filename-input"
        />

        <div className="btn-container">
          <select
            className="form-select"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              const ext = languageToExtension[e.target.value];
              setFilename(`untitled.${ext}`);
            }}
          >
            <option value="Cpp">C++</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
          </select>

          <button className="explorer-button" onClick={handleRun}>▶️ Run</button>
          <button className="explorer-button" onClick={handleSave}>💾 Save</button>
          <label className="explorer-button" htmlFor="fileInput">📥 Import</label>
          <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleImport} />
          <button className="explorer-button" onClick={handleExport}>📤 Export</button>
          
          <label className="switch">
            <input
              type="checkbox"
              className="checkbox"
              checked={isDark}
              onChange={() => setIsDark(!isDark)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="tabs-container">
        {openFiles.map((file, index) => (
          <div
            key={index}
            className={`tab-button ${file.name === filename ? "active-tab" : ""}`}
            onClick={() => {
              setFilename(file.name);
              monacoRef.current.setValue(file.code);
            }}
          >
            {file.name}
            <span className="close-tab" onClick={(e) => {
              e.stopPropagation();
              closeTab(file.name);
            }}>❌</span>
          </div>
        ))}
      </div>

      <div className="body-container">
        {showSidebar && (
          <Sidebar
            savedFiles={files}
            onOpenFile={loadFile}
            onRenameFile={handleRenameFile}
            onDeleteFile={handleDeleteFile}
          />
        )}

        <div className="editor-and-io horizontal-layout">
          <div className="editor" id="editor"></div>

          <div className="io-container">
            <div className="ai-assistant-container">
              <div className="ai-header-bar">
                <h6><b>AI Assistant</b></h6>
                <select className="model-select" value={model} onChange={handleModelChange}>
                  <option value="gpt-4o-mini">gpt-4o-mini</option>
                </select>
              </div>

              <div className="chat-box">
                {messages.map((msg, i) => (
                  <div key={i} className={`chat-bubble ${msg.sender === "user" ? "user-msg" : "ai-msg"}`}>
                    {msg.text && <div>{msg.text}</div>}
                    {msg.code && <pre><code>{msg.code}</code></pre>}
                  </div>
                ))}
              </div>

              <div className="message-input">
                <input
                  type="text"
                  placeholder={`Message ${model}`}
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button className="send-btn" onClick={sendMessage}>➤</button>
              </div>
            </div>

            <div className="input-output-container">
              <div className="io-tabs">
                <button
                  className={`io-tab ${activeTab === "input" ? "active" : ""}`}
                  onClick={() => setActiveTab("input")}
                >Input</button>
                <button
                  className={`io-tab ${activeTab === "output" ? "active" : ""}`}
                  onClick={() => setActiveTab("output")}
                >Output</button>
              </div>

              {activeTab === "input" ? (
                <textarea
                  className="io-textarea"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter input..."
                />
              ) : (
                <textarea
                  className="io-textarea"
                  value={outputText}
                  readOnly
                  placeholder="Output will be shown here..."
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
