import React from 'react'
import AppBar from '../components/AppBar'
import JunQiBoard from '../components/JunQiBoard';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import { VerticalAlignBottom } from '@mui/icons-material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import ChatBox from '../components/ChatBox';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/login');
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '0px', backgroundColor: '#f0f0f0' }}>
            <AppBar />
            <Grid
                container columns={2}
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                wrap='nowrap'
                justifyContent="center"  // Center horizontally
                alignItems="flex-start"      // Center vertically
                sx={{ marginTop: '20px', marginBottom: '20px' }}
            >

                <Grid size={1}>
                    <Item><JunQiBoard /></Item>
                </Grid>

                <Grid columns={1} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} wrap='nowrap' direction={"column"}>
                    <Item>
                        <Grid container columns={1} rowSpacing={1} wrap='nowrap' direction={"column"}>
                            <Button variant="contained" sx={{ maxWidth: '1000px' }} onClick={handleClick}>Start</Button>
                            <Button variant="contained" sx={{ maxWidth: '1000px' }} onClick={handleClick}>Save Layout</Button>
                            <Button variant="contained" sx={{ maxWidth: '1000px' }} onClick={handleClick}>Load Layout</Button>
                        </Grid>
                    </Item>
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