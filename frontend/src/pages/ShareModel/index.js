import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Flex, Box, Card, Heading, Text, Form, Field, Button, Loader } from 'rimble-ui';

import qs from 'qs';

import api from '../../service/api';

// import styles from './styles.module.css';

const NewModel = () => {

    const history = useHistory();

    const [validated, setValidated] = useState(false);
    const [organization, setOrganization] = useState('');
    const [terms, setTerms] = useState('');
    const [conditions, setConditions] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [newModelMsg, setNewModelMsg] = useState('');


    const validateForm = useCallback(
        () => {
            if (
                organization && organization.length > 0 &&
                terms && terms.length > 10 &&
                conditions && conditions.length > 10 &&
                expirationDate && expirationDate.length > 0 &&
                !isLoading
            ) {
                setValidated(true);
                setSubmitDisabled(false);
            } else {
                setValidated(false);
                setSubmitDisabled(true);
            }
        },
        [organization, terms, conditions, expirationDate, isLoading]
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
                        <Heading as={'h2'} color={'primary'}>Model Name</Heading>
                    </Box>
                    <Box my={'auto'}>
                        <Button.Outline icon='ArrowBack' onClick={handleClickOnBack}>Back</Button.Outline>
                    </Box>
                </Flex>
                <Form onSubmit={handleSubmit}>
                    <Card mb={20}>
                        <Flex mx={-3} flexWrap={"wrap"}>
                            <Box width={1} px={3}>
                                <Field label="Organization" width={1}>
                                    <Form.Input
                                        type="text"
                                        required
                                        onChange={(e) => setOrganization(e.target.value)}
                                        value={organization}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                            <Box width={1} px={3}>
                                <Field label="Terms" width={1}>
                                    <textarea
                                        required
                                        onChange={(e) => setTerms(e.target.value)}
                                        value={terms}
                                        name="Terms"
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
                            <Box width={1} px={3}>
                                <Field label="Conditions" width={1}>
                                    <textarea
                                        required
                                        onChange={(e) => setConditions(e.target.value)}
                                        value={conditions}
                                        name="Conditions"
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
                            <Box width={1} px={3}>
                                <Field label="Expiration Date" width={1}>
                                    <Form.Input
                                        type="date"
                                        required
                                        onChange={(e) => setExpirationDate(e.target.value)}
                                        value={expirationDate}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                        </Flex>
                        <Flex mx={-3} alignItems={'center'}>
                            <Box px={3}>
                                <Button icon='Share' type="submit" mt={2} disabled={submitDisabled}>
                                    {isLoading ? <Loader color="white" /> : <p>Share model</p>}
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