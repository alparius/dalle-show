import React, { useState } from 'react';
import Start from "./Start";
import Content from "./Content";
import Finish from "./Finish";

export enum Page {
    Start,
    Content,
    Finish,
};

const App = () => {
    const  [currentPage, setCurrentPage] = useState(Page.Start)

    const finishPlaying = () => {
        setCurrentPage(Page.Finish)
    }

    if (currentPage == Page.Start) {
        console.log('Start page')
        return <Start setCurrentPage={setCurrentPage}/>
    }
    else if (currentPage == Page.Content) {
        console.log('Content page')
        return <Content finishPlaying={finishPlaying}/>
    }
    else  {
        console.log('Finish page')
        return <Finish setCurrentPage={setCurrentPage}/>
    }
}

export default App;
