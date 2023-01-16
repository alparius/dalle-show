import React, { useContext, useState } from 'react';
import { Button, Header, Image, Modal, Container, Icon, List } from 'semantic-ui-react';

import { IsGermanContext } from '../App';
import concerns_img from '../static/imagenet.jpg';

const ConcernsModal = () => {
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
                        <Icon name='warning sign' size='big' />
                        <p style={{ marginTop: '0.5em', fontSize: '16px' }}>{isGerman ? 'Bedenken' : 'Concerns'}</p>
                    </Container>
                </Button>
            }
        >
            <Modal.Header>{isGerman ? 'Ist das problematisch?' : 'Is this problematic?'}</Modal.Header>
            <Modal.Content image>
                <Image size='big' src={concerns_img} style={{ width: '40%', height: '40%', margin: '25px 0px' }} verticalAlign='middle' fluid />

                {isGerman ? (
                    <Modal.Description>
                        <Header>Missbrauchspotentiale</Header>
                        <p style={{ lineHeight: '30px' }}>
                            Technologie kann auch auf bösartige Weise eingesetzt werden.
                        </p>

                        <p style={{ lineHeight: '30px' }}>
                            Die Modelle des maschinellen Lernens werden immer weiter verfeinert. In diesem Wettlauf mit dem rasanten Fortschritt bleiben wichtige Fragen ungelöst.
                            Mögliche Folgen davon sind:
                        </p>
                        <List bulleted relaxed>
                            <List.Item>
                                Das Modell ist in der Lage, Inhalte zu generieren, die beleidigend oder diskriminierend gegenüber Personen oder Gruppen sind,
                                da es einige problematische Konzepte aus den Millionen von Zufallsbildern gelernt hat, mit denen es trainiert wurde.
                            </List.Item>
                            <List.Item>
                                Viele Trainingsbilder wurden ohne die Erlaubnis ihrer Urheber*innen verwendet, z. B. die Arbeiten von Künstler*innen.
                            </List.Item>
                            <List.Item>
                                Die Arbeitsplätze von Künstler*innen könnten gefährdet sein.
                            </List.Item>
                            <List.Item>
                                Generierte Bilder könnten für Fake News, Propaganda oder Erpressung verwendet werden.
                            </List.Item>
                        </List>
                    </Modal.Description>
                ) : (
                    <Modal.Description>
                        <Header>Misuse potentials</Header>
                        <p style={{ lineHeight: '30px' }}>
                            Technology can also be used in malicious ways.
                        </p>

                        <p style={{ lineHeight: '30px' }}>
                            Machine learning models are getting continuously refined. In this race to keep up with the rapid pace of progress,
                            important concerns are being left unsolved. Possible consequences of this are:
                        </p>
                        <List bulleted relaxed>
                            <List.Item>
                                The model is able to generate content that is offensive or discriminatory towards people or groups because it learned some problematic concepts from the millions of random pictures that it was trained on.
                            </List.Item>
                            <List.Item>
                                Many training images were used without their creators' permission, for instance, artists' work.
                            </List.Item>
                            <List.Item>
                                The jobs of artists could be endangered.
                            </List.Item>
                            <List.Item>
                                Generated images could be used for fake news, propaganda, or blackmail.
                            </List.Item>
                        </List>
                    </Modal.Description>
                )}
            </Modal.Content>
            <Modal.Actions>
                <Button size='big' content={isGerman ? 'Zurück' : 'Go back'} onClick={() => setOpen(false)} style={{backgroundColor: "#2F009D", color: "white"}} />
            </Modal.Actions>
        </Modal>
    );
};

export default ConcernsModal;
