import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Flex, Box, Card, Heading, Text, Form, Field, Button, Loader } from 'rimble-ui';

import qs from 'qs';

import api from '../../service/api';

// import styles from './styles.module.css';

const NewModel = (props) => {

    const [title, setTitle] = useState();

    const history = useHistory();
    const [cookies, setCookie] = useCookies();

    const [validated, setValidated] = useState(false);
    const [orgList, setOrgList] = useState([]);

    const [orgData, setOrgData] = useState({});

    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [newModelMsg, setNewModelMsg] = useState('');

    function handleSelectOrg(e) {
        setOrgData({ ...orgData, org: e.target.value });
    };

    function handleTerms(e) {
        setOrgData({ ...orgData, terms: e.target.value });
    };

    function handleConditions(e) {
        setOrgData({ ...orgData, conditions: e.target.value });
    };

    function handleExpirationDate(e) {
        setOrgData({ ...orgData, expirationDate: e.target.value });
    };

    const validateForm = useCallback(
        () => {
            if (
                orgData.org && orgData.org.length > 0 &&
                orgData.terms && orgData.terms.length > 10 &&
                orgData.conditions && orgData.conditions.length > 10 &&
                orgData.expirationDate && orgData.expirationDate.length > 0 &&
                !isLoading
            ) {
                setValidated(true);
                setSubmitDisabled(false);
            } else {
                setValidated(false);
                setSubmitDisabled(true);
            }
        },
        [orgData, isLoading]
    );

    useEffect(() => {
        if (props.location.state) {
            setTitle(props.location.state.title ?? 'New Model');
        }
    }, []);

    useEffect(() => {
        try {
            api
                .get('/org/index')
                .then(res => {
                    if (res.status === 200) {
                        const orgs = res.data.orgs.filter(org => org !== cookies.ledgerId);
                        setOrgList(orgs);
                        setOrgData({
                            ...orgData,
                            modelKey: props.location.state.modelKey,
                            org: orgs.length > 0 && orgs[0]
                        });
                    } else {
                        console.log('Oopps... something wrong, status code ' + res.status);
                        return function cleanup() { }
                    }
                })
                .catch((err) => {
                    console.log('Oopps... something wrong');
                    console.log(err);
                    return function cleanup() { }
                });
        } catch (error) {
            console.log('Oopps... something wrong');
            console.log(error);
            return function cleanup() { }
        }
    }, []);

    useEffect(() => {
        validateForm();
    }, [validateForm]);

    useEffect(() => {
        console.log(orgData);
        if (validated && isLoading) {
            try {
                api
                    .post('/org/approve', qs.stringify(orgData))
                    .then(res => {
                        console.log(res);
                        if (res.status === 200) {
                            setNewModelMsg(res.data.message);
                        } else {
                            console.log('Oopps... something wrong, status code ' + res.status);
                            return function cleanup() { }
                        }
                    })
                    .catch((err) => {
                        console.log('Oopps... something wrong');
                        console.log(err);
                        return function cleanup() { }
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            } catch (error) {
                console.log('Oopps... something wrong');
                console.log(error);
                setIsLoading(false);
                return function cleanup() { }
            }
        }
    }, [orgData, validated, isLoading, history]);

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
                        <Heading as={'h2'} color={'primary'}>{title}</Heading>
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
                                    <select
                                        required
                                        // onChange={e => setSelectedOrg(e.target.value)}
                                        onChange={handleSelectOrg}
                                        style={
                                            {
                                                boxSizing: "border-box",
                                                width: "100%",
                                                lineHeight: "1.5",
                                                height: "auto",
                                                color: "#3F3D4B",
                                                backgroundColor: "#fff",
                                                fontSize: "1rem",
                                                padding: "16px 48px 16px 16px",
                                                border: "1px solid transparent",
                                                borderColor: "#ccc",
                                                borderRadius: "4px",
                                                boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                                                font: "400 16px Arial",
                                                outline: "none"
                                            }
                                        }
                                    >
                                        {orgList.map(org => <option key={org} value={org}>{org}</option>)}
                                    </select>
                                </Field>
                            </Box>
                            <Box width={1} px={3}>
                                <Field label="Terms" width={1}>
                                    <textarea
                                        required
                                        // onChange={(e) => setTerms(e.target.value)}
                                        onChange={handleTerms}
                                        value={orgData.terms}
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
                                        // onChange={(e) => setConditions(e.target.value)}
                                        onChange={handleConditions}
                                        value={orgData.conditions}
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
                                        // onChange={(e) => setExpirationDate(e.target.value)}
                                        onChange={handleExpirationDate}
                                        value={orgData.expirationDate}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                        </Flex>
                        <Flex mx={-3} alignItems={'center'}>
                            <Box px={3}>
                                <Button icon={!isLoading && 'Share'} type="submit" mt={2} disabled={submitDisabled}>
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