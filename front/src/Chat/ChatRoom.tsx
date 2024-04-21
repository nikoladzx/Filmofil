import { Box, Grid, TextField, Typography } from "@mui/material"
import { FormEvent, useState } from "react";
import { ChatMessage } from "./chatmessage";

interface Props {
    messages : ChatMessage[],
    sendMessage : (message: string) => Promise<void>
}


export default function ChatRoom({messages, sendMessage} : Props){
    const [message, setMessage] = useState("");
    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        sendMessage(message);
        setMessage("");
    }

    return(<>
    <Grid container>

    
    {messages.map((m) => 
    <Grid item xs={12}>
        <Typography>{m.username + " -  " + m.text}</Typography>
    </Grid>)}
    <Grid item xs={12}>


        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
        onChange={(event) => setMessage(event?.target.value)}>

        </TextField>
        </Box>
    </Grid>
    </Grid>
        </>)
}