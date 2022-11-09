import { Button, Container, Image } from "semantic-ui-react";

import start_image from "../static/finish.jpg"
import { Page } from "../App";


type Props = {
    setCurrentPage: any,
};

const Finish = ({ setCurrentPage }: Props) => {

    const continueButtonPressed = () => {
        setCurrentPage(Page.Content);
    }

    const backButtonPressed = () => {
        setCurrentPage(Page.Start);
    }

    return (
        <Container>
            <Image src={start_image} size={"huge"} className={"centered"} />
            <Button size={"massive"} color={"red"} onClick={continueButtonPressed}>Continue</Button>
            <Button floated={"right"} color={"green"} size={"massive"} onClick={backButtonPressed}>Let others play!</Button>
        </Container>
    )
}

export default Finish;
