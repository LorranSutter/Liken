import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Flex, Box, Card, Heading, Button, Loader, Image } from 'rimble-ui';

import axios from 'axios';

import logoHorizontal from '../../assets/Logo_horizontal.svg';
import api from '../../service/api';
import ModelData from '../../components/ModelData';
import { setModelListData } from '../../functions/setModelListData';

const Org = () => {

    const history = useHistory();
    const [cookies, setCookie, removeCookie] = useCookies();

    const [myModels, setMyModels] = useState();
    const [approvedModels, setApprovedModels] = useState();

    useEffect(() => {
        try {
            axios.all([
                api.get('/org/queryAllModelsByOwner'),
                api.get('/org/queryAllModelsByApprovedUser')
            ])
                .then(axios.spread(
                    (modelListOwner, modelListApproved) => {
                        if (modelListOwner.status === 200 && modelListApproved.status === 200) {
                            modelListOwner = modelListOwner.data.modelList;
                            modelListApproved = modelListApproved.data.modelList;
                            setModelListData(modelListOwner, setMyModels);
                            setModelListData(modelListApproved, setApprovedModels);
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


    const handleClickNewModel = e => {
        e.preventDefault();
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
                    {!myModels ? <Loader mx={'auto'} size='50px' /> : myModels.map((modelData, key) => (
                        <ModelData key={key} modelData={modelData} share />
                    ))}
                </Card>
                <Card mt={20}>
                    <Heading as={'h1'}>My approved models</Heading>
                    {!approvedModels ? <Loader mx={'auto'} size='50px' /> : approvedModels.map((modelData, key) => (
                        <ModelData key={key} modelData={modelData} />
                    ))}
                </Card>
            </Box>
        </Flex>
    );
}

export default Org;