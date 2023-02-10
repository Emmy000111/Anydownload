// Import necessary libraries
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('files.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the files database.');
});

// Create the table to store file information
db.run(`
    CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_name TEXT,
        file_path TEXT,
        download_link TEXT
    )
`, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Files table created.');
});

// Function to upload a file
function uploadFile(filePath) {
    // Get the file name from the file path
    let fileName = filePath.split('/').pop();

    // Generate the download link for the file
    let downloadLink = `http://localhost/files/${fileName}`;

    // Insert the file information into the database
    db.run(`
        INSERT INTO files (file_name, file_path, download_link)
        VALUES (?, ?, ?)
    `, [fileName, filePath, downloadLink], (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log(`File ${fileName} uploaded.`);
    });
}

// Function to download a file
function downloadFile(fileId, callback) {
    // Get the file information from the database
    db.get(`
        SELECT file_path
        FROM files
        WHERE id = ?
    `, [fileId], (err, row) => {
        if (err) {
            console.error(err.message);
        }

        // Return the file path for downloading
        callback(row.file_path);
    });
}

// Example usage
uploadFile('/path/to/file.txt');

downloadFile(1, (filePath) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err.message);
        }
        console.log(data);
    });
});

// Close the database connection when done
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Closed the database connection.');
});
