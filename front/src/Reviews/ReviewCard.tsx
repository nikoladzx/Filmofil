import {   Box,  Button,  Grid, Paper, Rating, Typography } from "@mui/material";

import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import agent from "../API/agent";
import { Review } from "./Review";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

interface Prop {
    review:string;
}

const labels: { [index: string]: string } = {
  0.5: 'Terrible',
  1: 'Really Bad',
  1.5: 'Poor',
  2: 'Awful',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};
export default function ReviewCard({review} : Prop)
{   const [rev, setRev] = useState<Review | null>(null)
    useEffect(()=>{
        
        review && agent.Home.getReview(review)
        .then(r => setRev(r.review))
        .catch(error => console.log(error))
    },[rev])
    console.log(rev);
    return (
        <>    

        <Paper
        sx={{
          p: 2,
          margin: 'auto',
          maxWidth: 500,
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
      >
        <Link to={"movies"}></Link>
   <Grid container spacing={2} sx = {{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

        <Grid container xs = {2}> 
        <Grid item xs = {12} sx ={{p: 2}}>
            {rev?.upvotes === null ? "0" : rev?.upvotes}
            <ThumbUpIcon></ThumbUpIcon>
            
            </Grid>
            <Grid item xs = {12} sx ={{p: 2}}>
            {rev?.downvotes === 0 ? "0" : rev?.downvotes}
            <ThumbDownIcon>{rev?.downvotes}</ThumbDownIcon>
        </Grid>
        <Grid item xs = {12} sx ={{p: 2}}>
            {rev?.time}
            
        </Grid>
        </Grid>
        <Grid item xs={12} sm container >
          <Grid item xs container direction="column" spacing={2}  sx = {{  justifyContent: 'center', alignItems: 'center', paddingBottom: 3, pr:3}}>
            <Grid item xs>
              <Typography gutterBottom variant="h4" component="div" sx = {{color: "primary.main"}} >
                {rev?.text}
              </Typography>
              </Grid>
              <Grid item xs>
              <Typography variant="body2" color="text.secondary" >
              {rev?.text}
              </Typography>
            </Grid>
            <Grid  container spacing={2} sx = {{ display: 'flex', justifyContent: 'center', alignItems: 'center' , pt: 4, pl: 5, mr : 2 }}>
              <Grid item xs={4} sx={{mv : 10, ml : -2}}>
              
              
              </Grid>
              
              <Grid item xs={4}>
                    <Button component={Link}
                     to = {`/comments/${review}`}
                     ></Button>
              </Grid>
              <Grid item xs = {3} sx={{ mt: 0 }}>
              <Box sx={{ ml: 6, color:"primary.main" }}>{labels[1]}</Box>
            <Rating  
            value={rev?.rating}
            readOnly
            precision={0.5}
             />
             
          </Grid>
            </Grid>
            
          </Grid>

        </Grid>
      </Grid>
        </Paper>
          </>
    )
}