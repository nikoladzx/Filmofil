
import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import agent from "../API/agent";
import { useParams } from "react-router-dom";
import Header from "../Header/Header";
import { UserProvider } from "../Context/useAuth";
import CommentCard from "./CommentCard";
import CommentPage from "./CommentPage";


export default function CommentList(){
    const [comments, setComments] = useState<string[]>([]);
    const {reviewId} = useParams();
    console.log(reviewId);
    useEffect(()=>{
        
        reviewId && agent.Home.getComments(reviewId)
      .then(data => setComments(data.comments))
      .catch(error => console.log(error))
    },[])
    console.log(comments)
    return (<>
      <UserProvider>
      
      <Grid container spacing ={1}>
        
      <Header/>  

            
           
            {comments.map(c=>
                    
                         <Grid item xs={12} key={c}>
                         <CommentCard comment = {c}/>
 
                     </Grid>
            )}
            <Grid item xs={12} >
            <CommentPage reviewID={reviewId!}/>
                     </Grid>
        
            
        </Grid>
            
        </UserProvider>
        </>
    )
}