import {   Box,  Button,  Grid, Paper, Rating, Typography } from "@mui/material";

import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import agent from "../API/agent";
import { Review } from "./Review";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useAuth } from "../Context/useAuth";


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
  // const [clickUpvote, setClickUpvote] = useState (false);
  // const [clickDownvote, setClickDownvote] = useState (false);
    const [change, setChange] = useState(false);
    const {user} = useAuth();
    const [votes, setVotes] = useState([]);
    useEffect(()=>{
        
        review && agent.Home.getReview(review)
        .then(r => setRev(r.review))
        .catch(error => console.log(error));
        review && agent.Home.getVotes(review, user!.id)
        .then(r=> setVotes(r))
        .catch(err => console.log(err))
    },[change])
    console.log(rev);
    const {upvotes, downvotes, clicku, clickd} = {...votes}
  function handleDownvote(): void {
    if (clickd === 0)
      {
        agent.Home.addDownvote(user!.id, review, 1)
        .then(x => console.log(x))
        .catch(err => console.log(err))
        .finally(()=> setChange(true));
      }
      else 
        {
          agent.Home.addDownvote(user!.id, review, -1)
          .then(x => console.log(x))
          .catch(err => console.log(err))
          .finally(()=> setChange(false));
          
        }
        
  }

console.log(clicku +"mz?")

function handleUpvote(): void {
 
    if (clicku === 0)
      {
        agent.Home.addUpvote(user!.id, review, 1)
        .then(x => console.log(x))
        .catch(err => console.log(err))
        .finally(()=> setChange(true));
      }
      if (clicku === 1)
        {
          agent.Home.addUpvote(user!.id,review, -1)
          .then(x => console.log(x))
          .catch(err => console.log(err))
          .finally(()=> setChange(false));
        }
  }

    return (
        <>  
        
        {rev?.rating + "ovo je rating"}
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
        <Link to={"movies"}></Link>
   <Grid container spacing={2} sx = {{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

        <Grid container xs = {2}> 
        <Grid item xs = {12} sx ={{p: 3}}>
          <Typography sx = {{p: 1}}>{upvotes}</Typography>
            {clicku ? <ThumbUpIcon color="primary" onClick={()=>handleUpvote()}></ThumbUpIcon> :
             <ThumbUpIcon  onClick={()=>handleUpvote()}></ThumbUpIcon>}
            
            
            </Grid>
            <Grid item xs = {12} sx ={{pl: 3}}>
            {clickd ? <ThumbDownIcon color="primary" onClick={()=> handleDownvote()}></ThumbDownIcon> :
             <ThumbDownIcon  onClick={()=> handleDownvote()}></ThumbDownIcon>}

            <Typography sx = {{pl: 1}}>{downvotes}</Typography>
            
        </Grid>
        <Grid item xs = {12} sx ={{p: 2}}>
            {rev?.time}
            
        </Grid>
        </Grid>
        <Grid item xs={12} sm container >
          <Grid item xs container direction="column" spacing={2}  sx = {{  justifyContent: 'center', alignItems: 'center', paddingBottom: 3, pr:3}}>
            <Grid item xs>
              <Typography gutterBottom variant="h4" component="div" sx = {{color: "primary.main"}} >
              <Box sx={{ color:"primary.main" }}>{labels[rev ? rev.rating : 0]}</Box>
              </Typography>
              </Grid>
              <Grid item sx = {{mr : 3}}>
              <Typography variant="body2" color="text.secondary" >
              {rev?.text}
              </Typography>
            </Grid>
            <Grid  container spacing={2} sx = {{ display: 'flex', justifyContent: 'center', alignItems: 'center' , pt: 4, pl: 5, mr : 2 }}>
              <Grid item xs={4} sx={{mv : 10, ml : -2}}>
              
              
              </Grid>
              
              <Grid item xs={4} sx={{ mt:7, mr: 5}}>
                    <Button component={Link}
                     to = {`/comments/${review}`}
                     >Comments</Button>
              </Grid>
              <Grid item xs = {3} sx={{ mt:7 }}>
              
            <Rating  
            name="half-rating-read"
            value={rev && rev.rating}
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