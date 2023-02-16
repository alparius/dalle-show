import React, { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { Grid, Container, List, Icon, SemanticWIDTHS, Image, Header, Button } from 'semantic-ui-react';

import { IsGermanContext, Page } from '../App';
import ImageObject from './ImageObject';
import TextPrompt from './TextPrompt';
import hint_image from '../static/hint_empty.jpg';
import profane_image from '../static/profane.jpg'
import loaderImage from '../static/loading_robot.gif'

const NUMBER_OF_PLAYS_ALLOWED = 2; // actually + 1
const INACTIVITY_SECONDS = 150;

type Props = {
    setCurrentPage: any;
    setIsGenerating: any;
};

const Content = ({ setCurrentPage, setIsGenerating }: Props) => {
    const isGerman = useContext(IsGermanContext);

    const [promptText, setPromptText] = useState('');
    const [disableInput, setDisableInput] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [generatedOnce, setGeneratedOnce] = useState(false);

    const [generatedImages, setGeneratedImages] = useState([]);
    const [generatedImagesCount, setGeneratedImagesCount] = useState(0);
    const [generatedImagesFormat, setGeneratedImagesFormat] = useState('jpeg');

    const [promptEnglish, setPromptEnglish] = useState('');
    const [promptLanguage, setPromptLanguage] = useState('');
    const [promptProfane, setPromptProfane] = useState('');

    const [apiError, setApiError] = useState('');
    const [queryTime, setQueryTime] = useState(0);
    const [numberOfPlays, setNumberOfPlays] = useState(0);
    const enoughPlaying = useRef(false);

    // logic for resetting the display on inactivity
    const [inactivityTime, setInactivityTime] = useState(0);
    useEffect(() => {
        const inactivityInterval = setInterval(() => {
            setInactivityTime(prevTime => prevTime + 1);
        }, 1000);
        const resetInactivityTimer = () => {
            setInactivityTime(0);
        };
        document.addEventListener('click', resetInactivityTimer);
        document.addEventListener('keypress', resetInactivityTimer);
        return () => {
            clearInterval(inactivityInterval);
            document.removeEventListener('click', resetInactivityTimer);
            document.removeEventListener('keypress', resetInactivityTimer);
        };
    }, []);
    useEffect(() => {
        if (inactivityTime >= INACTIVITY_SECONDS) {
            setCurrentPage(Page.Start);
        }
    }, [inactivityTime, setCurrentPage]);

    const goEnd = () => {
        setCurrentPage(Page.Finish);
    };

    // the input field shall never lose focus
    const inputRef = useRef<HTMLInputElement>(null);
    const refocusToInput = () => {
        inputRef.current!.focus();
    };

    // logic for handling alternating fake loading texts
    const [loadingTextIndex, setLoadingTextIndex] = useState(0);
    const loadingTextsLenght = 5;
    const shuffle = useCallback(() => {
        setLoadingTextIndex((prevIndex) => {
            if (prevIndex === loadingTextsLenght - 1) {
                return 4;
            }
            return prevIndex + 1;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        const intervalID = setInterval(shuffle, 1500);
        return () => clearInterval(intervalID);
    }, [shuffle, loadingTextIndex]);

    const checkIfEnoughPlaying = () => {
        console.log('Number of plays is:', numberOfPlays);
        if (numberOfPlays >= NUMBER_OF_PLAYS_ALLOWED) {
            console.log('Enough playing');
            enoughPlaying.current = true;
        }
    };

    const enterPressedCallback = (promptText: string) => {
        console.log('API call to DALL-E backend with the following prompt [' + promptText + ']');
        setApiError('');
        setDisableInput(true);
        setLoadingTextIndex(0);
        setShowLoader(true);
        setIsGenerating(true);
        setGeneratedOnce(true);
        const queryStartTime = new Date().getTime();

        var xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:8000/dalle?prompt=${promptText}`);
        var seenBytes = 0;

        xhr.onreadystatechange = function () {
            //console.log('state change.. state: ' + xhr.readyState);

            if (xhr.readyState === 3 || xhr.readyState === 4) {
                var newChunk = xhr.response.substr(seenBytes);
                if (seenBytes - xhr.responseText.length !== 0) {
                    var newData = JSON.parse(newChunk as string);
                    seenBytes = xhr.responseText.length;

                    setGeneratedImages(newData['generatedImgs']);
                    setGeneratedImagesCount(newData['generatedImgsCount']);
                    setGeneratedImagesFormat(newData['generatedImgsFormat']);
                    setPromptEnglish(newData['promptEnglish']);
                    setPromptLanguage(newData['promptLanguage']);

                    setPromptProfane(newData['promptProfane']);
                    if (xhr.readyState === 4) {
                        if (newData['promptProfane'] === false) {
                            setNumberOfPlays(numberOfPlays + 1);
                        }
                        checkIfEnoughPlaying();
                    }
                }
                setShowLoader(false);
                setQueryTime(Math.round(((new Date().getTime() - queryStartTime) / 1000 + Number.EPSILON) * 100) / 100);
            }

            if (xhr.readyState === 4) {
                setIsGenerating(false);
            }

            if ((xhr.readyState === 4) && (! enoughPlaying.current)) {
                setDisableInput(false);
                refocusToInput();
            }
        };

        xhr.send();
    };
    // }).catch((error: any) => {
    //   console.log('Error querying DALL-E backend.', error)
    //   if (error.message === 'Timeout') {
    //     setApiError('Timeout querying DALL-E backend (>1min). Consider reducing the images per query or use a stronger backend.')
    //   } else {
    //     setApiError('Error querying DALL-E backend. Check your backend server logs.')
    //   }
    //   setIsFetchingImgs(false)
    // })

    const nrImageColumns = () => {
        if (generatedImagesCount == null) {
            return 0;
        } else if (generatedImagesCount < 4) {
            return generatedImagesCount;
        } else {
            return Math.floor(Math.sqrt(generatedImagesCount));
        }
    };

    const hintEn = 'Type in anything you want and the machine will draw it!';
    const hintDe = 'Gib ein, was du möchtest und die Maschine wird es zeichnen!';
    const hintStyle = {
        fontSize: '26px',
        color: 'black',
        textAlign: 'center',
        position: 'absolute',
        top: 190,
        bottom: 0,
        left: 340,
        right: 0,
        height: 'fit-content',
        width: '25%',
        margin: 'auto',
    };

    const profaneEn = 'The model will not draw that, try something nicer.';
    const profaneDe = 'Das Modell wird das nicht zeichnen, versuche es mit etwas Schönerem.'
    const profaneStyle = {
        fontSize: '26px',
        color: 'black',
        textAlign: 'center',
        position: 'absolute',
        top: 0,
        bottom: 50,
        left: isGerman ? -240 : -240,
        right: 0,
        height: 'fit-content',
        width: '25%',
        margin: 'auto',
    };

    return (
        <>
            <Container style={{ padding: '3em', marginTop: "10px" }}>
                <TextPrompt
                    enterPressedCallback={enterPressedCallback}
                    promptText={promptText}
                    setPromptText={setPromptText}
                    disabled={disableInput}
                    isGerman={isGerman}
                    enoughPlaying={enoughPlaying.current}
                    goEnd={goEnd}
                />
                {!showLoader && generatedImages.length > 0 && (
                    <List pointing size='large' style={{ marginTop: '-10px', marginBottom: "-15px", fontSize: '18px' }}>
                        <Icon size='big' name='translate' style={{ marginRight: '15px'}} />
                        {promptLanguage ? 
                            isGerman ? (
                                <>Die Eingabe wurde vom <b>{promptLanguage}</b> ins Englische übersetzt als: <i>"{promptEnglish}"</i>.</>
                            ) : (
                                <>Input was translated from <b>{promptLanguage}</b> to English as: <i>"{promptEnglish}"</i>.</>
                            )
                            : isGerman ? (
                                <>Die Eingabe konnte nicht übersetzt werden.</>
                            ) : (
                                <>Input could not be translated.</>
                            )
                        }
                    </List>
                )}
            </Container>

            {!generatedOnce && (
                <Container style={{ padding: '2em' }}>
                    <Image src={hint_image} size='big' floated='right' />
                    <Header style={hintStyle}> {isGerman ? hintDe : hintEn}</Header>
                </Container>
            )}

            {apiError ? (
                <h5>{apiError}</h5>
            ) : showLoader ? (
                <Container textAlign='center' style={{ minWidth: '85vw', paddingLeft: "200px", paddingTop: '150px'}}>
                    <Grid centered columns={2}>
                    <Grid.Column className='ui' width={4}>
                        <Image src={loaderImage} size='medium'></Image>
                        {/* <Loader size='huge' indeterminate active={showLoader} style={{ top: '40vh' }}>
                            {isGerman ? loadingTextsDe[loadingTextIndex] : loadingTextsEn[loadingTextIndex]}
                        </Loader> */}
                    </Grid.Column>
                    <Grid.Column className='ui' verticalAlign="middle" width={12}>
                        <Header style={{textAlign: "left", fontSize: "28px"}}>{isGerman ? 'Bitte warten...' : 'Please wait...' }</Header>
                        <List ordered relaxed style={{textAlign: "left", fontSize: "24px", paddingLeft: '20px'}}>
                            <List.Item style={{fontWeight: loadingTextIndex === 0 ? 'bold': 'normal'}}>{isGerman ? 'Übersetzung ins Englische' : 'Translating text to English' }</List.Item>
                            <List.Item style={{fontWeight: loadingTextIndex === 1 ? 'bold': 'normal'}}>{isGerman ? 'Prüfung auf unsichere Inhalte' : 'Checking for unsafe content' }</List.Item>
                            <List.Item style={{fontWeight: loadingTextIndex === 2 ? 'bold': 'normal'}}>{isGerman ? 'Generierung des Zufallsrauschens' : 'Generating random noise' }</List.Item>
                            <List.Item style={{fontWeight: loadingTextIndex === 3 ? 'bold': 'normal'}}>{isGerman ? 'Kombinieren des eingegebenen Textes mit dem Zufallsrauschen' : 'Combining the input text with the random noise' }</List.Item>
                            <List.Item style={{fontWeight: loadingTextIndex === 4 ? 'bold': 'normal'}}>{isGerman ? 'Entrauschen des Bildes schrittweise' : 'Denoising image step-by-step' }</List.Item>
                            <List.Item style={{fontWeight: 'normal'}}>{isGerman ? 'Schärfen des fertigen Bildes' : 'Sharpening final image' }</List.Item>
                        </List>
                    </Grid.Column>
                    </Grid>
                </Container>
            ) : generatedImages.length > 0 ? (
                <Container textAlign='center' style={{ minWidth: '85vw', paddingLeft: "20px"}}>
                    <Grid centered columns={nrImageColumns() as SemanticWIDTHS}>
                        {generatedImages.map((generatedImg, idx) => {
                            return (
                                <Grid.Column className='ui' key={idx} /*style={{ padding: "2vh 1vh 0 1vh" }}*/>
                                    <ImageObject
                                        imgData={generatedImg}
                                        generatedImagesFormat={generatedImagesFormat}
                                        promptText={promptText}
                                        index={++idx}
                                        maxHeight={85 / (generatedImagesCount / nrImageColumns())}
                                    />
                                </Grid.Column>
                            );
                        })}
                    </Grid>

                    {queryTime !== 0 && (
                        <div style={{ color: 'grey', textAlign: 'right', marginTop: '1em' }}>
                            {isGerman ? (
                                <>{'(letzte Ausführungszeit: ' + queryTime + ' Sek)'}</>
                            ) : (
                                <>{'(last execution time: ' + queryTime + ' sec)'}</>
                            )}
                        </div>
                    )}

                    {enoughPlaying.current && (
                        <Button size='massive' onClick={goEnd}
                            style={{width:'210px', marginTop: '-1em', position: 'absolute', top: '1000px', backgroundColor: "#2F009D", color: "white", left: '790px', height: '80px'}}
                        >
                        {isGerman ? 'Fortfahren' : 'Continue'}
                        </Button>
                    )}
                </Container>
            ) : (
                <Container>
                    {promptProfane && (
                        <Container style={{ padding: '2em' }}>
                        <Image src={profane_image} size='huge' floated='left' />
                        <Header style={profaneStyle}> {isGerman ? profaneDe : profaneEn} </Header>
                        </Container>
                    )}
                    {enoughPlaying.current && (
                        <Button size='massive' onClick={goEnd}
                            style={{ marginTop: '-1em', position: 'absolute', top: '1000px', backgroundColor: "#2F009D", color: "white", left: isGerman ? '800px' : '810px', height: '80px'}}
                        >
                        {isGerman ? 'Fortfahren' : 'Continue'}
                        </Button>
                    )}
                </Container>
            )}
        </>
    );
};

export default Content;
