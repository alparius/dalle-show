import React, { useContext } from 'react';
import { Button, Container, Image } from "semantic-ui-react";

import start_image from "../static/start.jpg"
import { IsGermanContext, Page } from "../App";


type Props = {
    setCurrentPage: any,
};

const Start = ({ setCurrentPage }: Props) => {
    const isGerman = useContext(IsGermanContext);

    const playButtonPressed = () => {
        setCurrentPage(Page.Content)
    }

    return (
        <Container>
            <Image src={start_image} size={"huge"} className={"centered"} />
            <Button floated={"right"} color={"green"} size={"massive"} onClick={playButtonPressed}>
                {isGerman ? 'Spielen!' : 'Play!'}
            </Button>
        </Container>
    )
}

export default Start;
