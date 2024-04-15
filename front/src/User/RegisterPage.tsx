import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ChangeEvent } from 'react';
import agent from '../API/agent';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@mui/material';



// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function RegisterPage() {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isAdmin, setIsAdmin] = React.useState(false);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    agent.Home.register(username, password, isAdmin)
    .then(s => console.log(s))
    .catch(err => console.log(err))
    .finally(()=> navigate("/"))
    
    
  };

    function handleUsername(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setUsername(event.target.value);
    }

    function handlePassword(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setPassword(event.target.value);
    }

  function handleAdmin(): void {
    setIsAdmin(!isAdmin);

  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value = {username}
                  onChange={handleUsername}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value = {password}
                  onChange={handlePassword}
                />
              </Grid>
            </Grid>
            <Grid container xs = {12}>
              <Grid item xs= {2}>
              <Checkbox 
        value = {isAdmin}
        onChange={handleAdmin}
        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
      />
              </Grid>
              <Grid item xs={10} sx ={{pr: 5, mt:1}}>
              <Typography variant="h6">ADMIN</Typography>
              </Grid>
            </Grid>
 
  
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>

          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}