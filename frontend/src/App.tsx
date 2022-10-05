import React, { useState } from 'react';
import { Loader, Grid, Container, SemanticWIDTHS } from 'semantic-ui-react';

import ImageObject from "./components/ImageObject";
import TextPrompt from "./components/TextPrompt";


const App = () => {
  const [promptText, setPromptText] = useState('');
  const [disableInput, setDisableInput] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const [generatedImages, setGeneratedImages] = useState([]);
  const [generatedImagesCount, setGeneratedImagesCount] = useState(0);
  const [generatedImagesFormat, setGeneratedImagesFormat] = useState('jpeg');

  const [apiError, setApiError] = useState('');
  const [queryTime, setQueryTime] = useState(0);

  const enterPressedCallback = (promptText: string) => {
    console.log('API call to DALL-E backend with the following prompt [' + promptText + ']');
    setApiError('');
    setDisableInput(true);
    setShowLoader(true);
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
      </Container>

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
                        maxHeight={75 / (generatedImagesCount / nrImageColumns())}
                      />
                    </Grid.Column>
                  )
                })}
              </Grid>

              {queryTime !== 0 &&
                <div style={{ color: "grey", textAlign: "right", marginTop: "1.5em" }}>
                  {"(last execution time: " + queryTime + " sec)"}
                </div>
              }
            </Container>

            : <></>
      }
    </>
  )
}

export default App;
