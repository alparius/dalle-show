import React from "react";
import { Form, Input } from "semantic-ui-react";


type Props = {
    enterPressedCallback: any,
    disabled: boolean,
    promptText: string,
    setPromptText: any
};

const TextPrompt = ({ enterPressedCallback, disabled, promptText, setPromptText }: Props) => {

    const onTextChanged = (event: any) => {
        setPromptText(event.target.value)
    }

    const handleTextPromptKeyPressed = (event: any) => {
        if (event.key === 'Enter') {
            enterPressedCallback(promptText)
        }
    }

    return (
        <Form>
            <Form.Field>
                <Input color="green" inverted size="big" placeholder="type in something unusual" value={promptText} style={{ place: "black !important" }}
                    onChange={onTextChanged} fullWidth
                    onKeyPress={handleTextPromptKeyPressed} disabled={disabled} />
                <label style={{ textAlign: "right", color: "grey" }}>hit Enter to generate images</label>
            </Form.Field>
        </Form>
    )
}

export default TextPrompt;