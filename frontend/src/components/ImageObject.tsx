import React from 'react';
import { Image } from 'semantic-ui-react';

type Props = {
    imgData: any,
    generatedImagesFormat: string,
    promptText: string,
    maxHeight: number,
    index: number
};

const ImageObject = ({ imgData, generatedImagesFormat, promptText, maxHeight, index }: Props) => {
    const imgSrc = `data:image/${generatedImagesFormat};base64,${imgData}`
    const alt = `${promptText} ${index}`
    //const title = "Download image"
    //const downloadedFilename = `${promptText}_${index}.${generatedImagesFormat}`

    return (
        //<a href={imgSrc} title={title} download={downloadedFilename}>
        <Image src={imgSrc} alt={alt} style={{ maxHeight: `${maxHeight}vh`}} />
        //</a>
    )
}

export default ImageObject;
