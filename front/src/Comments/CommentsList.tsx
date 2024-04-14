import React from "react";
import { useParams } from "react-router-dom";

export default function CommentList(){
    const {reviewId} = useParams();
    console.log(reviewId);
    
    return(<>
    </>)
}