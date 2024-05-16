import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ChangeEvent } from 'react';
import { useAuth } from '../Context/useAuth';
import { useNavigate } from 'react-router-dom';




// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function LoginPage() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const {loginUser} = useAuth();
    const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

  event.preventDefault();
  loginUser(username,password);
  navigate('/');

  
  }


    function handleUsername(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setUsername(event.target.value);
    }

    function handlePassword(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
       setPassword(event.target.value);
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value = {username}
              onChange={handleUsername}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value = {password}
              onChange={handlePassword}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>

    </ThemeProvider>
    
  );
}