import React, { useContext, useState } from "react";
import {
    Button,
    Header,
    Image,
    Modal,
    Container,
    Icon,
    List,
} from "semantic-ui-react";

import { IsGermanContext } from "../App";
import tipps_tricks_image from "../static/tipps_tricks.png";

const TipsModal = () => {
    const isGerman = useContext(IsGermanContext);
    const [open, setOpen] = useState(false);

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            size="large"
            style={{ width: "60%", fontSize: "21px" }}
            trigger={
                <Button fluid basic style={{ borderStyle: "ridge" }}>
                    <Container>
                        <Icon name="idea" size="big" />
                        <p style={{ marginTop: "0.5em", fontSize: "18px" }}>
                            {isGerman ? "Tipps" : "Tips"}
                        </p>
                    </Container>
                </Button>
            }
        >
            <Modal.Header>
                {isGerman
                    ? "Wie macht man es interessant?"
                    : "How to make it interesting?"}
            </Modal.Header>
            <Modal.Content image>
                <Image size="massive" src={tipps_tricks_image} wrapped />
                <Modal.Description>
                    <Header>{isGerman ? "Tipps und Tricks" : "Tips & Tricks"}</Header>
                    <List bulleted relaxed>
                        <List.Item style={{ lineHeight: "30px" }}>
                            {isGerman ? (
                                <>
                                    Sei beschreibend und detailgenau! Versuche statt{" "}
                                    <i>"ein interessantes Tier"</i> so etwas wie{" "}
                                    <i>"blaues Eichhörnchen mit gelbem Hut, das Fahrrad fährt"</i>
                                    .
                                </>
                            ) : (
                                <>
                                    Be descriptive and specific of details! Instead of{" "}
                                    <i>"an interesting animal"</i>, try something like{" "}
                                    <i>"blue squirrel with yellow hat riding a bicycle"</i>.
                                </>
                            )}
                        </List.Item>
                        <List.Item style={{ lineHeight: "30px" }}>
                            {isGerman
                                ? 'Versuch, dem Text Schlüsselwörter hinzuzufügen, um den Stil des Bildes zu ändern: "Illustration", "Gemälde", "Skizze", "fotorealistisch", "hochauflösend".'
                                : "Try to add keywords to the prompt to modify the style of the image:"}

                            <List bulleted relaxed>
                                <List.Item>{isGerman ? "" : "illustration"}</List.Item>
                                <List.Item>{isGerman ? "" : "painting"}</List.Item>
                                <List.Item>{isGerman ? "" : "photorealistic"}</List.Item>
                                <List.Item>{isGerman ? "" : "in the style of Monet"}</List.Item>
                                <List.Item>{isGerman ? "" : "16th century"}</List.Item>
                                <List.Item>{isGerman ? "" : "polaroid film"}</List.Item>
                                <List.Item>{isGerman ? "" : "dark"}</List.Item>
                            </List>
                        </List.Item>
                        {/* <List.Item style={{lineHeight:'30px'}}>
                            {isGerman
                                ? 'Die Bilder auf der linken Seite wurden durch folgende Eingaben erstellt (von links nach rechts, von oben nach unten):'
                                : 'The images on the left were created from following prompts (left to right, top to bottom):'}
                            <List bulleted relaxed>
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
                        </List.Item> */}
                    </List>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    size="big"
                    content={isGerman ? "Danke!" : "Thanks!"}
                    onClick={() => setOpen(false)}
                    positive
                />
            </Modal.Actions>
        </Modal>
    );
};

export default TipsModal;
