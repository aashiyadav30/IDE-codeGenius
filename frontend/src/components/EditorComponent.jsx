import React, { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { languageToExtension } from "../utils/languageExtensionMap";
import AIAssistant from './AIAssistant';



const EditorComponent = ({
  language,
  code,
  setCode,
  selectedFile,
  setSelectedFile,
}) => {
  const containerRef = useRef(null);
  const editorRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);

  // Load files from localStorage on mount
  useEffect(() => {
    const savedFiles = JSON.parse(localStorage.getItem("codeFiles")) || [];
    setFiles(savedFiles);

    if (savedFiles.length > 0 && !selectedFile) {
      setSelectedFile(savedFiles[0]);
      setCode(savedFiles[0].code);
    }
  }, []);

  // Initialize Monaco editor
  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: code || "",
        language: language || "cpp",
        theme: "vs-dark",
        automaticLayout: true,
        fontSize: 14,
        minimap: { enabled: false },
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  // Update editor when selectedFile changes
  useEffect(() => {
    if (editorRef.current && selectedFile) {
      const modelUri = monaco.Uri.file(selectedFile.name);
      let model = monaco.editor.getModel(modelUri);

      if (!model) {
        model = monaco.editor.createModel(
          selectedFile.code,
          language,
          modelUri
        );
      }

      editorRef.current.setModel(model);
    }
  }, [selectedFile, language]);

  // Handle code changes
  useEffect(() => {
    if (!editorRef.current) return;

    const model = editorRef.current.getModel();
    const handleChange = model.onDidChangeContent(() => {
      const updatedCode = model.getValue();
      setCode(updatedCode);

      setFiles((prevFiles) => {
        const updatedFiles = prevFiles.map((file) =>
          file.name === selectedFile.name ? { ...file, code: updatedCode } : file
        );
        localStorage.setItem("codeFiles", JSON.stringify(updatedFiles));
        return updatedFiles;
      });
    });

    return () => {
      handleChange.dispose();
    };
  }, [selectedFile]);

  const selectFile = (file) => {
    setSelectedFile(file);
    setCode(file.code);
  };

  return (
    <div className="editor-container">
      {/* === Sidebar === */}
      <div className={`sidebar ${!showSidebar ? "hidden" : ""}`}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <h3><b>Saved Files</b></h3>
          <button
            onClick={() => setShowSidebar(false)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            ❌
          </button>
        </div>

        <button
          className="explorer-button"
          onClick={() => {
            const name = `untitled-${Date.now()}.${languageToExtension[language]}`;
            const newFile = { name, code: "" };
            const updatedFiles = [...files, newFile];
            setFiles(updatedFiles);
            localStorage.setItem("codeFiles", JSON.stringify(updatedFiles));
            selectFile(newFile);
          }}
        >
          ➕ New File
        </button>

        <ul className="files-list" style={{ marginTop: "10px" }}>
          {files.map((file, index) => (
            <li
              key={index}
              onClick={() => selectFile(file)}
              style={{
                padding: "6px 8px",
                cursor: "pointer",
                borderBottom: "1px solid #333",
                backgroundColor:
                  selectedFile?.name === file.name ? "#2d2d2d" : "transparent",
                color: selectedFile?.name === file.name ? "#3b8eea" : "white",
              }}
            >
              {file.name}
            </li>
          ))}
        </ul>
      </div>

      {/* === Editor === */}
      <div
        className={`editor ${!showSidebar ? "full-width" : ""}`}
        ref={containerRef}
      ></div>

      {/* === Show Sidebar Toggle === */}
      {!showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          style={{
            position: "absolute",
            top: "80px",
            left: "10px",
            zIndex: 10,
            backgroundColor: "#3a3a3a",
            color: "white",
            border: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          📂 Show Files
        </button>
      )}
      import AIAssistant from './AIAssistant';

<div className="right-panel">
  <AIAssistant />
</div>

    </div>
  );
};

export default EditorComponent;
