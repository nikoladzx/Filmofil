import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import agent from '../API/agent';
import RateReviewIcon from '@mui/icons-material/RateReview';

import { ChangeEvent } from 'react';
import { useAuth } from '../Context/useAuth';


interface Prop {
    reviewID:string;
}

export default function CommentPage({reviewID} : Prop) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const navigate = useNavigate();
    const [text, setText] = React.useState("");
  const handleSubmit = () => {
    reviewID && user && agent.Home.addComment(reviewID, user.id,text)
    .then(s => console.log(s))
    .catch(error => console.log(error))
   
  };
  
  const {user} = useAuth();
  console.log(user);


    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setText(event.target.value);
    }


  return (

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
        >

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
             
              
              <Grid item xs={12}>
                <TextField
                  required
                  
                  fullWidth 
                  multiline 
                  rows={6}
                  label="Write your comment here"
                  value={text}
                  onChange={handleChange}

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