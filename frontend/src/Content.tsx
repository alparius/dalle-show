import React, { useState } from 'react';
import {Loader, Grid, Container, List, Icon, SemanticWIDTHS, Image} from 'semantic-ui-react';

import ImageObject from "./components/ImageObject";
import TextPrompt from "./components/TextPrompt";
import ExplanationModal from "./components/ExplanationModal";
import start_image from "./hint.jpg";

const NUMBER_OF_PLAYS_ALLOWED = 3;

type Props = {
  finishPlaying: any,
};

const Content = ({finishPlaying}: Props) => {
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

  const checkIfEnoughPlaying = () => {
    console.log("Number of plays is:", numberOfPlays)
    if (numberOfPlays >= NUMBER_OF_PLAYS_ALLOWED) {
      console.log("enough")
      finishPlaying();
    }
  }

  const enterPressedCallback = (promptText: string) => {
    setNumberOfPlays(numberOfPlays + 1)
    checkIfEnoughPlaying()

    console.log('API call to DALL-E backend with the following prompt [' + promptText + ']');
    setApiError('');
    setDisableInput(true);
    setShowLoader(true);
    setGeneratedOnce(true);
    const queryStartTime = new Date().getTime();

    var xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:8000/dalle?prompt=${promptText}`);
    var seenBytes = 0;

    xhr.onreadystatechange = function () {
      //console.log("state change.. state: " + xhr.readyState);

      if (xhr.readyState === 3 || xhr.readyState === 4) {
        var newChunk = xhr.response.substr(seenBytes);
        var newData = JSON.parse(newChunk as string);
        seenBytes = xhr.responseText.length;

        setGeneratedImages(newData['generatedImgs']);
        setGeneratedImagesCount(newData['generatedImgsCount']);
        setGeneratedImagesFormat(newData['generatedImgsFormat']);
        setPromptEnglish(newData['promptEnglish']);
        setPromptLanguage(newData['promptLanguage']);
        setPromptProfane(newData['promptProfane']);
        setShowLoader(false);
        setQueryTime(Math.round(((new Date().getTime() - queryStartTime) / 1000 + Number.EPSILON) * 100) / 100);
      }

      if (xhr.readyState === 4) {
        setDisableInput(false);
      }
    };

    xhr.send();
  }
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
  }

  return (
    <>
      <Container style={{ padding: "2em" }}>
        <TextPrompt
          enterPressedCallback={enterPressedCallback}
          promptText={promptText}
          setPromptText={setPromptText}
          disabled={disableInput}
        />
        {!showLoader &&
          <List pointing size='large' style={{marginTop: "-10px"}}>
            <Icon size="big" name='translate' /> Prompt was translated from <b>{promptLanguage}</b> to English as: <i>"{promptEnglish}"</i>.
          </List>
        }
      </Container>

      {!generatedOnce &&
        <Container style={{padding: "2em"}}>
          <Image src={start_image} size={"big"} floated={"right"}/>
        </Container>
      }


      {apiError ?
        <h5>{apiError}</h5>

        : showLoader ?
          <Loader size='huge' indeterminate active={showLoader}>Doing fancy calculations ✨</Loader>

          : generatedImages.length > 0 ?
            <Container textAlign="center" style={{ minWidth: "85vw" }}>
              <Grid centered columns={nrImageColumns() as SemanticWIDTHS} >
                {generatedImages.map((generatedImg, idx) => {
                  return (
                    <Grid.Column className="ui" key={idx} /*style={{ padding: "2vh 1vh 0 1vh" }}*/>
                      <ImageObject
                        imgData={generatedImg}
                        generatedImagesFormat={generatedImagesFormat}
                        promptText={promptText}
                        index={++idx}
                        maxHeight={65 / (generatedImagesCount / nrImageColumns())}
                      />
                    </Grid.Column>
                  )
                })}
              </Grid>

              {queryTime !== 0 &&
                <div style={{ color: "grey", textAlign: "right", marginTop: "1em" }}>
                  {"(last execution time: " + queryTime + " sec)"}
                </div>
              }

              <ExplanationModal/>

            </Container>

            : <></>
      }
    </>
  )
}

export default Content;
