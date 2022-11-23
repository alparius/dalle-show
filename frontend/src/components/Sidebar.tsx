import React, { useContext } from 'react';
import { Button, Container, Icon, Image } from 'semantic-ui-react';

import { Page } from '../App';
import { IsGermanContext } from '../App';
import ExplanationModal from './ExplanationModal';
import TipsModal from './TipsModal';
import flagDE from '../static/flag_de.svg';
import flagUK from '../static/flag_uk.svg';

type Props = {
    setCurrentPage: any;
    setIsGerman: any;
};

const Sidebar = ({ setCurrentPage, setIsGerman }: Props) => {
    const isGerman = useContext(IsGermanContext);
    const handleLanguageChange = () => {
        setIsGerman(!isGerman);
    };

    const handleRestartButton = () => {
        setCurrentPage(Page.Start);
    };

    return (
        <Container textAlign='center' style={{ width: '120px' }}>
            <br />
            <Button onClick={handleLanguageChange} fluid basic style={{ borderStyle: 'ridge' }}>
                <Container>
                    {isGerman ? (
                        <>
                            <Image src={flagUK} />
                            <p style={{ marginTop: '0.5em', fontSize: '16px' }}>English</p>
                        </>
                    ) : (
                        <>
                            <Image src={flagDE} />
                            <p style={{ marginTop: '0.5em', fontSize: '16px' }}>Deutsch</p>
                        </>
                    )}
                </Container>
            </Button>

            <br />
            <br />
            <br />

            <Button onClick={handleRestartButton} fluid basic style={{ borderStyle: 'ridge' }}>
                <Container>
                    <Icon name='repeat' size='big' />
                    <p style={{ marginTop: '0.5em', fontSize: '16px' }}>{isGerman ? 'Neustart' : 'Restart'}</p>
                </Container>
            </Button>

            <br />
            <TipsModal />

            <br />
            <ExplanationModal />
        </Container>
    );
};

export default Sidebar;
