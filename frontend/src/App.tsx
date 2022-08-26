import React, { useState } from 'react';
import { Loader, Grid, Container, SemanticWIDTHS } from 'semantic-ui-react';

import { callDalleBackend } from "./utils/backendApi";
import ImageObject from "./components/ImageObject";
import TextPrompt from "./components/TextPrompt";


const App = () => {
  const [promptText, setPromptText] = useState('');
  const [isFetchingImgs, setIsFetchingImgs] = useState(false);

  const [generatedImages, setGeneratedImages] = useState([]);
  const [generatedImagesCount, setGeneratedImagesCount] = useState(0);
  const [generatedImagesFormat, setGeneratedImagesFormat] = useState('jpeg');

  const [apiError, setApiError] = useState('')
  const [queryTime, setQueryTime] = useState(0);

  const enterPressedCallback = (promptText: string) => {
    console.log('API call to DALL-E backend with the following prompt [' + promptText + ']');
    setApiError('')
    setQueryTime(0)
    setIsFetchingImgs(true)
    callDalleBackend(promptText).then((response: any) => {
      setQueryTime(response['executionTime'])
      setGeneratedImages(response['serverResponse']['generatedImgs'])
      setGeneratedImagesCount(response['serverResponse']['generatedImgsCount'])
      setGeneratedImagesFormat(response['serverResponse']['generatedImgsFormat'])
      setIsFetchingImgs(false)

    }).catch((error: any) => {
      console.log('Error querying DALL-E backend.', error)
      if (error.message === 'Timeout') {
        setApiError('Timeout querying DALL-E backend (>1min). Consider reducing the images per query or use a stronger backend.')
      } else {
        setApiError('Error querying DALL-E backend. Check your backend server logs.')
      }
      setIsFetchingImgs(false)
    })
  }

  const nrImageColumns = () => {
    if (generatedImagesCount == null) {
      return 0;
    }
    else if (generatedImagesCount < 4) {
      return generatedImagesCount;
    }
    else {
      return Math.floor(Math.sqrt(generatedImagesCount));
    }
  }

  return (
    <Container style={{ padding: "2em" }}>
      <div >
        <TextPrompt enterPressedCallback={enterPressedCallback} promptText={promptText} setPromptText={setPromptText} disabled={isFetchingImgs} />

      </div>
      <div>
        {apiError ?
          <h5>{apiError}</h5>
          : isFetchingImgs ?
            <Loader size='huge' indeterminate active={isFetchingImgs}>Doing fancy calculations ✨</Loader>
            : generatedImages.length > 0 ?
              <Grid container centered columns={nrImageColumns() as SemanticWIDTHS}>
                {generatedImages.map((generatedImg, idx) => {
                  return (
                    <Grid.Column key={idx} style={{padding: "2vh 1vh 0 1vh"}}>
                      <ImageObject
                        imgData={generatedImg}
                        generatedImagesFormat={generatedImagesFormat}
                        promptText={promptText}
                        index={++idx}
                        maxHeight={75 / (generatedImagesCount / nrImageColumns())} />
                    </Grid.Column>
                  )
                })}
              </Grid>
              : <></>
        }
      </div>
      {queryTime !== 0 &&
        <Container style={{ color: "grey", textAlign: "right", marginTop: "1em" }}>
          {"(last execution time: " + queryTime + " sec)"}
        </Container>}
    </Container>
  )
}

export default App;
