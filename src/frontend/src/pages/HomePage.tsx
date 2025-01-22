import React, { useState } from 'react'
import AppBar from '../components/AppBar'
import JunQiBoard from '../components/JunQiBoard';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import { VerticalAlignBottom } from '@mui/icons-material';
import Paper from '@mui/material/Paper';
import { styled, useTheme } from '@mui/material/styles';
import ChatBox from '../components/ChatBox';
import { useAuthContext } from '../utils/AuthContext';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
    width: '100%',
}));

const ItemWithoutPadding = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
    width: '100%',
}));


const HomePage: React.FC = () => {
    type GamePhase = 'DEPLOYING' | 'MOVING';
    const [gamePhase, setGamePhase] = useState<GamePhase>('DEPLOYING');
    const {isLoggedIn, setIsLoggedIn} = useAuthContext();

    const theme = useTheme();
    const navigate = useNavigate();

    function ClickRouter(event: React.MouseEvent<HTMLButtonElement>) {
        const buttonId = (event.target as Element).id;
        console.log("Button ID:", buttonId);
        if (!isLoggedIn) {
            navigate('/login');
        }
    }

    const renderButtonGrid = () => {
        if (gamePhase === "DEPLOYING") {
            return (
                <Item>
                    <Grid container columns={1} rowSpacing={1} wrap='nowrap' direction={"column"}>
                        <Button variant="contained" sx={{ width: '100%', maxWidth: '1000px' }} onClick={ClickRouter}>Start</Button>
                        <Grid container width={'100%'} columns={2} rowSpacing={1} columnSpacing={{ xs: 0.25, sm: 0.5, md: 0.75 }} wrap='nowrap' direction={"row"}>
                            <ItemWithoutPadding><Button variant="contained" sx={{ width: '100%', maxWidth: '1000px' }} onClick={ClickRouter}>Save Layout</Button></ItemWithoutPadding>
                            <ItemWithoutPadding><Button variant="contained" sx={{ width: '100%', maxWidth: '1000px' }} onClick={ClickRouter}>Load Layout</Button></ItemWithoutPadding>
                        </Grid>
                    </Grid>
                </Item>
            )
        } else if (gamePhase === "MOVING") {
            return (
                <Item>
                    <Grid container columns={1} rowSpacing={1} wrap='nowrap' direction={"column"}>                        
                        <Grid container width={'100%'} columns={2} rowSpacing={1} columnSpacing={{ xs: 0.25, sm: 0.5, md: 0.75 }} wrap='nowrap' direction={"row"}>
                            <ItemWithoutPadding><Button variant="contained" sx={{ width: '100%', maxWidth: '1000px' }} onClick={ClickRouter}>Draw</Button></ItemWithoutPadding>
                            <ItemWithoutPadding><Button variant="contained" sx={{ width: '100%', maxWidth: '1000px' }} onClick={ClickRouter}>Skip</Button></ItemWithoutPadding>
                        </Grid>
                        <Grid container width={'100%'} columns={2} rowSpacing={1} columnSpacing={{ xs: 0.25, sm: 0.5, md: 0.75 }} wrap='nowrap' direction={"row"}>
                            <ItemWithoutPadding><Button variant="contained" sx={{ width: '100%', maxWidth: '1000px' }} onClick={ClickRouter}>Save Layout</Button></ItemWithoutPadding>
                            <ItemWithoutPadding><Button variant="contained" sx={{ width: '100%', maxWidth: '1000px' }} onClick={ClickRouter}>Surrender</Button></ItemWithoutPadding>
                        </Grid>
                    </Grid>
                </Item>
            )
        }
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '0px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
            <AppBar />
            <Grid
                container columns={2}
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                wrap='nowrap'
                justifyContent="center"  // Center horizontally
                alignItems="flex-start"      // Center vertically
                sx={{ marginTop: '20px' }}
            >
                <Grid size={1}>
                    <Item><JunQiBoard /></Item>
                </Grid>

                <Grid columns={1} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} wrap='nowrap' direction={"column"}>
                    {renderButtonGrid()}
                    <Item>
                        <div style={{ borderBottom: '1px solid #333' }}></div>
                    </Item>
                    <Item>
                        <Grid container columns={1} rowSpacing={1} wrap='nowrap' direction={"column"}>
                            <ChatBox></ChatBox>
                        </Grid>
                    </Item>
                </Grid>
            </Grid>
        </div>
    )
}

export default HomePage;