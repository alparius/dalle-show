import React, { useContext, useState } from 'react';
import { Button, Header, Image, Modal, Container, Icon, List } from 'semantic-ui-react';

import { IsGermanContext } from '../App';
import explanation_image_de from '../static/diagram2-de.png';
import explanation_image_en from '../static/diagram2-en.png';

const ConcernsModal = () => {
    const isGerman = useContext(IsGermanContext);
    const [open, setOpen] = useState(false);

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            size='large'
            trigger={
                <Button fluid basic style={{ borderStyle: 'ridge' }}>
                    <Container>
                        <Icon name='warning sign' size='big' />
                        <p style={{ marginTop: '0.5em', fontSize: '16px' }}>{isGerman ? 'Bedenken' : 'Concerns'}</p>
                    </Container>
                </Button>
            }
        >
            <Modal.Header>{isGerman ? 'Bedenken' : 'Concerns'}</Modal.Header>
            <Modal.Content image>
                <Image
                    size='massive'
                    src={isGerman ? explanation_image_de : explanation_image_en}
                    style={{ width: '200%', height: '200%' }}
                    verticalAlign='middle'
                    fluid
                />

                {isGerman ? (
                    <Modal.Description>
                        <Header>Bilderzeugung durch Diffusion</Header>
                        <p>
                            Ein Modell wird anhand von Millionen von Bildern aus dem Internet und deren Beschriftungen trainiert. Mit der Zeit lernt
                            es, wie ein Bild auf der Grundlage einer Textaufforderung zu zeichnen ist.
                        </p>

                        <p>
                            Einige der Konzepte werden aus dem Gedächtnis gelernt, da es möglicherweise ähnliche Bilder gesehen hat. Es kann aber auch
                            lernen, wie man einzigartige Bilder erzeugt, die es nicht gibt, wie z. B. "der Eiffelturm landet auf dem Mond", indem es
                            mehrere Konzepte miteinander kombiniert. Um diese Ergebnisse zu erzielen, werden mehrere Modelle miteinander kombiniert:
                            <List bulleted>
                                <List.Item>ein Bildkodierer, der Rohbilder in eine Zahlenfolge umwandelt, mit dem dazugehörigen Dekodierer</List.Item>
                                <List.Item>ein Modell, das eine Texteingabe in ein kodiertes Bild umwandelt</List.Item>
                                <List.Item>ein Modell, das die Qualität der erzeugten Bilder zur besseren Filterung beurteilt</List.Item>
                            </List>
                        </p>
                    </Modal.Description>
                ) : (
                    <Modal.Description>
                        <Header>Image generation using diffusion</Header>
                        <p>
                            The machine learning model is trained by looking at millions of images from the internet with their associated captions.
                            Over time, it learns how to draw an image from a text prompt.
                        </p>

                        <p>
                            Some of the concepts are learnt from memory as it may have seen similar images. However, it can also learn how to create
                            unique images that don't exist such as "the Eiffel tower is landing on the moon" by combining multiple concepts together.
                            Several models are combined together to achieve these results:
                            <List bulleted>
                                <List.Item>an image encoder that turns raw images into a sequence of numbers with its associated decoder</List.Item>
                                <List.Item>a model that turns a text prompt into an encoded image</List.Item>
                                <List.Item>a model that judges the quality of the images generated for better filtering</List.Item>
                            </List>
                        </p>
                    </Modal.Description>
                )}
            </Modal.Content>
            <Modal.Actions>
                <Button content={isGerman ? 'Zurück' : 'Go back'} onClick={() => setOpen(false)} positive />
            </Modal.Actions>
        </Modal>
    );
};

export default ConcernsModal;