import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UploadFile() {
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://localhost:3000/files', formData).then((response) => {
      console.log(response.data);
    });
  };

  return (
    <form onSubmit={handleFileSubmit}>
      <input type="file" onChange={handleFileUpload} />
      <button type="submit">Upload</button>
    </form>
  );
}

function DownloadFile({ fileId }) {
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/files/${fileId}`).then((response) => {
      setFile(response.data);
    });
  }, [fileId]);

  return (
    <div>
      {file ? (
        <a href={`http://localhost:3000/files/${file.fileName}`} download>
          Download
        </a>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

function App() {
  return (
    <div>
      <UploadFile />
      <DownloadFile fileId={1} />
    </div>
  );
}

export default App;
