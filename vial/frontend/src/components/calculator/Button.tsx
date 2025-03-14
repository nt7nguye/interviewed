import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';

type ButtonType = 'value' | 'sign' | 'equal';

export interface ButtonProps {
    type: 'value' | 'sign' | 'equal';
    value: string;
    onClick: () => void; 
}

const backgroundColors = {
    'value': '#e0e0e0',
    'sign': '#647198',
    'equal': '#f9a825',
}

const hoverColors = {
    'value': '#e0e0ff',
    'sign': '#6472ff',
    'equal': '#f9a8ff',
}

const StyledButton = styled(Button)(({ theme, type}) => ({
    backgroundColor: type !== undefined ? backgroundColors[type as ButtonType] : '#e0e0e0',
    color: type === 'value' ? theme.palette.common.black : theme.palette.common.white, 
    '&:hover': {
        backgroundColor: type !== undefined ? hoverColors[type as ButtonType] : '#e0e0e0',
    },
    width: 100,
    height: 50,
    borderRadius: 5,
    boxShadow: 'inset 0px -4px 0px #3a4663',
    fontSize: 30,
    fontWeight: 600,
}
));

const CalcButton: React.FC<ButtonProps> = ({type, value, onClick}) => {
    return (
        <Grid item xs={2.4} sx={{marginTop: 1.5}} alignContent="center">
            <StyledButton 
                type={type} 
                value={value} 
                onClick={onClick}
            >
                {value}
            </StyledButton>
        </Grid>
    );
}

export default CalcButton;
