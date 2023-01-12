import React, { useContext } from 'react';
import { Button, Container, Header, Image } from 'semantic-ui-react';

import { IsGermanContext, Page } from '../App';
import start_image from '../static/finish_empty.jpg';

type Props = {
    setCurrentPage: any;
};

const Finish = ({ setCurrentPage }: Props) => {
    const isGerman = useContext(IsGermanContext);

    const backButtonPressed = () => {
        setCurrentPage(Page.Start);
    };

    const upperTextStyle = {
        fontSize: '30px',
        color: 'black',
        textAlign: 'center',
        position: 'absolute',
        top: 60,
        bottom: 410,
        left: 0,
        right: 70,
        height: 'fit-content',
        width: '40%',
        margin: 'auto',
    };

    const lowerTextStyle = {
        fontSize: '30px',
        color: 'black',
        textAlign: 'center',
        position: 'absolute',
        top: 200,
        bottom: 0,
        left: 130,
        right: 0,
        height: 'fit-content',
        width: '25%',
        margin: 'auto',
    };

    const upperTextEn = "It's a lot of fun, isn't it?";
    const upperTextDe = 'Das macht viel Spaß, oder?';

    const lowerTextEn = 'Maybe you should let others play too.';
    const lowerTextDe = 'Vielleicht solltest du auch andere spielen lassen.';

    return (
        <Container>
            <Container>
                <Image src={start_image} size={'huge'} className={'centered'} style={{ marginTop: "5vh" }} />
                <Header style={upperTextStyle}> {isGerman ? upperTextDe : upperTextEn}</Header>
                <Header style={lowerTextStyle}> {isGerman ? lowerTextDe : lowerTextEn}</Header>
            </Container>
            <Button floated={'right'} color={'green'} size={'massive'} onClick={backButtonPressed}>
                {isGerman ? 'Fortfahren' : 'Continue'}
            </Button>
        </Container>
    );
};

export default Finish;
