import React, { useEffect, LegacyRef, useRef } from 'react';
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
    useEffect(() => {
        if (disabled === false)
            inputRef.current!.focus();
    }, [disabled]);
    const refocusToInput = () => {
        inputRef.current!.focus();
    };

    const greyText = enoughPlaying
        ? isGerman
            ? 'drücke die Taste unten, um fortzufahren'
            : 'hit the button below to continue'
        : isGerman
        ? 'drücke die Eingabetaste, um Bilder zu erzeugen'
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
                    placeholder={isGerman ? 'tippe etwas ungewöhnliches ein' : 'type in something unusual'}
                    value={promptText}
                    ref={inputRef as unknown as LegacyRef<Input>}
                    onBlur={refocusToInput}
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
