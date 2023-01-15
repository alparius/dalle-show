import React, { useState, useEffect, LegacyRef, useRef } from 'react';
import { Form, Input } from 'semantic-ui-react';

type Props = {
    enterPressedCallback: any;
    disabled: boolean;
    promptText: string;
    setPromptText: any;
    isGerman: boolean;
    enoughPlaying: boolean;
    goEnd: any;
};

const TextPrompt = ({ enterPressedCallback, disabled, promptText, setPromptText, isGerman, enoughPlaying, goEnd }: Props) => {
    const [isEmpty, setIsEmpty] = useState(false);

    const onTextChanged = (event: any) => {
        setPromptText(event.target.value);
    };

    const handleTextPromptKeyPressed = (event: any) => {
        if (event.key === 'Enter') {
            handleGenerate();
        }
    };

    const handleGenerate = () => {
        if (enoughPlaying) {
            goEnd();
        }
        else {
            if (promptText === '') {
                setIsEmpty(true);
            } else {
                setIsEmpty(false);
                enterPressedCallback(promptText);
            }
        }
    };

    const handleClearField = () => {
        setPromptText('');
    }

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
            ? 'drücke die Taste unten, um fortfahren'
            : 'hit the button below to continue'
        : isGerman
        ? 'drücke die Enter-Taste, um Bilder zu generieren'
        : 'hit Enter to generate images';

    const greyText2 = isGerman
        ? 'oder drücke die Enter-Taste'
        : 'or hit the Enter key';

    return (
        <Form>
            <Form.Group style={{margin: 0}}>
                <Form.Field width={13}>
                    <Input
                        size='big'
                        style={{ place: 'black !important' }}
                        placeholder={isGerman ? 'tippe etwas ungewöhnliches ein' : 'type in something unusual'}
                        value={promptText}
                        ref={inputRef as unknown as LegacyRef<Input>}
                        onBlur={refocusToInput}
                        onChange={onTextChanged}
                        onKeyPress={handleTextPromptKeyPressed}
                        disabled={disabled}
                        error={isEmpty}
                    />
                </Form.Field>
                <Form.Field width={3}>
                    <Form.Button onClick={handleGenerate} disabled={enoughPlaying ? false : disabled || promptText === ""} size="massive" style={{width:'170px', fontSize: 19, backgroundColor: "#2F009D", color: "white"}} >{enoughPlaying ? isGerman ? 'Fortfahren' : 'Continue' : isGerman ? 'Generieren!' : 'Generate!'}</Form.Button>
                    {!enoughPlaying ? <label style={{ textAlign: 'left', color: 'grey' }}>{greyText2}</label> : <label>‎ </label>}
                </Form.Field>
                <Form.Field width={1}>
                    <Form.Button onClick={handleClearField} disabled={disabled} size="big" style={{width:'90px', marginLeft: "-10px", fontSize: 14}} color="grey">{isGerman ? 'Feld löschen' : 'Clear field'}</Form.Button>
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default TextPrompt;
