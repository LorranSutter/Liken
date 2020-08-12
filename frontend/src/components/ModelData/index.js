import React from 'react';
import { useHistory } from 'react-router-dom';
import { Flex, Box, Heading, Text, Button } from 'rimble-ui';

const UserData = ({ modelData, share }) => {

    const history = useHistory();

    const handleShareModel = e => {
        e.preventDefault();
        // setIsLoading(true);
        history.push('/org/models/share');
    };

    return (
        <Box bg={'rgba(53, 192, 237, 0.05)'} mb={2} p={3} borderRadius={1}>
            {modelData.map((item, key) => (
                <Flex my={1} key={key}>
                    <Box width={[1, 1 / 2, 1 / 3, 1 / 6]}>
                        <Heading as={'h4'} my={'auto'}>{item.label}</Heading>
                    </Box>
                    <Box width={1}>
                        <Text>{item.value}</Text>
                    </Box>
                </Flex>
            ))}
            {share &&
                <Button mt={2} type="submit" onClick={handleShareModel}>
                    Share model
                    {/* {isLoadingRemove ? <Loader color="white" /> : <p>Share model</p>} */}
                </Button>
            }
        </Box>
    );
}

export default UserData;