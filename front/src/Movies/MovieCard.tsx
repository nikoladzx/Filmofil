import {  Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Movie } from "./movie";

interface Props {
    movie: Movie;
 
}
export default function MovieCard({movie} : Props)
{
    return (
        <>
        <Card >
        <CardHeader
        

            title={movie.title + " " + movie.title}
            titleTypographyProps={{
                sx: {fontWeight:'bold', color:'primary.main'}
            }}
            />
      <CardMedia
        component="img"
       
        image={"Screenshot_6.jpg"}
        title={movie.title}
      />
      <CardContent>
        <Typography gutterBottom color='primary.secondary' variant="h4" component="div">
          {movie.rating + " RSD" }
        </Typography>
        <Typography variant="body1" color="primary.secondary">
          {"Brand : " + movie.title}
        </Typography>
        <Typography variant="body1" color="primary.secondary">
          {"Mechanism : " + movie.title}
        </Typography>
      </CardContent>
      <CardActions>
        
       
      </CardActions>
    </Card>
          </>
    )
}