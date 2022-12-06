import React, { useRef, useEffect, LegacyRef } from 'react';
import { Form, Input } from 'semantic-ui-react';

type Props = {
    enterPressedCallback: any;
    disabled: boolean;
    promptText: string;
    setPromptText: any;
    isGerman: boolean;
    enoughPlaying: boolean;
};

const TextPrompt = ({ enterPressedCallback, disabled, promptText, setPromptText, isGerman, enoughPlaying }: Props) => {
    const onTextChanged = (event: any) => {
        setPromptText(event.target.value);
    };

    const handleTextPromptKeyPressed = (event: any) => {
        if (event.key === 'Enter') {
            enterPressedCallback(promptText);
        }
    };

    // this input field shall never lose focus
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        inputRef.current!.focus();
    }, []);
    const handleOnBlur = () => {
        inputRef.current!.focus();
    };

    const greyText = enoughPlaying
        ? isGerman
            ? 'drücken Sie die grüne Taste, um fortzufahren'
            : 'hit the green button to continue'
        : isGerman
        ? 'drücken Sie die Eingabetaste, um Bilder zu erzeugen'
        : 'hit Enter to generate images';

    return (
        <Form>
            <Form.Field>
                <Input
                    color='green'
                    size='big'
                    inverted
                    fullWidth
                    style={{ place: 'black !important' }}
                    placeholder={isGerman ? 'tippen Sie etwas Ungewöhnliches ein' : 'type in something unusual'}
                    value={promptText}
                    ref={inputRef as unknown as LegacyRef<Input>}
                    onBlur={handleOnBlur}
                    onChange={onTextChanged}
                    onKeyPress={handleTextPromptKeyPressed}
                    disabled={disabled}
                />
                <label style={{ textAlign: 'right', color: 'grey' }}>{greyText}</label>
            </Form.Field>
        </Form>
    );
};

export default TextPrompt;
