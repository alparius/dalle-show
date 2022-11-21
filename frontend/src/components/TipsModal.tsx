import React, { useContext, useState } from "react";
import { Button, Header, Image, Modal, Container, Icon, List } from "semantic-ui-react";

import { IsGermanContext } from "../App";
import explanation_image from "../static/explanation.jpg"


const TipsModal = () => {
    const isGerman = useContext(IsGermanContext);
    const [open, setOpen] = useState(false)

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            size='large'
            trigger={<Button fluid basic style={{ borderStyle: "ridge" }}>
                <Container>
                    <Icon name='idea' size='big' />
                    <p style={{ marginTop: '0.5em', fontSize: '16px' }}>{isGerman ? 'Tipps' : 'Tips'}</p>
                </Container>
            </Button>}
        >
            <Modal.Header>How does this work?</Modal.Header>
            <Modal.Content image>
                <Image size='medium' src={explanation_image} wrapped />
                <Modal.Description>
                    <Header>Tips & Tricks</Header>
                    <List bulleted>
                        <List.Item>Be descriptive and specific of details! Instead of "an interesting animal", try something like "blue squirrel with yellow hat riding a bicycle".</List.Item>
                        <List.Item>Try to add keywords to the prompt to modify the style of the image: "illustration",  "painting", "sketch", "photorealistic", "high definition”.</List.Item>
                        <List.Item style={{color: "red"}}>Image idea for this modal: a column of variations of the same prompt with multiple keyword modifiers.</List.Item>
                    </List>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    content="Got it"
                    onClick={() => setOpen(false)}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
};

export default TipsModal;
