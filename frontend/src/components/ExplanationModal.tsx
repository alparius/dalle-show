import React from "react";
import { Button, Header, Image, Modal } from "semantic-ui-react";
import explanation_image from "../explanation.jpg"


const ExplanationModal = () => {
    const [open, setOpen] = React.useState(false)

    return (
        <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          trigger={<Button size={"massive"} >Explain</Button>}
        >
          <Modal.Header>How does this work?</Modal.Header>
          <Modal.Content image>
            <Image size='medium' src={explanation_image} wrapped />
            <Modal.Description>
              <Header>Stable Diffusion</Header>
              <p>
                Stable diffusion is a machine learning model that generates images from text prompts.
              </p>
              <p>Nobody really understands it, but some heavy math is involved.</p>
              <p>Do try this at home!</p>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={() => setOpen(false)}>
              Okay
            </Button>
            <Button
              content="Okay, but green"
              onClick={() => setOpen(false)}
              positive
            />
          </Modal.Actions>
        </Modal>
      )
};

export default ExplanationModal;
