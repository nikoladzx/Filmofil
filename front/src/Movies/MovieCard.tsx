import {   Box, Button, ButtonBase, Grid, Modal, Paper, Rating, Typography, styled } from "@mui/material";

import { Movie } from "./movie";
import { Link } from "react-router-dom";
import React, {  useState } from "react";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatMessage } from "../Chat/chatmessage";
import { useAuth } from "../Context/useAuth";
import ChatRoom from "../Chat/ChatRoom";


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
  0: 'Still no rating',
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
  const {user} = useAuth();
  const username = user?.username;
 const chatroom = movie.title;
  const [connection, setConnection] = useState<HubConnection | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[] | []>([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    joinChatroom(username!,chatroom);
    setOpen(true);
  };
  const handleClose = () => {
    setConnection(undefined);
    setOpen(false);
  };
  const joinChatroom = async (username :string, chatroom :string) => {
      try{
          const conn = new HubConnectionBuilder()
              .withUrl("https://localhost:7248/chat")
              .configureLogging(LogLevel.Information)
              .build();
              console.log(conn.connectionId +"zs");
              conn.on("JoinSpecificChatRoom", (username : string, text : string) => {
              setMessages(messages => [...messages, {username, text}])
              console.log(messages);
              });

              conn.on("ReceiveSpecificMessage", (username : string, text : string) => {
                  setMessages(messages => [...messages, {username, text}])
                  console.log(messages);
              });
              
              await conn.start();
            
              await conn.invoke("JoinSpecificChatRoom", {username, chatroom});
              setConnection(conn);
             

      }


      catch(e) {
          console.log(e);
      }
  }
  const sendMessage = async(message : string) => {
      try {
          await connection?.invoke("SendMessage", {username, chatroom}, message)
      }
      catch (e){
          console.log(e);
      }
  }
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
            <Img alt="complex" src={movie.pictureUrl}  />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container >
          <Grid item xs container direction="column" spacing={2}  sx = {{  justifyContent: 'center', alignItems: 'center', paddingBottom: 3, pr:3}}>
            <Grid item xs>
              <Typography gutterBottom variant="h4" component="div" sx = {{color: "primary.main"}} >
                {movie.title}
              </Typography>
              

    {connection ? <Modal
      
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >

        <ChatRoom messages = {messages} sendMessage = {sendMessage}/>

         
         
      </Modal> : <Button
    onClick={handleOpen} > JOIN</Button>}
              </Grid>
              <Grid item xs>
              <Typography variant="body2" color="text.secondary" >
              {movie.description}
              </Typography>
            </Grid>
            <Grid  container spacing={2} sx = {{ display: 'flex', justifyContent: 'center', alignItems: 'center' , pt: 4, pl: 5, mr : 2 }}>
              <Grid item xs={4} sx={{mv : 10, ml : -2}}>
              
              <Button  component={Link} to={`/reviews/${movie.id}`}
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
              <Box sx={{ ml: 6, color:"primary.main" }}>{labels[movie.rating]}</Box>
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