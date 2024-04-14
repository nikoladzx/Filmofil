import {   Box, Button, ButtonBase, Grid, Paper, Rating, Typography, styled } from "@mui/material";

import { Movie } from "./movie";
import { Link } from "react-router-dom";


interface Props {
    movie: Movie;
 
}
const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});
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
export default function MovieCard({movie} : Props)
{
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
        <Grid item>
          <ButtonBase sx={{ width: 155, height: 155 }}>
            <Img alt="complex" src="Screenshot_6.jpg"  />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container >
          <Grid item xs container direction="column" spacing={2}  sx = {{  justifyContent: 'center', alignItems: 'center', paddingBottom: 3, pr:3}}>
            <Grid item xs>
              <Typography gutterBottom variant="h4" component="div" sx = {{color: "primary.main"}} >
                {movie.title}
              </Typography>
              </Grid>
              <Grid item xs>
              <Typography variant="body2" color="text.secondary" >
              {" gfdsagdsfagewargas gsdfa gdsa gasd gar eswgras gsag eawsg sdag afsd geswa ga fdas fasd fsad fsa fdsaf sadf asdf sads "}
              </Typography>
            </Grid>
            <Grid  container spacing={2} sx = {{ display: 'flex', justifyContent: 'center', alignItems: 'center' , pt: 4, pl: 5, mr : 2 }}>
              <Grid item xs={4} sx={{mv : 10, ml : -2}}>
              
              <Button  component={Link} to="reviews"
              sx={{ cursor: 'pointer', color:"text.main" }} variant="contained">
                Reviews
              </Button>
              </Grid>
              
              <Grid item xs={4}>
              
              <Button component={Link} to={`/addreview/${movie.id}`}
                 sx={{ cursor: 'pointer', color:"text.main", pr: 2 }} variant="contained">
                Review
              </Button>
              </Grid>
              <Grid item xs = {3} sx={{ mt: 0 }}>
              <Box sx={{ ml: 6, color:"primary.main" }}>{labels[3]}</Box>
            <Rating   name="text-feedback"
            value={movie.rating}
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