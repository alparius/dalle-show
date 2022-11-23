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
        bottom: 330,
        left: 0,
        right: 130,
        height: 'fit-content',
        width: '50%',
        margin: 'auto',
    };

    const lowerTextStyle = {
        fontSize: '22px',
        color: 'black',
        textAlign: 'center',
        position: 'absolute',
        top: 185,
        bottom: 0,
        left: 100,
        right: 0,
        height: 'fit-content',
        width: '50%',
        margin: 'auto',
    };

    const upperTextEn = 'Hi, my Name is Alpár! I am curious whether machines can really be creative. Do you know anything about that?';
    const upperTextDe = 'Hallo, mein Name ist Alpár! Ich bin neugierig, ob Maschinen wirklich kreativ sein können. Weißt du etwas darüber?';

    const lowerTextEn =
        'Hey, I\'m Evgenii! Sure! I would like to show you a machine that has learned to draw images. ' +
        'It can draw anything for you, just type in an idea! Do you want to try it out?';
    const lowerTextDe =
        'Hey, ich bin Evgenii! Klar! Ich zeige dir eine Maschine, die gelernt ' +
        'hat, Bilder zu zeichnen. Sie kann alles für dich zeichnen, du musst nur eine Idee eintippen! ' +
        'Willst du es ausprobieren?';

    return (
        <Container>
            <Container style={containerStyle}>
                <Image src={start_image} size={'huge'} className={'centered'} />
                <Header style={upperTextStyle}> {isGerman ? upperTextDe : upperTextEn}</Header>
                <Header style={lowerTextStyle}> {isGerman ? lowerTextDe : lowerTextEn}</Header>
            </Container>
            <Button floated={'right'} color={'green'} size={'massive'} onClick={playButtonPressed}>
                {isGerman ? 'Ausprobieren!' : 'Try it out!'}
            </Button>
        </Container>
    );
};

export default Start;
