import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Flex, Box, Card, Heading, Text, Form, Field, Button, Loader } from 'rimble-ui';

import qs from 'qs';

import api from '../../service/api';
import Dropzone from '../../components/Dropzone';

// import styles from './styles.module.css';

const NewModel = () => {

    const history = useHistory();

    const [validated, setValidated] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [newModelMsg, setNewModelMsg] = useState('');


    const validateForm = useCallback(
        () => {
            if (
                name && name.length > 5 &&
                description && description.length > 10 &&
                selectedFile &&
                !isLoading
            ) {
                setValidated(true);
                setSubmitDisabled(false);
            } else {
                setValidated(false);
                setSubmitDisabled(true);
            }
        },
        [name, description, selectedFile, isLoading]
    );

    useEffect(() => {
        validateForm();
    }, [validateForm]);

    // useEffect(() => {
    //     if (validated && isLoading) {
    //         try {
    //             api
    //                 .post('/fi/createClient', qs.stringify(clientData))
    //                 .then(res => {
    //                     console.log(res);
    //                     if (res.status === 200) {
    //                         setNewModelMsg(res.data.message);
    //                     } else {
    //                         console.log('Oopps... something wrong, status code ' + res.status);
    //                         return function cleanup() { }
    //                     }
    //                 })
    //                 .catch((err) => {
    //                     console.log('Oopps... something wrong');
    //                     console.log(err);
    //                     return function cleanup() { }
    //                 })
    //                 .finally(() => {
    //                     setIsLoading(false);
    //                 });
    //         } catch (error) {
    //             console.log('Oopps... something wrong');
    //             console.log(error);
    //             setIsLoading(false);
    //             return function cleanup() { }
    //         }
    //     }
    // }, [name, description, validated, isLoading, history]);

    const handleSubmit = e => {
        e.preventDefault();
        setIsLoading(true);
        setNewModelMsg('');
    };

    const handleClickOnBack = e => {
        e.preventDefault();
        history.push('/org');
    }

    return (
        <Flex height={'100vh'}>
            <Box mx={'auto'} my={'auto'} width={[1, 9 / 12, 7 / 12]}>
                <Flex px={2} mx={'auto'} justifyContent='space-between'>
                    <Box my={'auto'}>
                        <Heading as={'h2'} color={'primary'}>New Model</Heading>
                    </Box>
                    <Box my={'auto'}>
                        <Button.Outline icon='ArrowBack' onClick={handleClickOnBack}>Back</Button.Outline>
                    </Box>
                </Flex>
                <Form onSubmit={handleSubmit}>
                    <Card mb={20}>
                        <Flex mx={-3} flexWrap={"wrap"}>
                            <Box width={1} px={3}>
                                <Field label="Name" width={1}>
                                    <Form.Input
                                        type="text"
                                        required
                                        onChange={(e) => setName(e.target.value)}
                                        value={name}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                            <Box width={1} px={3}>
                                <Field label="Description" width={1}>
                                    <textarea
                                        required
                                        onChange={(e) => setDescription(e.target.value)}
                                        value={description}
                                        name="Description"
                                        rows="7"
                                        style={
                                            {
                                                resize: "vertical",
                                                boxSizing: "border-box",
                                                width: "100%",
                                                lineHeight: "1.5",
                                                height: "auto",
                                                color: "#3F3D4B",
                                                backgroundColor: "#fff",
                                                fontSize: "1rem",
                                                padding: "16px",
                                                border: "1px solid transparent",
                                                borderColor: "#ccc",
                                                borderRadius: "4px",
                                                boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                                                font: "400 16px Arial",
                                                outline: "none",
                                                minHeight: "64px"
                                            }
                                        }
                                    />
                                </Field>
                            </Box>
                        </Flex>
                    </Card>
                    <Card>
                        <Box pb={3}>
                            <Dropzone onFileUploaded={setSelectedFile} />
                        </Box>
                        <Flex mx={-3} alignItems={'center'}>
                            <Box px={3}>
                                <Button icon='Add' type="submit" mt={2} disabled={submitDisabled}>
                                    {isLoading ? <Loader color="white" /> : <p>Register new model</p>}
                                </Button>
                            </Box>
                            {newModelMsg &&
                                <Box px={3}>
                                    <Text>{newModelMsg}</Text>
                                </Box>
                            }
                        </Flex>
                    </Card>
                </Form>
            </Box>
        </Flex>
    );
}

export default NewModel;