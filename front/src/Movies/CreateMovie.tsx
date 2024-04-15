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
import agent from '../API/agent';
import { useNavigate } from 'react-router-dom';


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function CreateMovie() {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [image, setImage] = React.useState("");
    const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    agent.Home.addMovie(title, description, image)
    .then(x => console.log(x))
    .catch(err => console.log(err))
    .finally(()=> navigate("/"))
  };

    function handleFile(event: ChangeEvent<HTMLInputElement>): void {
        const cleanPath = event.target.value.replace(/^C:\\fakepath\\/i, '');
        console.log(cleanPath);
        setImage(cleanPath);
        
    }

    function handleTitle(event: ChangeEvent<HTMLInputElement>): void {
        setTitle(event.target.value);
        console.log(title);
    }

    function handleDescription(event: ChangeEvent<HTMLInputElement>): void {
        setDescription(event.target.value);
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
            Create Movie
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              autoComplete="title"
              value = {title}
              onChange= {handleTitle}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="description"
              label="Description"
              type="description"
              id="description"
              value = {description}
              onChange = {handleDescription}
            />
            <Grid container xs={12}>
                <Grid item xs = {4} >
                      <Button
                    variant="contained"
                    component="label"
                    >
                    Upload File
                    <input
                        type="file"
                        hidden
                        onChange={handleFile}
                    />
                    </Button>
                    </Grid>
                    <Grid item xs={8}>
                    <Typography variant = "h6">{image ? image : "Please upload an image"}</Typography>
                    </Grid>
                    </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              
            >
              Create Movie
            </Button>
            <Grid container>

              <Grid item>
                <Link href="#" variant="body2">
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