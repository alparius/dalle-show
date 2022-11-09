import React, { useState } from 'react';

import Sidebar from "./components/Sidebar";
import Start from "./components/Start";
import Content from "./components/Content";
import Finish from "./components/Finish";


export enum Page {
  Start,
  Content,
  Finish,
};

export const IsGermanContext = React.createContext(true);

const App = () => {
  const [currentPage, setCurrentPage] = useState(Page.Start);
  const [isGerman, setIsGerman] = useState(true);

  const finishPlaying = () => {
    setCurrentPage(Page.Finish)
  }

  return (
    <IsGermanContext.Provider value={isGerman}>
      <div style={{width: '1386px', left: '0px', position: 'fixed'}}>
            {currentPage === Page.Start &&
              <Start setCurrentPage={setCurrentPage} />
            }
            {currentPage === Page.Content &&
              <Content finishPlaying={finishPlaying} />
            }
            {currentPage === Page.Finish &&
              <Finish setCurrentPage={setCurrentPage} />
            }
         </div>
         <div style={{width: '160px', right: '0px', position: 'fixed'}}>
            <Sidebar setCurrentPage={setCurrentPage} setIsGerman={setIsGerman} />
            </div>
    </IsGermanContext.Provider>
  )


}

export default App;
