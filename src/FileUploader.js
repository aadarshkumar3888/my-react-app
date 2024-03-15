import React, { useState } from 'react';
import axios from 'axios';

function ExcelUploader() {
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [resultData, setResultData] = useState({});
    const [editedData, setEditedData] = useState({});
    const [selectedValue1, setSelectedValue1] = useState('');
    const [selectedValue2, setSelectedValue2] = useState('');
    const [showSubmitButton, setShowSubmitButton] = useState(false); // State to control visibility of the submit button
    const [showDropdowns, setShowDropdowns] = useState(false); // State to control visibility of the dropdowns

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

                // Show the submit button and dropdowns after data is received
                setShowSubmitButton(true);
                setShowDropdowns(true);
            })
            .catch(error => {
                console.error('Error:', error);
                setResultData({ error: 'An error occurred while uploading files.' });
            });
    };

    const handleEditSubmit = () => {
        // Merge resultData and editedData
        const mergedData = { ...resultData, ...editedData };

        // Append selected values
        mergedData['selectedValue1'] = selectedValue1;
        mergedData['selectedValue2'] = selectedValue2;

        // Send merged data to the backend
        axios.post('http://localhost:8080/recon/test4', mergedData)
            .then(response => {
                // Handle response from the backend if needed
                console.log('Edited data submitted successfully:', response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };



    return (
        <div>
            <h2>Upload Excel Files</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
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
            <div id="result">
                {/* Display result data */}
                {Object.keys(resultData).map((key, index) => (
                    <div key={index}>
                        <label>Key:</label>
                        <input
                            type="text"
                            value={editedData[key]?.key || key} // If key is edited, show edited key, otherwise show original key
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
                            value={editedData[key]?.value || resultData[key]} // If value is edited, show edited value, otherwise show original value
                            onChange={(event) => {
                                const newValue = event.target.value;
                                setEditedData(prevState => ({
                                    ...prevState,
                                    [key]: { key: editedData[key]?.key || key, value: newValue } // Use edited key if available
                                }));
                            }}
                        />
                        <br />
                    </div>
                ))}
                {/* Dropdowns for selected values */}
                {showDropdowns && (
                    <>
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
                    </>
                )}
            </div>
            {showSubmitButton && (
                <div id="submitEditedData">
                    <button id="submitEditedButton" type="button" onClick={handleEditSubmit}>
                        Submit Edited Data
                    </button>
                </div>
            )}
        </div>
    );
}

export default ExcelUploader;
