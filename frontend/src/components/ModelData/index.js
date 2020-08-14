import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Flex, Box, Heading, Text, Button } from 'rimble-ui';
import useCollapse from 'react-collapsed';

import styles from './styles.module.css';

//FIXME Not correctly aligned when new model is added
const Data = React.memo(({ modelKey, title, modelData, share }) => {

    const history = useHistory();

    const handleShareModel = e => {
        e.preventDefault();
        history.push('/org/models/share', { modelKey, title });
    };

    return (
        <Box>
            {/* item.label === 'Name' && <Heading as={'h3'} color={'#4067ED'}>{item.value}</Heading> */}
            {/* <Heading as={'h3'} color={'#4067ED'}>{title}</Heading> */}

            <Flex justifyContent='space-between' alignItems='flex-end'>
                <Box ml={'40px'}>
                    {modelData.map((item, key) => (
                        <Flex my={1} key={key}>
                            {item.label !== 'Name' &&
                                <>
                                    <Box width={[1, 1 / 2, 1 / 3, 1 / 6]}>
                                        <Text fontWeight='500' my={'auto'}>{item.label}</Text>
                                    </Box>
                                    <Box width={1} mx={2}>
                                        <Text>{item.value}</Text>
                                    </Box>
                                </>
                            }
                        </Flex>
                    ))}
                </Box>
                <Box>
                    {share && (
                        <Button
                            mainColor={'#00ace6'}
                            icon='Share'
                            mt={2}
                            type="submit"
                            onClick={handleShareModel}
                        >
                            Share model
                            {/* {isLoadingRemove ? <Loader color="white" /> : <p>Share model</p>} */}
                        </Button>
                    )}
                </Box>
            </Flex>
        </Box>
    );
})

const ModelData = ({ title, modelData, share }) => {

    title = title ?? modelData.modelData.filter(item => item.label === 'Name')[0].value;

    const [renderChildren, setRenderChildren] = useState(false);
    const { getToggleProps, getCollapseProps, isExpanded } = useCollapse({
        defaultExpanded: false,
        onExpandStart() {
            setRenderChildren(true);
        },
        onCollapseEnd() {
            setRenderChildren(false);
        }
    });

    return (
        <Box bg={'#59595909'} mb={2} p={3} borderRadius={1}>
            <Flex my={'auto'}  {...getToggleProps()} className={styles.expander}>
                <Box my={'auto'} mr={2}>
                    <Button.Outline
                        icononly
                        size='small'
                        icon={isExpanded ? "KeyboardArrowDown" : "KeyboardArrowRight"}
                        style={{ outline: 'none', border: 'none' }}
                    />
                </Box>
                <Box my={'auto'}>
                    <Heading as={'h3'} color={'#00ace6'}>{title}</Heading>
                </Box>
            </Flex>
            <div {...getCollapseProps()}>
                {renderChildren && (
                    <Data modelKey={modelData.modelKey} title={title} modelData={modelData.modelData} share={share} />
                )}
            </div>
        </Box>
    );
}

export default ModelData;