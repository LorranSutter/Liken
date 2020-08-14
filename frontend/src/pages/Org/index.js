import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Flex, Box, Card, Heading, Text, Form, Field, Button, Loader, Image } from 'rimble-ui';

import qs from 'qs';
import axios from 'axios';

import logoHorizontal from '../../assets/Logo_horizontal.svg';
import api from '../../service/api';
import ModelData from '../../components/ModelData';
import { setModelListData } from '../../functions/setModelListData';

// const ModelData = lazy(() => import('../../components/ModelData'));

const Org = () => {

    const history = useHistory();
    const [cookies, setCookie, removeCookie] = useCookies();

    // const [modelData, setModelData] = useState(
    const [myModels, setMyModels] = useState();
    // const [myModels, setMyModels] = useState([
    // [
    //     { label: "Owner", value: "apple" },
    //     { label: 'Name', value: 'Deep Learning for Multiclass Text Classification' },
    //     { label: 'Description', value: 'Cleaning of special characters and removing punctuation; cleaning numbers; removing of contractions; tokenization; label encoding; text CNN; LSTM/GRU; confusion matrix.' },
    //     { label: 'Publication date', value: '2020-08-06 18:25:43' },
    //     { label: 'Who published last', value: 'apple' }
    // ],
    // [
    //     { label: "Owner", value: "apple" },
    //     { label: 'Name', value: 'Machine Learning Image Classification With TensorFlow' },
    //     { label: 'Description', value: 'Image classification; perceptron; MLP; clothes, dresses, shoes, sandals and bags classification; 2D visualization.' },
    //     { label: 'Publication date', value: '2020-08-04 08:14:32' },
    //     { label: 'Who published last', value: 'apple' }
    // ]
    // ]);

    const [approvedModels, setApprovedModels] = useState();
    // const [availableModels, setAvailableModels] = useState([
    //     [
    //         { label: "Owner", value: "microsoft" },
    //         { label: 'Name', value: 'Machine Learning model for Stock Trend Prediction' },
    //         { label: 'Description', value: 'Extremely randomized forest classification; K-Means clusterization; Support Vector Machines multi-class; K-fold cross validation.' },
    //         { label: 'Publication date', value: '2020-08-01 13:56:33' },
    //         { label: 'Who published last', value: 'microsoft' }
    //     ],
    //     [
    //         { label: "Owner", value: "microsoft" },
    //         { label: 'Name', value: 'Sentiment analysis for text with Deep Learning' },
    //         { label: 'Description', value: 'Web scrapping for data acquisition; Embeddings generation; LSTM; NLTK; cross-entropy loss' },
    //         { label: 'Publication date', value: '2020-08-03 21:10:05' },
    //         { label: 'Who published last', value: 'microsoft' }
    //     ]
    // ]);
    const [approvedFiList, setApprovedFiList] = useState([]);
    const [fiIdApprove, setFiIdApprove] = useState('');
    const [approvedMsg, setApprovedMsg] = useState('');
    const [isLoadingApprove, setIsLoadingApprove] = useState(false);
    const [fiIdRemove, setFiIdRemove] = useState('');
    const [removedMsg, setRemovedMsg] = useState('');
    const [isLoadingRemove, setIsLoadingRemove] = useState(false);

    function handleChooseFiApprove(e) {
        setFiIdApprove(e.target.value.toUpperCase());
    };

    function handleChooseFiRemove(e) {
        setFiIdRemove(e.target.value.toUpperCase());
    };

    useEffect(() => {
        try {
            axios.all([
                api.get('/org/queryAllModelsByOwner'),
                api.get('/org/queryAllModelsByApprovedUser')
            ])
                .then(axios.spread(
                    (modelListOwner, modelListApproved) => {
                        // if (modelList.status === 200 && approvedFis.status === 200) {
                        if (modelListOwner.status === 200 && modelListApproved.status === 200) {
                            modelListOwner = modelListOwner.data.modelList;
                            modelListApproved = modelListApproved.data.modelList;
                            // approvedFis = approvedFis.data.approvedFis;
                            console.log(modelListOwner);
                            console.log(modelListApproved);
                            setModelListData(modelListOwner, setMyModels);
                            setModelListData(modelListApproved, setApprovedModels);
                            // setApprovedFiList(approvedFis);
                        } else {
                            console.log('Oopps... something wrong, status code ' + modelListOwner.status);
                            return function cleanup() { }
                        }
                    }))
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

    // useEffect(() => {
    //     if (isLoadingApprove) {
    //         try {
    //             api
    //                 .post('/client/approve', qs.stringify({ fiId: fiIdApprove }))
    //                 .then(res => {
    //                     if (res.status === 200) {
    //                         setApprovedMsg(res.data.message);
    //                         const timer = setTimeout(() => {
    //                             setApprovedMsg('');
    //                         }, 5000);
    //                         setApprovedFiList((approvedFiList) => Array.from(new Set([...approvedFiList, fiIdApprove])));
    //                         return () => clearTimeout(timer);
    //                     } else {
    //                         console.log('Oopps... something wrong, status code ' + res.status);
    //                         return function cleanup() { }
    //                     }
    //                 })
    //                 .catch((err) => {
    //                     console.log('Oopps... something wrong1');
    //                     console.log(err);
    //                     return function cleanup() { }
    //                 })
    //                 .finally(() => {
    //                     setIsLoadingApprove(false);
    //                     setFiIdApprove('');
    //                 });
    //         } catch (error) {
    //             console.log('Oopps... something wrong2');
    //             console.log(error);
    //             setIsLoadingApprove(false);
    //             return function cleanup() { }
    //         }
    //     }
    // }, [isLoadingApprove, fiIdRemove]);

    // useEffect(() => {
    //     if (isLoadingRemove) {
    //         try {
    //             api
    //                 .post('/client/remove', qs.stringify({ fiId: fiIdRemove }))
    //                 .then(res => {
    //                     if (res.status === 200) {
    //                         setRemovedMsg(res.data.message);
    //                         const timer = setTimeout(() => {
    //                             setRemovedMsg('');
    //                         }, 5000);
    //                         setApprovedFiList((approvedFiList) => approvedFiList.filter(item => item !== fiIdRemove));
    //                         return () => clearTimeout(timer);
    //                     } else if (res.status === 202) {
    //                         setRemovedMsg(res.data.message);
    //                         const timer = setTimeout(() => {
    //                             setRemovedMsg('');
    //                         }, 5000);
    //                         return () => clearTimeout(timer);
    //                     } else {
    //                         console.log('Oopps... something wrong, status code ' + res.status);
    //                         return function cleanup() { }
    //                     }
    //                 })
    //                 .catch((err) => {
    //                     console.log('Oopps... something wrong1');
    //                     console.log(err);
    //                     return function cleanup() { }
    //                 })
    //                 .finally(() => {
    //                     setIsLoadingRemove(false);
    //                     setFiIdRemove('');
    //                 });
    //         } catch (error) {
    //             console.log('Oopps... something wrong2');
    //             console.log(error);
    //             setIsLoadingRemove(false);
    //             return function cleanup() { }
    //         }
    //     }
    // }, [isLoadingRemove, fiIdRemove]);

    const handleSubmitApprove = e => {
        e.preventDefault();

        if (approvedFiList.includes(fiIdApprove)) {
            setApprovedMsg(`${fiIdApprove} already approved`);
            setTimeout(() => {
                setApprovedMsg('');
            }, 5000);
            setFiIdApprove('');
        } else {
            setIsLoadingApprove(true);
            setApprovedMsg('');
        }
    };

    const handleSubmitRemove = e => {
        e.preventDefault();

        if (!approvedFiList.includes(fiIdRemove)) {
            setRemovedMsg(`${fiIdRemove} is not approved`);
            setTimeout(() => {
                setRemovedMsg('');
            }, 5000);
            setFiIdRemove('');
        } else {
            setIsLoadingRemove(true);
            setRemovedMsg('');
        }
    };

    const handleClickNewModel = e => {
        e.preventDefault();
        // setIsLoading(true);
        history.push('/org/models/new');
    };

    // FIXME Not removing cookies sync
    function handleClickLogout() {
        removeCookie('userJWT');
        removeCookie('ledgerUser');
        removeCookie('orgCredentials');
        history.push('/login');
    }

    return (
        <Flex minWidth={380}>
            <Box mx={'auto'} width={[1, 10 / 12]}>
                <Flex px={2} mx={'auto'} justifyContent='space-between'>
                    <Box my={'auto'}>
                        <Image
                            alt="Liken logo"
                            height="50"
                            my={3}
                            src={logoHorizontal}
                        />
                    </Box>
                    <Flex my={'auto'}>
                        <Button icon='Add' mr={2} onClick={handleClickNewModel}>New Model</Button>
                        <Button.Outline icon='PowerSettingsNew' onClick={handleClickLogout}>Logout</Button.Outline>
                    </Flex>
                </Flex>
                <Card>
                    <Heading as={'h1'}>My models</Heading>
                    {/* <Suspense fallback={<Loader mx={'auto'} size='50px' />}> */}
                    {!myModels ? <Loader mx={'auto'} size='50px' /> : myModels.map((modelData, key) => (
                        <ModelData key={key} modelData={modelData} share />
                    ))}
                    {/* </Suspense> */}
                </Card>
                <Card mt={20}>
                    <Heading as={'h1'}>My approved models</Heading>
                    {/* <Suspense fallback={<Loader mx={'auto'} size='50px' />}> */}
                    {!approvedModels ? <Loader mx={'auto'} size='50px' /> : approvedModels.map((modelData, key) => (
                        <ModelData key={key} modelData={modelData} />
                    ))}
                    {/* </Suspense> */}
                </Card>
                {/* <Card mt={20}>
                    <Flex my={1}>
                        <Box ml={10} my={1}>
                            {approvedFiList.length > 0 ?
                                <Heading as={'h3'} my={'auto'}>Your approved financial institutions:</Heading>
                                :
                                <Heading as={'h3'} my={'auto'}>You have no approved financial institutions</Heading>
                            }
                            {approvedFiList.join(', ')}
                        </Box>
                    </Flex>
                </Card> */}
                {/* <Card mt={20}>
                    <Heading as={'h2'}>Approve financial institution</Heading>
                    <Form onSubmit={handleSubmitApprove}>
                        <Flex mx={-3}>
                            <Box width={1} px={3}>
                                <Field label="Financial institution ID" width={1}>
                                    <Form.Input
                                        type="text"
                                        required
                                        onChange={handleChooseFiApprove}
                                        value={fiIdApprove}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                        </Flex>
                        <Flex mx={-3} alignItems={'center'}>
                            <Box px={3}>
                                <Button type="submit" disabled={isLoadingApprove}>
                                    {isLoadingApprove ? <Loader color="white" /> : <p>Approve</p>}
                                </Button>
                            </Box>
                            {approvedMsg &&
                                <Box px={3}>
                                    <Text>{approvedMsg}</Text>
                                </Box>
                            }
                        </Flex>
                    </Form>
                </Card> */}
                {/* <Card mt={20}>
                    <Heading as={'h2'}>Remove financial institution approval</Heading>
                    <Form onSubmit={handleSubmitRemove}>
                        <Flex mx={-3}>
                            <Box width={1} px={3}>
                                <Field label="Financial institution ID" width={1}>
                                    <Form.Input
                                        type="text"
                                        required
                                        onChange={handleChooseFiRemove}
                                        value={fiIdRemove}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                        </Flex>
                        <Flex mx={-3} alignItems={'center'}>
                            <Box px={3}>
                                <Button type="submit" disabled={isLoadingRemove}>
                                    {isLoadingRemove ? <Loader color="white" /> : <p>Remove</p>}
                                </Button>
                            </Box>
                            {removedMsg &&
                                <Box px={3}>
                                    <Text>{removedMsg}</Text>
                                </Box>
                            }
                        </Flex>
                    </Form>
                </Card> */}
            </Box>
        </Flex>
    );
}

export default Org;