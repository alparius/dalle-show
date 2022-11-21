import React, { useContext, useState } from "react";
import { Button, Header, Image, Modal, Container, Icon, List } from "semantic-ui-react";

import { IsGermanContext } from "../App";
import explanation_image_de from "../static/diagram2-de.png"
import explanation_image_en from "../static/diagram2-en.png"


const ExplanationModal = () => {
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
          <Icon name='help' size='big' />
          <p style={{ marginTop: '0.5em', fontSize: '16px' }}>{isGerman ? 'Erläuterung' : 'Explanation'}</p>
        </Container>
      </Button>}
    >
      <Modal.Header>{isGerman ? 'Also was ist passiert? :)' : 'How does this work?'}</Modal.Header>
      <Modal.Content image>
        <Image size='massive' src={isGerman ? explanation_image_de  : explanation_image_en} style={{ width: "200%", height: "200%" }} verticalAlign='middle' fluid />

        {isGerman ?
          <Modal.Description>
            <Header>Imagine that this is in German</Header>
            <p>The machine learning model is trained by looking at millions of images from the internet with their associated captions.
              Over time, it learns how to draw an image from a text prompt.</p>

            <p>Some of the concepts are learnt from memory as it may have seen similar images. However, it can also learn how to create unique images that don't exist such as "the Eiffel tower is landing on the moon" by combining multiple concepts together.
              Several models are combined together to achieve these results:
              <List bulleted>
                <List.Item>an image encoder that turns raw images into a sequence of numbers with its associated decoder</List.Item>
                <List.Item>a model that turns a text prompt into an encoded image</List.Item>
                <List.Item>a model that judges the quality of the images generated for better filtering</List.Item>
              </List>
            </p>
          </Modal.Description>
          :
          <Modal.Description>
            <Header>Image generation using diffusion</Header>
            <p>The machine learning model is trained by looking at millions of images from the internet with their associated captions.
              Over time, it learns how to draw an image from a text prompt.</p>

            <p>Some of the concepts are learnt from memory as it may have seen similar images. However, it can also learn how to create unique images that don't exist such as "the Eiffel tower is landing on the moon" by combining multiple concepts together.
              Several models are combined together to achieve these results:
              <List bulleted>
                <List.Item>an image encoder that turns raw images into a sequence of numbers with its associated decoder</List.Item>
                <List.Item>a model that turns a text prompt into an encoded image</List.Item>
                <List.Item>a model that judges the quality of the images generated for better filtering</List.Item>
              </List>
            </p>
          </Modal.Description>
        }

      </Modal.Content>
      <Modal.Actions>
        <Button
          content={isGerman ? 'Das stimmt' : 'Got it'}
          onClick={() => setOpen(false)}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
};

export default ExplanationModal;
