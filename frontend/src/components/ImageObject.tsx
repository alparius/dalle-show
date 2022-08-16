import React from 'react';


type Props = {
    imgData: any,
    generatedImagesFormat: string,
    promptText: string,
    index: number
};

const ImageObject = ({ imgData, generatedImagesFormat, promptText, index }: Props) => {
    const imgSrc = `data:image/${generatedImagesFormat};base64,${imgData}`
    const alt = `${promptText} ${index}`
    //const title = "Download image"
    //const downloadedFilename = `${promptText}_${index}.${generatedImagesFormat}`

    return (
        //<a href={imgSrc} title={title} download={downloadedFilename}>
        <img src={imgSrc} alt={alt} style={{ width: "25vh" }} /*title={title}*/ />
        //</a>
    )
}

export default ImageObject;
