import React, { useCallback, useState } from 'react';
import { Text, Loader } from 'rimble-ui';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFileText, FiFile } from 'react-icons/fi';

// import detect from 'detect-file-type';

// import ipfs from '../../ipfs';
import './styles.css';

// function detectMime(mime) {
//     if (mime.includes('image')) {
//         return <FiImage />;
//     }
//     if (mime.includes('text')) {
//         return <FiFileText />;
//     }
//     if (mime.includes('audio')) {
//         return <FiHeadphones />;
//     }
//     if (mime.includes('video')) {
//         return <FiVideo />;
//     }
//     return <FiFile />;
// }

const Dropzone = ({ onFileUploaded }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [selectedFileIcon, setSelectedFileIcon] = useState();

    const onDrop = useCallback(acceptedFiles => {
        setIsLoading(isLoading => !isLoading);
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.readAsArrayBuffer(file)
        reader.onload = () => {
            const fileBuffer = Buffer(reader.result);

            // detect.fromBuffer(fileBuffer,
            //     async (err, res) => {
            //         if (err) {
            //             console.log(err);
            //         }

            //         // for await (const fileIPFS of ipfs.add(fileBuffer)) {
            //         //     onFileUploaded(fileIPFS.path);
            //         // }

            //         setSelectedFileName(file.name);
            //         setSelectedFileIcon(detectMime(res.mime));
            //         setIsdeteLoading(isLoading => !isLoading);
            //     });
        }
    }, [onFileUploaded]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop
    })

    return (
        <div className='dropzone' {...getRootProps()}>
            <input {...getInputProps()} />
            {!selectedFileIcon ?
                <div className='wrapDiv'>
                    <FiUpload />
                    <Text p={1}>Drag 'n' drop a file here, or click to select a file</Text>
                </div>
                :
                <div className='wrapDiv'>
                    {isLoading ? <Loader color="white" /> : selectedFileIcon}
                    <strong>File {selectedFileName} added</strong>
                    <Text p={1}>Drag 'n' drop here or click to select another file</Text>
                </div>
            }
        </div>
    )
}

export default Dropzone;