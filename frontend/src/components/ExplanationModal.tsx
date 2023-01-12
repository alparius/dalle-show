import React, { useContext, useState } from 'react';
import { Button, Header, Image, Modal, Container, Icon, List } from 'semantic-ui-react';

import { IsGermanContext } from '../App';
import explanation_image_de from '../static/diagram2-de.svg';
import explanation_image_en from '../static/diagram2-en.svg';

const ExplanationModal = () => {
    const isGerman = useContext(IsGermanContext);
    const [open, setOpen] = useState(false);

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            size='large'
            style={{ width: '70%', fontSize: '21px' }}
            trigger={
                <Button fluid basic style={{ borderStyle: 'ridge' }}>
                    <Container>
                        <Icon name='help' size='big' />
                        <p style={{ marginTop: '0.5em', fontSize: '16px' }}>{isGerman ? 'Erläuterung' : 'Explanation'}</p>
                    </Container>
                </Button>
            }
        >
            <Modal.Header>{isGerman ? 'Wie funktioniert das?' : 'How does this work?'}</Modal.Header>
            <Modal.Content image>
                <Image
                    size='massive'
                    src={isGerman ? explanation_image_de : explanation_image_en}
                    style={{ width: '110%', height: '110%', margin: '50px 0px' }}
                    verticalAlign='middle'
                    fluid
                />

                {isGerman ? (
                    <Modal.Description>
                        <Header>Bilderzeugung durch Diffusion</Header>
                        <p style={{ lineHeight: '30px' }}>
                            Ein Modell wird anhand von Millionen von Bildern aus dem Internet und deren Beschriftungen trainiert. Mit der Zeit lernt
                            es, ein Bild auf der Grundlage einer Textaufforderung zu zeichnen.
                        </p>

                        <p style={{ lineHeight: '30px' }}>
                            Viele der neu erzeugten Bilder beziehen sich auf Vertrautes. Das liegt daran, dass das Modell Konzepte anhand der Bilder
                            erlernt, mit denen es trainiert wird. Es kann aber auch lernen, wie man einzigartige Bilder erzeugt, die es nicht gibt,
                            wie z. B. "der Eiffelturm landet auf dem Mond", indem es mehrere Konzepte miteinander kombiniert. Um diese Ergebnisse zu
                            erzielen, werden mehrere Modelle miteinander kombiniert:
                        </p>
                        <List bulleted relaxed>
                            <List.Item>ein Bildkodierer, der Rohbilder in eine Zahlenfolge umwandelt, mit dem dazugehörigen Dekodierer</List.Item>
                            <List.Item>ein Modell, das eine Texteingabe in ein kodiertes Bild umwandelt</List.Item>
                            <List.Item>ein Modell, das die Qualität der erzeugten Bilder zur besseren Filterung beurteilt</List.Item>
                        </List>
                    </Modal.Description>
                ) : (
                    <Modal.Description>
                        <Header>Image generation using diffusion</Header>
                        <p style={{ lineHeight: '30px' }}>
                            This application is based on the Stable Diffusion model. The machine learning model was trained on millions of images from the internet with their captions.
                            Over time, it learned how to draw an image from a text prompt.
                        </p>

                        <p style={{ lineHeight: '30px' }}>
                            The model learns concepts from the pictures it is trained on. However, it can also learn how to create unique images that don't exist such as
                            "the Eiffel tower is landing on the moon" by combining multiple concepts together. 
                        </p>

                        <p style={{ lineHeight: '30px' }}>
                            Diffusion-based models are trained by adding more and more noise to images until they contain no information. Then this process is reversed so that it can
                            step-by-step remove all the noise from an initial pure noise image to generate a new clear image.
                        </p>
                     
                    </Modal.Description>
                )}
            </Modal.Content>
            <Modal.Actions>
                <Button size='big' content={isGerman ? 'Zurück' : 'Go back'} onClick={() => setOpen(false)} positive />
            </Modal.Actions>
        </Modal>
    );
};

export default ExplanationModal;
