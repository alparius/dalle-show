import React, { useState } from 'react';
import { Loader, Grid, Container } from 'semantic-ui-react';

import { callDalleBackend } from "./utils/backendApi";
import ImageObject from "./components/ImageObject";
import TextPrompt from "./components/TextPrompt";


const App = () => {
  const [promptText, setPromptText] = useState('');
  const [isFetchingImgs, setIsFetchingImgs] = useState(false);

  const [generatedImages, setGeneratedImages] = useState([]);
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

  return (
    <Container style={{ padding: "2em" }}>
      <div >
        <TextPrompt enterPressedCallback={enterPressedCallback} promptText={promptText} setPromptText={setPromptText} disabled={isFetchingImgs} />

      </div>
      <div style={{ maxWidth: "84vh" }}>
        {apiError ?
          <h5>{apiError}</h5>
          : isFetchingImgs ?
            <Loader size='huge' indeterminate active={isFetchingImgs}>Doing fancy calculations ✨</Loader>
            : generatedImages.length > 0 ?
              <Grid container centered columns={3}>
                {generatedImages.map((generatedImg, idx) => {
                  return (
                    <Grid.Column key={idx} style={{ maxHeight: "27vh" }}>
                      <ImageObject imgData={generatedImg} generatedImagesFormat={generatedImagesFormat} promptText={promptText} index={++idx} />
                    </Grid.Column>
                  )
                })}
              </Grid>
              : <></>
        }
      </div>
      {queryTime !== 0 &&
        <Container style={{ color: "grey", textAlign: "right", marginTop: "1em"}}>
          {"(last execution time: " + queryTime + " sec)"}
        </Container>}
    </Container>
  )
}

export default App;
