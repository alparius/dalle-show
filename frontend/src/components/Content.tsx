import React, { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { Grid, Container, List, Icon, SemanticWIDTHS, Image, Header, Button } from 'semantic-ui-react';

import { IsGermanContext, Page } from '../App';
import ImageObject from './ImageObject';
import TextPrompt from './TextPrompt';
import hint_image from '../static/hint_empty.jpg';
import profane_image from '../static/profane.jpg'
import loaderImage from '../static/loading_robot.gif'

const NUMBER_OF_PLAYS_ALLOWED = 2; // actually + 1
const INACTIVITY_SECONDS = 180;

type Props = {
    setCurrentPage: any;
    setIsGenerating: any;
};

const prompts_en = [
    "expressionist painting of a cyberpunk city and night, with vibrant lights reflecting off the wet pavement",
    "surreal landscape with floating islands under a twilight sky",
    "minimalist line art of a futuristic robot",
    "watercolor painting of a serene mountain lake",
    "digital art of a neon-lit street in a bustling city",
    "vintage sketch of a steampunk airship soaring in the sky",
    "abstract geometric shapes in vibrant colors",
    "impressionist garden with blooming flowers and a small pond",
    "fantasy scene of a dragon flying over a castle",
    "modern illustration of a sleek sports car on an open highway",
    "concept art of an alien planet with unusual flora",
    "detailed drawing of an ancient tree with intricate roots",
    "vibrant mural of a bustling market street",
    "comic style portrait of a heroic character",
    "oil painting of a quiet village at sunrise",
    "sci-fi scene of a futuristic space station orbiting Earth",
    "mystical forest with glowing fireflies at dusk",
    "pop art style depiction of a city skyline",
    "retro pixel art of a classic arcade game",
    "neon cyberpunk portrait of a futuristic woman",
    "vintage postcard illustration of a seaside town",
    "fantasy illustration of a magical library with floating books",
    "modern graphic design of a city map with landmarks",
    "art nouveau poster of a whimsical garden",
    "realistic digital painting of a roaring waterfall",
    "expressionist portrait of a mysterious figure in shadow",
    "fantasy landscape with a crystal cave and luminous gems",
    "stylized vector art of a space explorer",
    "impressionist seascape with crashing waves",
    "minimalist poster of a solitary lighthouse",
    "psychedelic art of swirling cosmic patterns",
    "vintage sketch of a historic train station",
    "watercolor portrait of a calm, smiling elder",
    "futuristic cityscape with towering skyscrapers",
    "abstract expressionist composition in bold colors",
    "concept art of a dreamlike underwater world",
    "digital art of a mystical unicorn in a forest",
    "vibrant street art mural on an urban wall",
    "whimsical drawing of a playful cat in a garden",
    "detailed fantasy art of an enchanted castle",
    "impressionist painting of a quiet rural road",
    "retro futuristic design of a flying car",
    "modern art piece of a solitary figure in a vast landscape",
    "neon sign style illustration of a night diner",
    "minimalist drawing of a serene zen garden",
    "vintage art deco poster of a glamorous city night",
    "digital illustration of a mythical phoenix rising",
    "abstract art of interlocking shapes and lines",
    "fantasy scene of a mermaid by the sea",
    "concept art of a post-apocalyptic urban landscape",
    "realistic painting of a calm forest in autumn",
    "pop art style portrait of a vibrant musician",
    "surreal art of melting clocks in a desert",
    "futuristic city with holographic advertisements",
    "vintage cartoon illustration of a happy family picnic",
    "oil painting of a stormy ocean under dark clouds",
    "minimalist graphic of a lone tree in a field",
    "impressionist scene of a busy café at dusk",
    "fantasy art of a wizard casting a spell",
    "digital portrait of a cybernetic warrior",
    "retro neon style illustration of a roller rink",
    "abstract landscape of vibrant, swirling colors",
    "realistic sketch of a historic castle",
    "modern art of a dynamic, dancing figure",
    "vintage painting of a countryside farmhouse",
    "surreal scene of floating geometric shapes",
    "watercolor landscape of rolling green hills",
    "concept art of a futuristic underwater city",
    "digital illustration of a mythical forest guardian",
    "impressionist portrait of a joyful child",
    "minimalist design of a sunrise over mountains",
    "abstract art of vibrant, intersecting lines",
    "fantasy illustration of a luminous, celestial city",
    "vintage engraving of a historic marketplace",
    "modern digital art of a sleek, futuristic building",
    "oil painting of a serene, misty morning",
    "surreal drawing of a giant floating balloon",
    "impressionist depiction of a calm riverside scene",
    "futuristic concept art of a high-tech metropolis",
    "abstract digital art of a chaotic, colorful swirl",
    "vintage style portrait of an elegant lady",
    "digital illustration of a cybernetic landscape",
    "modern graphic design of abstract architectural shapes",
    "oil painting of a peaceful countryside sunset",
    "fantasy art of a brave knight on a quest",
    "impressionist painting of a vibrant flower field",
    "minimalist digital art of a calm lake at dawn",
    "vintage poster of an old-fashioned carnival",
    "surreal scene of an endless staircase in a void",
    "digital illustration of a futuristic battle scene",
    "modern abstract painting of intersecting waves",
    "concept art of an enchanted forest with magical lights",
    "realistic digital portrait of an adventurous explorer",
    "minimalist sketch of a lone sailboat on the sea",
    "vintage style illustration of a quaint European town",
    "impressionist drawing of a lively street festival",
    "futuristic art of a neon city skyline at night",
    "abstract composition of fluid, merging shapes",
    "digital painting of a quiet, snowy village",
    "concept art of a surreal, dreamlike landscape"
  ];
  
  const prompts_de = [
    "expressionistisches Gemälde einer Cyberpunk-Stadt bei Nacht, mit reflektierenden Lichtern",
    "surreale Landschaft mit schwebenden Inseln unter einem dämmernden Himmel",
    "minimalistische Strichzeichnung eines futuristischen Roboters",
    "Aquarellmalerei eines ruhigen Bergsees",
    "digitale Kunst einer neonbeleuchteten Straße in einer geschäftigen Stadt",
    "Vintage-Skizze eines Steampunk-Luftschiffs, das am Himmel schwebt",
    "abstrakte geometrische Formen in lebendigen Farben",
    "impressionistischer Garten mit blühenden Blumen und einem kleinen Teich",
    "Fantasieszene eines Drachen, der über ein Schloss fliegt",
    "moderne Illustration eines eleganten Sportwagens auf einer offenen Autobahn",
    "Konzeptkunst eines außerirdischen Planeten mit ungewöhnlicher Flora",
    "detaillierte Zeichnung eines uralten Baumes mit verzweigten Wurzeln",
    "lebendige Wandmalerei einer geschäftigen Marktstraße",
    "Comic-Stil-Porträt eines heldenhaften Charakters",
    "Ölgemälde eines ruhigen Dorfes bei Sonnenaufgang",
    "Sci-Fi-Szene einer futuristischen Raumstation, die die Erde umkreist",
    "mystischer Wald mit leuchtenden Glühwürmchen in der Dämmerung",
    "Pop-Art-Stil-Darstellung einer Stadtsilhouette",
    "Retro-Pixelkunst eines klassischen Arcade-Spiels",
    "neonfarbenes Cyberpunk-Porträt einer futuristischen Frau",
    "Vintage-Postkarten-Illustration einer Küstenstadt",
    "Fantasie-Illustration einer magischen Bibliothek mit schwebenden Büchern",
    "modernes Grafikdesign einer Stadtkarte mit Wahrzeichen",
    "Jugendstil-Poster eines märchenhaften Gartens",
    "realistische digitale Malerei eines tosenden Wasserfalls",
    "expressionistisches Porträt einer mysteriösen Gestalt im Schatten",
    "Fantasielandschaft mit einer Kristallhöhle und leuchtenden Edelsteinen",
    "stilisierte Vektor-Kunst eines Weltraumforschers",
    "impressionistische Meereslandschaft mit brechenden Wellen",
    "minimalistisches Poster eines einsamen Leuchtturms",
    "psychedelische Kunst wirbelnder kosmischer Muster",
    "Vintage-Skizze eines historischen Bahnhofs",
    "Aquarellporträt eines ruhigen, lächelnden Alten",
    "futuristische Stadtsilhouette mit hoch aufragenden Wolkenkratzern",
    "abstrakte expressionistische Komposition in kräftigen Farben",
    "Konzeptkunst einer traumhaften Unterwasserwelt",
    "digitale Kunst eines mystischen Einhorns im Wald",
    "lebendige Street-Art-Wandmalerei an einer urbanen Wand",
    "verspielte Zeichnung einer schelmischen Katze im Garten",
    "detaillierte Fantasy-Kunst eines verzauberten Schlosses",
    "impressionistisches Gemälde einer ruhigen Landstraße",
    "retro-futuristisches Design eines fliegenden Autos",
    "modernes Kunstwerk einer einsamen Figur in einer weiten Landschaft",
    "Neon-Schilder-Stil-Illustration eines Nachtdiners",
    "minimalistische Zeichnung eines ruhigen Zen-Gartens",
    "Vintage Art Deco Poster einer glamourösen Nacht in der Stadt",
    "digitale Illustration eines mythischen Phönix, der emporsteigt",
    "abstrakte Kunst ineinandergreifender Formen und Linien",
    "Fantasieszene einer Meerjungfrau am Meer",
    "Konzeptkunst einer postapokalyptischen Stadtszenerie",
    "realistisches Gemälde eines ruhigen Waldes im Herbst",
    "Pop-Art-Stil-Porträt eines lebendigen Musikers",
    "surreale Kunst schmelzender Uhren in einer Wüste",
    "futuristische Stadt mit holographischen Werbungen",
    "Vintage-Cartoon-Illustration eines fröhlichen Familienpicknicks",
    "Ölgemälde eines stürmischen Ozeans unter dunklen Wolken",
    "minimalistische Grafik eines einsamen Baumes auf einem Feld",
    "impressionistische Szene eines geschäftigen Cafés in der Dämmerung",
    "Fantasy-Kunst eines Zauberers, der einen Zauber wirkt",
    "digitales Porträt eines kybernetischen Kriegers",
    "Retro-Neon-Stil-Illustration einer Rollschuhbahn",
    "abstrakte Landschaft mit lebhaften, wirbelnden Farben",
    "realistische Skizze eines historischen Schlosses",
    "moderne Kunst einer dynamischen, tanzenden Figur",
    "Vintage-Gemälde eines ländlichen Bauernhauses",
    "surreale Szene schwebender geometrischer Formen",
    "Aquarelllandschaft von sanft geschwungenen grünen Hügeln",
    "Konzeptkunst einer futuristischen Unterwasserstadt",
    "digitale Illustration eines mythischen Waldwächters",
    "impressionistisches Porträt eines fröhlichen Kindes",
    "minimalistisches Design eines Sonnenaufgangs über Bergen",
    "abstrakte Kunst lebendiger, sich kreuzender Linien",
    "Fantasy-Illustration einer leuchtenden, himmlischen Stadt",
    "Vintage-Gravur eines historischen Marktplatzes",
    "moderne digitale Kunst eines eleganten, futuristischen Gebäudes",
    "Ölgemälde eines ruhigen, nebligen Morgens",
    "surreale Zeichnung eines riesigen schwebenden Ballons",
    "impressionistische Darstellung einer ruhigen Flusslandschaft",
    "futuristische Konzeptkunst einer High-Tech-Metropole",
    "abstrakte digitale Kunst eines chaotischen, farbenfrohen Strudels",
    "Porträt im Vintage-Stil einer eleganten Dame",
    "digitale Illustration einer kybernetischen Landschaft",
    "modernes Grafikdesign abstrakter architektonischer Formen",
    "Ölgemälde eines friedlichen Sonnenuntergangs auf dem Land",
    "Fantasy-Kunst eines mutigen Ritters auf einer Quest",
    "impressionistisches Gemälde eines lebhaften Blumenfelds",
    "minimalistische digitale Kunst eines ruhigen Sees bei Morgengrauen",
    "Vintage-Poster eines altmodischen Jahrmarkts",
    "surreale Szene einer endlosen Treppe in einer Leere",
    "digitale Illustration einer futuristischen Kampfszene",
    "moderne abstrakte Malerei sich kreuzender Wellen",
    "Konzeptkunst eines verzauberten Waldes mit magischen Lichtern",
    "realistisches digitales Porträt eines abenteuerlustigen Entdeckers",
    "minimalistische Skizze eines einsamen Segelbootes auf dem Meer",
    "Illustration im Vintage-Stil einer malerischen europäischen Stadt",
    "impressionistische Zeichnung eines lebhaften Straßenfestes",
    "futuristische Kunst einer neonbeleuchteten Stadtsilhouette bei Nacht",
    "abstrakte Komposition fließender, verschmelzender Formen",
    "digitale Malerei eines ruhigen, verschneiten Dorfes",
    "Konzeptkunst einer surrealen, traumähnlichen Landschaft"
  ];
  

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

    // Add state for random prompts
    const [randomPrompts, setRandomPrompts] = useState<string[]>([]);
    useEffect(() => {
        if (!generatedOnce) {
            const promptsList = isGerman ? prompts_de : prompts_en;
            const shuffled = [...promptsList].sort(() => Math.random() - 0.5);
            setRandomPrompts(shuffled.slice(0, 3));
        }
    }, [generatedOnce, isGerman]);

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

    const hintEn = 'Type in anything you want or choose one of the 3 examples, and the machine will draw it!';
    const hintDe = 'Gib ein, was du möchtest oder wähle eines der 3 Beispiele, und die Maschine wird es zeichnen!';
    const hintStyle = {
        fontSize: '26px',
        color: 'black',
        textAlign: 'center',
        position: 'absolute',
        top: 377,
        bottom: 0,
        left: 100,
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
                    <div style={{ marginTop: '-30px', textAlign: 'left' }}>
                        {randomPrompts.map((prompt, index) => (
                            <div key={index}>
                                <Button
                                    onClick={() => {
                                        setPromptText(prompt);
                                        enterPressedCallback(prompt);
                                    }}
                                    style={{ margin: '0.5em', marginLeft: '50px', fontSize: '18px' }}
                                >
                                    <Icon name="play" color="green" />
                                    <i>"{prompt}"</i>
                                </Button>
                                <br />
                            </div>
                        ))}
                    </div>
                    <Image src={hint_image} size='huge' floated="right" />
                    <Header style={hintStyle}>{isGerman ? hintDe : hintEn}</Header>
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
