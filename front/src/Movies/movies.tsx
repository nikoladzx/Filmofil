import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import agent from "../API/agent";
import { Movie } from "./movie";
import MovieCard from "./MovieCard";



export default function Movies() {


    const [movies, setMovies] = useState<Movie[] | []>([]);
    const [filter, setFilter] = useState("");
    useEffect(()=>{
        if (filter ==="")
            {
                agent.Home.list().then((data)=>setMovies(data.movies))
                .catch((error)=>console.log(error));
            }
        if (filter ==="rating")
            {
                agent.Home.listrating().then((data)=>setMovies(data.movies))
                .catch((error)=>console.log(error));
            }
        if (filter ==="number")
            {
                agent.Home.listnumber().then((data)=>setMovies(data.movies))
                .catch((error)=>console.log(error));
            }

        
    },[filter])

console.log(movies);

return (
<Grid container spacing ={2}>
<Grid item xs={12} sx = {{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button onClick={()=>setFilter("")}>Default</Button>
        <Button onClick={()=>setFilter("number")}>Number</Button>
        <Button onClick={()=>setFilter("rating")}>Rating</Button>
    </Grid>
        {movies.map(m => 
            

    <Grid item xs={12} key={m.id} >
        <MovieCard movie = {m}/>
    </Grid>)}
</Grid>
    
)
}
