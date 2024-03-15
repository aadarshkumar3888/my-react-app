import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import './FileUploader.css'; // Import the CSS file if styles are kept in a separate file

function FileUploader() {
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [result, setResult] = useState(null);

    const handleFile1Change = (event) => {
        setFile1(event.target.files[0]);
    };

    const handleFile2Change = (event) => {
        setFile2(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('file1', file1);
        formData.append('file2', file2);

        try {
            const response = await axios.post('/upload', formData); // Use Axios for POST request

            if (!response.status === 200) {
                throw new Error('Upload failed');
            }
            console.log('Response:', response.data);
            const data = response.data;
            setResult(data);
        } catch (error) {
            console.error('Error:', error);
            setResult('An error occurred while uploading files.');
        }
    };

    const handleEditSubmit = () => {
        const editedData = {}; // Object to store edited data

        // Get edited data from input fields
        const inputs = document.querySelectorAll('#result input[type="text"]');
        for (let i = 0; i < inputs.length; i += 2) {
            editedData[inputs[i].value] = inputs[i + 1].value;
        }

        // Get selected values from dropdowns
        const select1 = document.querySelector('#result select:nth-of-type(1)');
        const select2 = document.querySelector('#result select:nth-of-type(2)');
        editedData['selectedValue1'] = select1.value;
        editedData['selectedValue2'] = select2.value;

        // Send edited data to the backend using Axios
        axios.post('/submitEditedData', editedData)
        .then(response => {
            // Log response from the backend
            console.log('Edited data submitted successfully:', response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <div className="file-uploader">
            <h2>Upload Excel Files</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="form">
                <div>
                    <label htmlFor="file1">Select Excel File 1:</label>
                    <input type="file" id="file1" name="file1" accept=".xlsx, .xls" onChange={handleFile1Change} />
                </div>
                <div>
                    <label htmlFor="file2">Select Excel File 2:</label>
                    <input type="file" id="file2" name="file2" accept=".xlsx, .xls" onChange={handleFile2Change} />
                </div>
                <button type="submit">Upload</button>
            </form>
            <div id="result" className="result"></div>

            <div id="submitEditedData" className="submit-edited-data">
                <button id="submitEditedButton" type="button" onClick={handleEditSubmit}>Submit Edited Data</button>
            </div>
        </div>
    );
}

export default FileUploader;
