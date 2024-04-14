

import { Grid } from '@mui/material'
import Header from './Header/Header'
import Movies from './Movies/movies'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';

const theme = createTheme({
   palette:{
    primary:{
      main: "#1760a5",
      light: "skyblue"
    },
    secondary:{
      main: '#15c630',

    }
   }
});

export default function App() {
   return (
      <ThemeProvider theme={theme}>
    <>
  
  <Grid container spacing={5} sx={{}}>
  <Grid item xs={12}>
  <Header/>
  </Grid>

  <Grid item xs={12}>
  <Movies/>
    </Grid>


  </Grid>
  
  </>
      </ThemeProvider>
   )
}

