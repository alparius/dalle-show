import start_image from "./start.jpg"
import {Page} from "./App";
import {Button, Container, Image} from "semantic-ui-react";



type Props = {
    setCurrentPage: any,
};

const Start = ({setCurrentPage}: Props) => {

    const playButtonPressed = () => {
        setCurrentPage(Page.Content)
    }

    return <Container>
        <Image src={start_image} size={"huge"} className={"centered"}/>
        <Button floated={"right"} color={"green"} size={"massive"} onClick={playButtonPressed}>Play!</Button>
    </Container>
}

export default Start;