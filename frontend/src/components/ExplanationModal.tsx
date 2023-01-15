import React, { useContext, useState } from 'react';
import { Button, Header, Image, Modal, Container, Icon } from 'semantic-ui-react';

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
                        <Header>Bildgenerierung durch Diffusion</Header>
                        <p style={{ lineHeight: '30px' }}>
                            Diese Anwendung basiert auf dem Stable Diffusion Modell. Das Modell wird anhand von Millionen von Bildern aus dem Internet
                            und deren Beschriftungen trainiert. Mit der Zeit lernt es, ein Bild auf der Grundlage einer Texteingabe zu zeichnen.
                        </p>
                        <p style={{ lineHeight: '30px' }}>
                            Das Modell erlernt Konzepte anhand der Bilder, mit denen es trainiert wird. Es kann aber auch lernen, wie man einzigartige Bilder generiert,
                            die es nicht gibt, wie z. B. "der Eiffelturm landet auf dem Mond", indem es mehrere Konzepte miteinander kombiniert.
                        </p>
                        <p style={{ lineHeight: '30px' }}>
                            Diffusionsbasierte Modelle werden trainiert, indem den Bildern immer mehr Rauschen hinzugefügt wird, bis sie keine Informationen mehr enthalten.
                            Anschließend wird dieser Prozess umgekehrt, sodass schrittweise das gesamte Rauschen aus einem ursprünglichen Bild mit reinem Rauschen entfernt werden kann,
                            um ein neues, klares Bild zu generieren.
                        </p>
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
                <Button size='big' content={isGerman ? 'Zurück' : 'Go back'} onClick={() => setOpen(false)} style={{backgroundColor: "#2F009D", color: "white"}} />
            </Modal.Actions>
        </Modal>
    );
};

export default ExplanationModal;
