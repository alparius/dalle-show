import React, { useContext } from 'react';
import { Button, Container, Header, Image } from 'semantic-ui-react';

import { IsGermanContext, Page } from '../App';
import start_image from '../static/finish_empty.jpg';

type Props = {
    setCurrentPage: any;
};

const Finish = ({ setCurrentPage }: Props) => {
    const isGerman = useContext(IsGermanContext);

    const continueButtonPressed = () => {
        setCurrentPage(Page.Content);
    };

    const backButtonPressed = () => {
        setCurrentPage(Page.Start);
    };

    const upperTextStyle = {
        fontSize: '30px',
        color: 'black',
        textAlign: 'center',
        position: 'absolute',
        top: 0,
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
        top: 130,
        bottom: 0,
        left: 130,
        right: 0,
        height: 'fit-content',
        width: '30%',
        margin: 'auto',
    };

    const upperTextEn = "It's a lot of fun, isn't it?";
    const upperTextDe = 'Das macht viel Spaß, nicht wahr?';

    const lowerTextEn = 'Do you want to continue or let others play too?';
    const lowerTextDe = 'Möchtest du fortfahren oder andere spielen lassen?';

    return (
        <Container>
            <Container>
                <Image src={start_image} size={'huge'} className={'centered'} />
                <Header style={upperTextStyle}> {isGerman ? upperTextDe : upperTextEn}</Header>
                <Header style={lowerTextStyle}> {isGerman ? lowerTextDe : lowerTextEn}</Header>
            </Container>
            <Button size={'massive'} color={'red'} onClick={continueButtonPressed}>
                {isGerman ? 'Fortfahren' : 'Continue'}
            </Button>
            <Button floated={'right'} color={'green'} size={'massive'} onClick={backButtonPressed}>
                {isGerman ? 'Lass andere spielen!' : 'Let others play!'}
            </Button>
        </Container>
    );
};

export default Finish;
