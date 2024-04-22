import { Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import agent from "../API/agent";
import { useParams } from "react-router-dom";
import ReviewCard from "./ReviewCard";
import Header from "../Header/Header";
import { UserProvider } from "../Context/useAuth";


export default function ReviewList(){
    const [reviews, setReviews] = useState<string[]>([]);
    const [sort, setSort] = useState(false);
    const {movieId} = useParams();
    useEffect(()=>{
      if (sort)
        {
          movieId && agent.Home.getReviews(movieId)
          .then(data => setReviews([...data.reviews]))
          .catch(error => console.log(error))
        }
        if (!sort)
          {
            movieId && agent.Home.getReviewsSorted(movieId)
          .then(data => setReviews([...data.reviews]))
          .catch(error => console.log(error))
          }

    },[movieId, sort])
    console.log(sort)
  function changeSort(): void {
   setSort(!sort);
  }

    return (<>
      <UserProvider>
      <Grid container spacing ={2}>
        <Header/>  
        
        <Grid item xs={12} sx = {{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                         <Button onClick={changeSort}>{sort ? "Sort By Date" : "Sort By Upvotes"}</Button>
                        
                         
                     </Grid>
            {reviews.map((r)=>
                         <Grid item xs={12} key={r} >
                         <ReviewCard review = {r}/>
                         
                     </Grid>
            )}
   
        </Grid>
            
        </UserProvider>
        </>
    )
}