import { Avatar, Box, Container, CssBaseline, Grid, Paper, TextField } from "@mui/material"
import { FormEvent, useState } from "react";
import { ChatMessage } from "./chatmessage";
import { styled } from '@mui/system';
import { deepOrange } from "@mui/material/colors";
import { useAuth } from "../Context/useAuth";

const MessageRow = styled('div')({
  display: 'flex',
});

const MessageRowRight = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
});

const MessageBlue = styled('div')({
  position: 'relative',
  marginLeft: '20px',
  marginBottom: '10px',
  padding: '10px',
  backgroundColor: '#A8DDFD',
  width: '60%',
  textAlign: 'left',
  font: '400 .9em "Open Sans", sans-serif',
  border: '1px solid #97C6E3',
  borderRadius: '10px',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: '0',
    height: '0',
    borderTop: '15px solid #A8DDFD',
    borderLeft: '15px solid transparent',
    borderRight: '15px solid transparent',
    top: '0',
    left: '-15px',
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: '0',
    height: '0',
    borderTop: '17px solid #97C6E3',
    borderLeft: '16px solid transparent',
    borderRight: '16px solid transparent',
    top: '-1px',
    left: '-17px',
  },
});
const MessageOrange = styled('div')({
    position: 'relative',
    marginRight: '0px',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#f8e896',
    width: '60%',
    textAlign: 'left',
    font: '400 .9em "Open Sans", sans-serif',
    border: '1px solid #dfd087',
    borderRadius: '10px',
    '&:after': {
      content: '""',
      position: 'absolute',
      width: '0',
      height: '0',
      borderTop: '15px solid #f8e896',
      borderLeft: '15px solid transparent',
      borderRight: '15px solid transparent',
      top: '0',
      right: '-15px',
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      width: '0',
      height: '0',
      borderTop: '17px solid #dfd087',
      borderLeft: '16px solid transparent',
      borderRight: '16px solid transparent',
      top: '-1px',
      right: '-17px',
    },
  });
  
  const MessageContent = styled('div')({
    padding: 0,
    margin: 0,
  });
  

  
  const OrangeAvatar = styled(Avatar)(({ theme }) => ({
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
    width: theme.spacing(4),
    height: theme.spacing(4),
  }));
  
  
  const DisplayName = styled('div')({
    marginLeft: '20px',
  });
interface Props {
    messages : ChatMessage[],
    sendMessage : (message: string) => Promise<void>
}


export default function ChatRoom({messages, sendMessage} : Props){
    const [message, setMessage] = useState("");
    const {user} = useAuth();
    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        sendMessage(message);
        setMessage("");
    }

    return(<>
          <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper>
        <Box
          sx={{
            marginTop : 5,
            marginBottom : 2,
            marginLeft :2,
            padding : 1,
            minWidth:450,
            minHeight:500,
            maxHeight: 750,
            overflow: "hidden",
            overflowY: "scroll",
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
    <Grid container>

    
    {messages.map((m) => 
        m.username === user?.username ? 
            <Grid item xs={12}>
        <MessageRow>
            <OrangeAvatar
            alt = {m.username}></OrangeAvatar>

            <div>
                <DisplayName>{m.username}</DisplayName>
                <MessageBlue>
                    <MessageContent>
                        {m.text}
                    </MessageContent>
                </MessageBlue>
            </div>
            
        </MessageRow>
        </Grid>
        : 
        <Grid item xs={12}>
        <MessageRowRight>
            
            <Grid item xs = {6}>
                <DisplayName>{m.username}</DisplayName>
                <MessageOrange>
                    <MessageContent>
                        {m.text}
                    </MessageContent>
                </MessageOrange>
            </Grid>
            <></>
 
        </MessageRowRight>
        
        </Grid>
    )}
    <Grid item xs={12}>


        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
        value = {message}
        onChange={(event) => setMessage(event?.target.value)}>

        </TextField>

        </Box>
    </Grid>
    </Grid>
    </Box>
    </Paper>
    </Container>

        </>)
}