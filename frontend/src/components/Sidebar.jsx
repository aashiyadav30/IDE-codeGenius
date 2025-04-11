import React from "react";

const Sidebar = ({ savedFiles, onOpenFile, onRenameFile, onDeleteFile }) => {
  return (
    <div className="sidebar">
      <h3><b>Explorer</b></h3>
      <ul className="files-list">
        {savedFiles.map((file, index) => (
          <li key={index}>
            <div className="file-item">
              <span
                onClick={() => onOpenFile(file)}
                style={{ cursor: "pointer" }}
              >
                📄 {file.name}
              </span>

              <button
                className="file-btn"
                onClick={() => {
                  const newName = prompt("Enter new filename:", file.name);
                  if (newName) {
                    onRenameFile(file.name, newName);
                  }
                }}
              >
                ✏️
              </button>

              <button
                className="file-btn"
                onClick={() => onDeleteFile(file.name)}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;