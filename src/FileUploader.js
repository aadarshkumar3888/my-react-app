import React, { useState } from 'react';
import axios from 'axios';
import './FileUploader.css';
import backgroundImage from './123.jpg'; // Import the background image

function ExcelUploader() {
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [resultData, setResultData] = useState({});
    const [editedData, setEditedData] = useState({});
    const [selectedValue1, setSelectedValue1] = useState('');
    const [selectedValue2, setSelectedValue2] = useState('');
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [showDropdowns, setShowDropdowns] = useState(false);

    const handleFile1Change = (event) => {
        setFile1(event.target.files[0]);
    };

    const handleFile2Change = (event) => {
        setFile2(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('file1', file1);
        formData.append('file2', file2);

        axios.post('http://localhost:8080/recon/test3', formData)
            .then(response => {
                setResultData(response.data);
                setShowSubmitButton(true);
                setShowDropdowns(true);
            })
            .catch(error => {
                console.error('Error:', error);
                setResultData({ error: 'An error occurred while uploading files.' });
            });
    };

    const handleEditSubmit = () => {
        const mergedData = { ...resultData, ...editedData };

        mergedData['selectedValue1'] = selectedValue1;
        mergedData['selectedValue2'] = selectedValue2;

        axios.post('http://localhost:8080/recon/test4', mergedData)
            .then(response => {
                console.log('Edited data submitted successfully:', response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="excel-uploader-container" style={{ backgroundImage: `url(${backgroundImage})` }}> {/* Set background image */}
            <h2>Upload Excel Files</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="excel-uploader-form">
                <div className="form-group">
                    <label htmlFor="file1">Select Excel File 1:</label>
                    <input type="file" id="file1" name="file1" accept=".xlsx, .xls" onChange={handleFile1Change} />
                </div>
                <div className="form-group">
                    <label htmlFor="file2">Select Excel File 2:</label>
                    <input type="file" id="file2" name="file2" accept=".xlsx, .xls" onChange={handleFile2Change} />
                </div>
                <button type="submit" className="upload-button">Upload</button>
            </form>
            <div className="result-container">
                {/* Display result data */}
                {Object.keys(resultData).map((key, index) => (
                    <div key={index} className="result-item">
                        <label>Key:</label>
                        <input
                            type="text"
                            value={editedData[key]?.key || key}
                            onChange={(event) => {
                                const newKey = event.target.value;
                                setEditedData(prevState => ({
                                    ...prevState,
                                    [key]: { key: newKey, value: resultData[key] }
                                }));
                            }}
                        />
                        <label>Value:</label>
                        <input
                            type="text"
                            value={editedData[key]?.value || resultData[key]}
                            onChange={(event) => {
                                const newValue = event.target.value;
                                setEditedData(prevState => ({
                                    ...prevState,
                                    [key]: { key: editedData[key]?.key || key, value: newValue }
                                }));
                            }}
                        />
                    </div>
                ))}
                {/* Dropdowns for selected values */}
                {showDropdowns && (
                    <div className="dropdown-container">
                        <select value={selectedValue1} onChange={(event) => setSelectedValue1(event.target.value)}>
                            {Object.keys(resultData).map((key, index) => (
                                <option key={index} value={resultData[key]}>
                                    {key}
                                </option>
                            ))}
                        </select>
                        <select value={selectedValue2} onChange={(event) => setSelectedValue2(event.target.value)}>
                            {Object.keys(resultData).map((key, index) => (
                                <option key={index} value={resultData[key]}>
                                    {key}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            {showSubmitButton && (
                <div className="submit-button-container">
                    <button className="submit-button" type="button" onClick={handleEditSubmit}>
                        Submit Edited Data
                    </button>
                </div>
            )}
        </div>
    );
}

export default ExcelUploader;
