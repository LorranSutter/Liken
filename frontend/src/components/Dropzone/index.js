import React, { useCallback, useState } from 'react';
import { Text, Loader } from 'rimble-ui';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile } from 'react-icons/fi';

import './styles.css';

const Dropzone = ({ onFileUploaded }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState();
    const [selectedFileIcon, setSelectedFileIcon] = useState();

    const onDrop = useCallback(acceptedFiles => {
        setIsLoading(isLoading => !isLoading);
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.readAsArrayBuffer(file)
        reader.onload = () => {
            const fileBuffer = Buffer(reader.result);

            onFileUploaded(fileBuffer);
            setSelectedFileName(file.name);
            setSelectedFileIcon(<FiFile />);
            setIsLoading(isLoading => !isLoading);
        }
    }, [onFileUploaded]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop
    })

    return (
        <div className='dropzone' {...getRootProps()}>
            <input {...getInputProps()} />
            {!selectedFileName ?
                <div className='wrapDiv'>
                    <FiUpload />
                    <Text p={1}>Drag 'n' drop a file here, or click to select a file</Text>
                </div>
                :
                <div className='wrapDiv'>
                    {isLoading ? <Loader size='small' color="white" /> : selectedFileIcon}
                    <strong>File {selectedFileName} added</strong>
                    <Text p={1}>Drag 'n' drop here or click to select another file</Text>
                </div>
            }
        </div>
    )
}

export default Dropzone;