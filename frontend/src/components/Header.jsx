import React, { useState, useRef } from "react";

const Header = ({ onToggleSidebar, onToggleIOPanel, onSaveFile, onImportFile, onExportFile }) => {
  const [filename, setFilename] = useState("");
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImportFile(file.name, event.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="header">
      <div className="name"><h2>My Intelligent IDE</h2></div>

      <div className="btn-container">
        <input
          id="filename1"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="Enter filename"
        />

        <button className="explorer-button" onClick={() => onSaveFile(filename)}>
          Save File
        </button>

        <button className="explorer-button" onClick={onToggleSidebar}>
          Toggle Sidebar
        </button>

        <button className="explorer-button" onClick={onToggleIOPanel}>
          Toggle IO Panel
        </button>

        {/* IMPORT BUTTON */}
        <button className="explorer-button" onClick={handleImportClick}>
          Import File
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* EXPORT BUTTON */}
        <button className="explorer-button" onClick={() => onExportFile(filename)}>
          Export File
        </button>
      </div>
    </header>
  );
};

export default Header;
