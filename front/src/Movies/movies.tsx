import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import agent from "../API/agent";
import { Movie } from "./movie";
import MovieCard from "./MovieCard";



export default function Movies() {
    const [movies, setMovies] = useState<Movie[] | []>([]);
    useEffect(()=>{
        agent.Home.list().then((data)=>setMovies(data.movies))
        .catch((error)=>console.log(error));
    },[])

console.log(movies);

return (
<Grid container spacing ={2}>
    
        {movies.map(m => 
            

    <Grid item xs={12} >
        <MovieCard movie = {m}/>
    </Grid>)}
</Grid>
    
)
}
