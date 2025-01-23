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
import useQueueSocket from '../sockets/queue';


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
    const [isInQueue, setIsInQueue] = useState(false);
    const { isLoggedIn, setIsLoggedIn } = useAuthContext();
    const { joinQueue, leaveQueue } = useQueueSocket();

    const theme = useTheme();
    const navigate = useNavigate();

    function ClickRouter(event: React.MouseEvent<HTMLButtonElement>) {
        const buttonId = (event.target as Element).id;
        console.log("Clicked button with ID:", buttonId);
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            switch (buttonId) {
                case 'button-start':
                    joinQueue();
                    setIsInQueue(true);
                    break;
                case 'button-cancle':
                    leaveQueue();
                    setIsInQueue(false);
                    break;
                case 'button-save_layout':
                    break;
                case 'button-load_layout':
                    break;
                case 'button-draw':
                    break
                case 'button-surrender':
                    break;;
                default:
                    break
            }
        }
    }

    const renderButtonGrid = () => {
        if (gamePhase === "DEPLOYING") {
            return (
                <Item>
                    <Grid container columns={1} rowSpacing={1} wrap='nowrap' direction={"column"}>
                        {
                            isInQueue ? (
                                <Button id="button-cancle" variant="contained" sx={{ width: '100%', maxWidth: '1000px' }} onClick={ClickRouter}>Cancle</Button>
                            ) : (
                                <Button id="button-start" variant="contained" sx={{ width: '100%', maxWidth: '1000px' }} onClick={ClickRouter}>Start</Button>
                            )
                        }
                        <Grid container width={'100%'} columns={2} rowSpacing={1} columnSpacing={{ xs: 0.25, sm: 0.5, md: 0.75 }} wrap='nowrap' direction={"row"}>
                            <ItemWithoutPadding><Button id="button-save_layout" style={{ textDecoration: 'line-through' }} variant="contained" sx={{ width: '100%', maxWidth: '1000px' }} onClick={ClickRouter}>Save Layout</Button></ItemWithoutPadding>
                            <ItemWithoutPadding><Button id="button-load_layout" style={{ textDecoration: 'line-through' }} variant="contained" sx={{ width: '100%', maxWidth: '1000px' }} onClick={ClickRouter}>Load Layout</Button></ItemWithoutPadding>
                        </Grid>
                    </Grid>
                </Item>
            )
        } else if (gamePhase === "MOVING") {
            return (
                <Item>
                    <Grid container columns={1} rowSpacing={1} wrap='nowrap' direction={"column"}>
                        <Grid container width={'100%'} columns={2} rowSpacing={1} columnSpacing={{ xs: 0.25, sm: 0.5, md: 0.75 }} wrap='nowrap' direction={"row"}>
                            <ItemWithoutPadding><Button id="button-draw" style={{ textDecoration: 'line-through' }} variant="contained" sx={{ width: '100%', maxWidth: '1000px' }} onClick={ClickRouter}>Draw</Button></ItemWithoutPadding>
                            <ItemWithoutPadding><Button id="button-skip" style={{ textDecoration: 'line-through' }} variant="contained" sx={{ width: '100%', maxWidth: '1000px' }} onClick={ClickRouter}>Skip</Button></ItemWithoutPadding>
                        </Grid>
                        <Grid container width={'100%'} columns={2} rowSpacing={1} columnSpacing={{ xs: 0.25, sm: 0.5, md: 0.75 }} wrap='nowrap' direction={"row"}>
                            <ItemWithoutPadding><Button id="button-save_layout" style={{ textDecoration: 'line-through' }} variant="contained" sx={{ width: '100%', maxWidth: '1000px' }} onClick={ClickRouter}>Save Layout</Button></ItemWithoutPadding>
                            <ItemWithoutPadding><Button id="button-surrender" style={{ textDecoration: 'line-through' }} variant="contained" sx={{ width: '100%', maxWidth: '1000px' }} onClick={ClickRouter}>Surrender</Button></ItemWithoutPadding>
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