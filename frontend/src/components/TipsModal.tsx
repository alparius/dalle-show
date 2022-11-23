import React, { useContext, useState } from 'react';
import { Button, Header, Image, Modal, Container, Icon, List } from 'semantic-ui-react';

import { IsGermanContext } from '../App';
import tipps_tricks_image from '../static/tipps_tricks.png';

const TipsModal = () => {
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
                        <Icon name='idea' size='big' />
                        <p style={{ marginTop: '0.5em', fontSize: '18px' }}>{isGerman ? 'Tipps' : 'Tips'}</p>
                    </Container>
                </Button>
            }
        >
            <Modal.Header>{isGerman ? 'Wie macht man es interessant?' : 'How to make it interesting?'}</Modal.Header>
            <Modal.Content image>
                <Image size='massive' src={tipps_tricks_image} wrapped />
                <Modal.Description>
                    <Header>{isGerman ? 'Tipps und Tricks' : 'Tips & Tricks'}</Header>
                    <List style={{ fontSize: '16px' }} bulleted>
                        <List.Item>
                            {isGerman
                                ? 'Sei beschreibend und detailgenau! Versuch statt "ein interessantes Tier" etwas wie "blaues Eichhörnchen mit gelbem Hut, das Fahrrad fährt".'
                                : 'Be descriptive and specific of details! Instead of "an interesting animal", try something like "blue squirrel with yellow hat riding a bicycle"'}
                        </List.Item>
                        <List.Item>
                            {isGerman
                                ? 'Versuch, dem Text Schlüsselwörter hinzuzufügen, um den Stil des Bildes zu ändern: "Illustration", "Gemälde", "Skizze", "fotorealistisch", "hochauflösend".'
                                : 'Try to add keywords to the prompt to modify the style of the image: "illustration",  "painting", "sketch", "photorealistic", "high definition”.'}
                        </List.Item>
                        <List.Item>
                            {isGerman
                                ? 'Die Bilder auf der linken Seite wurden nach folgenden Vorgaben erstellt (von links nach rechts, von oben nach unten):'
                                : 'The images on the left were created from following prompts (left to right, top to bottom):'}
                            <List bulleted>
                                <List.Item>
                                    {isGerman
                                        ? '"elektrische Schafe, von denen die Androiden träumen"'
                                        : '"electric sheep that the androids dream of"'}
                                </List.Item>
                                <List.Item>
                                    {isGerman
                                        ? '"elektrische Schafe, von denen die Androiden träumen, impressionistisches Gemälde aus den 1880er Jahren"'
                                        : '"electric sheep that the androids dream of, 1880s impressionist painting"'}
                                </List.Item>
                                <List.Item>
                                    {isGerman
                                        ? '"elektrische Schafe, von denen die Androiden träumen, eine paläolithische Höhlenkunst"'
                                        : '"electric sheep that the androids dream of, a paleolithic cave art"'}
                                </List.Item>
                                <List.Item>
                                    {isGerman
                                        ? '"elektrische Schafe, von denen die Androiden träumen, Aquarellmalerei, Pastellfarben"'
                                        : '"electric sheep that the androids dream of, watercolor painting, pastel colors"'}
                                </List.Item>
                            </List>
                        </List.Item>
                    </List>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button content={isGerman ? 'Danke!' : 'Thanks!'} onClick={() => setOpen(false)} positive />
            </Modal.Actions>
        </Modal>
    );
};

export default TipsModal;
