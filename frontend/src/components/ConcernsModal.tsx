import React, { useContext, useState } from 'react';
import { Button, Header, Image, Modal, Container, Icon, List } from 'semantic-ui-react';

import { IsGermanContext } from '../App';
import explanation_image_de from '../static/collage.jpg';
import explanation_image_en from '../static/collage.jpg';

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
                        <Header>Dual-Use oder Missbrauchspotentiale</Header>
                        <p>
                            Technik kann auf verschiedene Arten genutzt werden. Das gilt auch für dieses Modell, das, wie du gesehen hast, die verschiedensten Bilder zeichnen kann.
                        </p>

                        <p>
                            Modelle wie dieses werden ständig weiterentwickelt und verbessert. Allein im Jahr 2022 gab es große Fortschritte, beispielsweise in der Detailgenauigkeit der Zeichnungen anhand der Texteingabe.
							Das bedeutet nicht nur gutes. Es gibt verschiedene Problematiken, die nachfolgend skiziert werden:
							
							<List bulleted>
                                <List.Item>Das Modell ist sehr generalisierend: es versucht sich daran, das komplexe visuelle Verständnis der Welt in kompromierter Form in nur wenigen Gigabyte Daten abzubilden.</List.Item>
                                <List.Item>Für das Training des Modells wurden Millionen von Bildern zufällig aus dem Internet ausgewählt. Hierüber hat das Modell auch problematische Konzepte erlernt und diskriminiert möglicherweise Personen(gruppen).</List.Item>
                                <List.Item>Viele der Bilder, mit denen das Modell trainiert wird, werden ohne die Erlaubnis deren Urheber\_innen genutzt, wie zum Beispiel die Werke von Künstler\_innen.</List.Item>
                                <List.Item>Künstler\_innen weisen auf die Gefahr hin, dass ihre Arbeitsplätze in Gefahr sind, wenn Modelle wie dieses ihre Arbeit erledigen können.</List.Item>
                                <List.Item>Zukünftig könnten Bilder erzeugt oder verändert werden, die möglicherweise für Propaganda-Zwecke genutzt werden können. Beispielsweise um Behauptungen glaubwürdig erscheinen zu lassen oder um Fakten zu widerlegen.</List.Item>
                                <List.Item>Je nach Eingabe können Inhalte erzeugt werden, die als anstößig, jugendgefährdend oder diskriminierend gelten.</List.Item>
                                <List.Item>Wer hat die Rechte an einer Zeichnung? Die Person, die die Eingabe getätigt hat? Die Programmierer\_innen des Modells? Das Modell selbst?</List.Item>
                            </List>
                        </p>
                    </Modal.Description>
                ) : (
                    <Modal.Description>
                        <Header>Dual-Use or misuse potential</Header>
                        <p>
                             Technology can be used in various ways, also problematic ones. This applies to the model which is able to draw disparate images, like you've seen yourself.
                        </p>

                        <p>
                            Models like this are in constant developement and are getting continously refined. Only in 2022 there where big improvements, for instance in granularity of the drawing based on a prompt.
							This does not only mean good. There are several problematics, outlined here: 
                            <List bulleted>
                                <List.Item>The model is generalizing. It tries to compress the complex visual understanding of the world only into a few Gigabytes.</List.Item>
                                <List.Item>Millions of randomly selected pictures on the internet were used to train the model. Hence the model learned problematic concepts and is likely to also generate discriminatory content towards people or groups.</List.Item>
                                <List.Item>Many of the these images used for training are used withouth their creators permission, for instance the creations of artists.</List.Item>
                                <List.Item>Artists point out that their jobs are endagered, if the model is able to create art like them.</List.Item>
                                <List.Item>In the future, images could be created or edited, that might be used for propaganda porpuses. For instance to bolster claims or to counter facts.</List.Item>
                                <List.Item>Based on the promt, content can be created that is considered offensive, x-rated or discriminatory.</List.Item>
                                <List.Item>Who owns the created drawings? The person typing in the prompt? The programmers of the model? The model itself?</List.Item>
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
