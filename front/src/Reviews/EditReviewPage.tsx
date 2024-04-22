import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate, useParams } from 'react-router-dom';
import agent from '../API/agent';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { Paper, Rating } from '@mui/material';
import { ChangeEvent } from 'react';




export default function EditReviewPage() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const navigate = useNavigate();

    const [rating, setRating] = React.useState<number>(0);
    const [text, setText] = React.useState("");
    const {reviewID, authorID} = useParams();
    console.log(reviewID + " ovo je revid");
    console.log(authorID + " ovo je authif");
  const handleSubmit = () => {
    authorID && reviewID && agent.Home.editReview(reviewID, text, rating, authorID)
       .then(s => console.log(s))
       .catch(error => console.log(error))
       navigate('/');
  };

  
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
        <Paper
        sx={{
          p: 2,
          margin: 'auto',
          maxWidth: 555,
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
      >
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
            {"Edit your review"}
           
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
        </Paper>

      </Container>
  );
}