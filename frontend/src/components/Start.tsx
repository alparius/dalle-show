import React, { useContext } from 'react';
import { Button, Container, Header, Image } from 'semantic-ui-react';

import { IsGermanContext, Page } from '../App';
import start_image from '../static/start_empty.jpeg';

type Props = {
    setCurrentPage: any;
};

const Start = ({ setCurrentPage }: Props) => {
    const isGerman = useContext(IsGermanContext);

    const playButtonPressed = () => {
        setCurrentPage(Page.Content);
    };

    const containerStyle = {
        height: '100%',
        position: 'relative',
    };

    const upperTextStyle = {
        fontSize: '23px',
        color: 'black',
        textAlign: 'center',
        position: 'absolute',
        top: 0,
        bottom: 325,
        left: 0,
        right: 175,
        height: 'fit-content',
        width: '47%',
        margin: 'auto',
    };

    const lowerTextStyle = {
        fontSize: '22px',
        color: 'black',
        textAlign: 'center',
        position: 'absolute',
        top: 200,
        bottom: 0,
        left: 125,
        right: 0,
        height: 'fit-content',
        width: '47%',
        margin: 'auto',
    };

    const upperTextEn = 'Hi, my name is Alpár! I am curious if computers can be creative. Do you know anything about that?';
    const upperTextDe = 'Hallo, mein Name ist Alpár! Ich bin neugierig, ob Computer kreativ sein können. Kannst du mir dazu etwas sagen?';

    const lowerTextEn =
        'Hey, I\'m Evgenii! Sure! I would like to show you a program that has learned to draw anything.' +
        'Just type in an idea! Do you want to try it out?';
    const lowerTextDe =
        'Hey, ich bin Evgenii! Klar! Ich zeige dir ein Programm, das gelernt ' +
        'hat, alles Mögliche zu zeichnen. Du musst nur eine Idee eintippen! Willst du es ausprobieren?';

    return (
        <Container>
            <Container style={containerStyle}>
                <Image src={start_image} size={'huge'} className={'centered'} style={{ marginTop: "5vh" }} />
                <Header style={upperTextStyle}> {isGerman ? upperTextDe : upperTextEn}</Header>
                <Header style={lowerTextStyle}> {isGerman ? lowerTextDe : lowerTextEn}</Header>
            </Container>
            <Button floated={'right'} style={{backgroundColor: "#2F009D", color: "white"}} size={'massive'} onClick={playButtonPressed}>
                {isGerman ? 'Ausprobieren!' : 'Try it out!'}
            </Button>
        </Container>
    );
};

export default Start;
