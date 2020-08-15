import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Flex, Box, Card, Form, Field, Button, Loader, Image } from 'rimble-ui';

import qs from 'qs';

import logo from '../../assets/Logo.svg';
import api from '../../service/api';

const Login = () => {

    const history = useHistory();
    const [cookies, setCookie, removeCookie] = useCookies();

    const [validated, setValidated] = useState(false);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("client");
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    function handleLogin(e) {
        setLogin(e.target.value);
    };

    function handlePassword(e) {
        setPassword(e.target.value);
    };

    const validateForm = useCallback(
        () => {
            if (
                login.length > 0 &&
                password.length > 5 &&
                !isLoading
            ) {
                setValidated(true);
                setSubmitDisabled(false);
            } else {
                setValidated(false);
                setSubmitDisabled(true);
            }
        },
        [login, password, userType, isLoading]
    );

    useEffect(() => {
        validateForm();
    }, [validateForm]);

    useEffect(() => {
        if (validated && isLoading) {
            try {
                api
                    .post('/org/login', qs.stringify({ login, password }))
                    .then(res => {
                        if (res.status === 200) {

                            removeCookie('userJWT');
                            removeCookie('ledgerUser');
                            removeCookie('orgCredentials');

                            setCookie('userJWT', res.data.userJWT);
                            setCookie('ledgerUser', login);
                            res.data.orgCredentials && setCookie('orgCredentials', res.data.orgCredentials);
                            history.push('/org');

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
    }, [login, password, validated, isLoading, history, setCookie]);

    const handleSubmit = e => {
        e.preventDefault();
        setIsLoading(true);
    };

    return (
        <Flex height={'100vh'}>
            <Box mx={'auto'} my={'auto'} width={[1, 1 / 2, 1 / 3, 1 / 4]}>
                <Card>
                    <Image
                        alt="Liken logo"
                        height="150"
                        width={1}
                        src={logo}
                    />
                    <Form onSubmit={handleSubmit}>
                        <Flex mx={-3} flexWrap={"wrap"}>
                            <Box width={1} px={3}>
                                <Field label="Login" width={1}>
                                    <Form.Input
                                        type="text"
                                        required
                                        onChange={handleLogin}
                                        value={login}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                            <Box width={1} px={3}>
                                <Field label="Password" width={1}>
                                    <Form.Input
                                        type="password"
                                        required
                                        onChange={handlePassword}
                                        value={password}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                        </Flex>
                        <Button type="submit" disabled={submitDisabled} width={1}>
                            {isLoading ? <Loader color="white" /> : <p>Login</p>}
                        </Button>
                    </Form>
                </Card>
            </Box>
        </Flex>
    );
}

export default Login;