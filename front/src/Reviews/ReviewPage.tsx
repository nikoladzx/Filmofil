import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useParams } from 'react-router-dom';
import agent from '../API/agent';
import { Movie } from '../Movies/movie';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { Rating } from '@mui/material';
import { ChangeEvent } from 'react';




export default function ReviewPage() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [movie, setMovie] = React.useState<Movie | null>(null);
    const [rating, setRating] = React.useState<number>(0);
    const [first, setFirst] = React.useState(true)
    const [text, setText] = React.useState("");
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFirst(false);
  };
  const {movieId} = useParams();
  console.log(movieId);

  React.useEffect(()=>{
    if (!first){
       // movieId && 
        agent.Home.addReview(text, "1", movieId!, rating)
       .then(s => console.log(s))
       .catch(error => console.log(error))
        
    }
    if (first){

        movieId && agent.Home.getMovie(movieId)
        .then(m => setMovie(m))
        .catch(error => console.log(error))
        
    }



  },[first])
  console.log(movie);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleRating(event: any): void {
        setRating(parseInt(event.target.value));
    }

    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setText(event.target.value);
    }

  return (

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
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <RateReviewIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {movie?.title}
           
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
             
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth 
                  multiline 
                  rows={6}
                  label="Write your review here"
                  value={text}
                  onChange={handleChange}

                />
              </Grid>
              
              <Grid item xs={12} >
              <Rating  sx ={{ml : 16, }} name="text-feedback"
            value={rating}
            onClick={handleRating}
            
            precision={1}
             />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Confirm
            </Button>
            
          </Box>
        </Box>

      </Container>
  );
}