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
                            Technologie kann auf verschiedene Arten genutzt werden, einige davon können bösartig sein. Das gilt auch für dieses Modell.
                        </p>

                        <p style={{ lineHeight: '30px' }}>
                            Modelle wie dieses werden ständig weiterentwickelt und verbessert. Allein im Jahr 2022 gab es große Fortschritte,
                            beispielsweise in der Detailgenauigkeit der erzeugten Bilder.  Dieses rasante Tempo der Verbesserung kann mehrere
                            problematische Folgen haben, die nachfolgend skiziert werden:
                        </p>
                        <List bulleted relaxed>
                            <List.Item>
                                Für das Training des Modells wurden Millionen von Bildern zufällig aus dem Internet ausgewählt. Hierüber hat das
                                Modell auch problematische Konzepte erlernt und diskriminiert möglicherweise Personen (Gruppen).
                            </List.Item>
                            <List.Item>
                                Viele der Bilder, mit denen das Modell trainiert wird, werden ohne die Erlaubnis deren Urheber:innen genutzt, wie zum
                                Beispiel die Werke von Künstler:innen.
                            </List.Item>
                            <List.Item>
                                Künstler:innen weisen auf die Gefahr hin, dass ihre Arbeitsplätze in Gefahr sind, wenn Modelle wie dieses ihre Arbeit
                                erledigen können.
                            </List.Item>
                            <List.Item>
                                Man könnte ein solches Modell auf Bilder einer bestimmten Person trainieren und die erzeugten Bilder dann für Propaganda
                                oder Erpressung verwenden.
                            </List.Item>
                            <List.Item>
                                Fallen dir noch mehr Möglichkeiten ein, diese Technologie zu missbrauchen?
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
                        Machine learning models are getting continously refined. In this race to keep up with the rapid pace of progress, important concerns are being left unsolved. Possible consequenses of this are:
                        </p>
                        <List bulleted relaxed>
                            <List.Item>
                                The model is able to generate content that is offensive or discriminatory towards people or groups, because it learned some problematic concepts from the millions of random pictures that it was trained on.
                            </List.Item>
                            <List.Item>
                                Many training images were used without their creators' permission, for instance the work of artists.
                            </List.Item>
                            <List.Item>
                                Jobs of artists could be endagered.
                            </List.Item>
                            <List.Item>
                                Generated image could be used for fake news, propaganda or blackmail.
                            </List.Item>
                        </List>
                    </Modal.Description>
                )}
            </Modal.Content>
            <Modal.Actions>
                <Button size='big' content={isGerman ? 'Zurück' : 'Go back'} onClick={() => setOpen(false)} positive />
            </Modal.Actions>
        </Modal>
    );
};

export default ConcernsModal;
