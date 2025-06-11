import { GlobalStyles as MuiGlobalStyles } from '@mui/material';

export const GlobalStyles = () => (
  <MuiGlobalStyles
    styles={{
      '*': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      },
      html: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        height: '100%',
        width: '100%',
        scrollBehavior: 'smooth',
        '&::-webkit-scrollbar': {
          width: '0.5rem',
          height: '0.5rem',
        },
        '&::-webkit-scrollbar-track': {
          background: '#0e0e0e',
          borderRadius: '0.25rem',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#333',
          borderRadius: '0.25rem',
          border: '0.1rem solid #0e0e0e',
          '&:hover': {
            backgroundColor: '#444',
            borderColor: '#000',
          },
        },
        '&::-webkit-scrollbar-button': {
          display: 'none',
        },
      },
      body: {
        height: '100%',
        width: '100%',
        backgroundColor: '#F8FAFC',
        color: '#2a2c32',
        fontFamily: 'Roboto, sans-serif',
      },
      '#root': {
        height: '100%',
        width: '100%',
      },
      input: {
        '&[type=number]': {
          MozAppearance: 'textfield',
          '&::-webkit-outer-spin-button': {
            margin: 0,
            WebkitAppearance: 'none',
          },
          '&::-webkit-inner-spin-button': {
            margin: 0,
            WebkitAppearance: 'none',
          },
        },
      },
      img: {
        display: 'block',
        maxWidth: '100%',
      },
      span: {
        fontFamily: 'inherit',
        fontSize: 'inherit',
        color: 'inherit',
        fontWeight: 'inherit',
      },
      a: {
        textDecoration: 'none',
        color: 'inherit',
        fontSize: 'inherit',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
    }}
  />
); 