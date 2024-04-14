import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import agent from "../API/agent";
import { useParams } from "react-router-dom";
import ReviewCard from "./ReviewCard";


export default function ReviewList(){
    const [reviews, setReviews] = useState<string[]>([]);
    const {movieId} = useParams();
    console.log(movieId);
    useEffect(()=>{
        
        movieId && agent.Home.getReviews(movieId)
      .then(data => setReviews(data.reviews))
      .catch(error => console.log(error))
    },[])
    console.log(reviews)
    return (
        <Grid container spacing ={2}>
           
            {reviews.map(r=>
                    
                         <Grid item xs={12} >
                         <ReviewCard review = {r}/>
                         {r}
                     </Grid>
            )}
   
        </Grid>
            
        
        
    )
}