import { Paper, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import agent from "../API/agent";
import React, { useEffect, useState } from "react";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useAuth } from "../Context/useAuth";
import { Comment } from "./comment";


interface Prop {
    comment:string;
}
export default function CommentCard({comment} : Prop)
{

          const [com, setCom] = useState<Comment | null>(null)
  // const [clickUpvote, setClickUpvote] = useState (false);
  // const [clickDownvote, setClickDownvote] = useState (false);
    const [change, setChange] = useState(false);
    const {user} = useAuth();
    const [votes, setVotes] = useState([]);
    useEffect(()=>{
        
        comment && agent.Home.getComment(comment)
        .then(r => setCom(r.comment))
        .catch(error => console.log(error));
        comment && agent.Home.getVotes(comment, user!.id)
        .then(r=> setVotes(r))
        .catch(err => console.log(err))
    },[change])
    console.log(com);
  const {upvotes , downvotes , clicku , clickd } = {...votes}
  function handleDownvote(): void {
    // if (clickd === 0)
    //   {
    //     agent.Home.addDownvote(user!.id, comment, 1)
    //     .then(x => console.log(x))
    //     .catch(err => console.log(err))
    //     .finally(()=> setChange(true));
    //   }
    //   else 
    //     {
    //       agent.Home.addDownvote(user!.id, comment, -1)
    //       .then(x => console.log(x))
    //       .catch(err => console.log(err))
    //       .finally(()=> setChange(false));
          
    //     }
        
  }

console.log(clicku +"mz?")

function handleUpvote(): void {
 
    // if (clicku === 0)
    //   {
    //     agent.Home.addUpvote(user!.id, review, 1)
    //     .then(x => console.log(x))
    //     .catch(err => console.log(err))
    //     .finally(()=> setChange(true));
    //   }
    //   if (clicku === 1)
    //     {
    //       agent.Home.addUpvote(user!.id,review, -1)
    //       .then(x => console.log(x))
    //       .catch(err => console.log(err))
    //       .finally(()=> setChange(false));
    //     }
  }

    return (
        <>  
        
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
            {com?.time}
            
        </Grid>
        </Grid>
        <Grid item xs={12} sm container >
          <Grid item xs container direction="column" spacing={2}  sx = {{  justifyContent: 'center', alignItems: 'center', paddingBottom: 3, pr:3}}>
            <Grid item xs>
              <Typography gutterBottom variant="h4" component="div" sx = {{color: "primary.main"}} >
              {com?.authorID}
              </Typography>
              </Grid>
              <Grid item sx = {{mr : 3}}>
              <Typography variant="body2" color="text.secondary" >
              {com?.text}
             
              </Typography>
            </Grid>
            <Grid  container spacing={2} sx = {{ display: 'flex', justifyContent: 'center', alignItems: 'center' , pt: 4, pl: 5, mr : 2 }}>
              <Grid item xs={4} sx={{mv : 10, ml : -2}}>
              
              
              </Grid>
              
            
              <Grid item xs = {3} sx={{ mt:7 }}>
              
             
          </Grid>
            </Grid>
            
          </Grid>

        </Grid>
      </Grid>
        </Paper>
          </>
  
    )}