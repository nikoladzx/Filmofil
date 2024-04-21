import { Button, Typography } from "@mui/material";
import { useAuth } from "../Context/useAuth";
import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import ChatRoom from "./ChatRoom";
import { ChatMessage } from "./chatmessage";

export default function ChatPage()
{
    const {user} = useAuth();
    const username = user?.username;
    const [chatroom, setChatroom] = useState("mzroom");
    const [connection, setConnection] = useState<HubConnection | undefined>(undefined);
    const [messages, setMessages] = useState<ChatMessage[] | []>([]);
    useEffect(()=> {console.log("mz")},[connection])
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
    console.log(user?.username);
    return (<>

    <Button
    onClick={()=> joinChatroom(username!,chatroom)} > asdgfdsa</Button>
    {console.log(connection)}
    {connection ? <ChatRoom messages = {messages} sendMessage = {sendMessage}/> : <Typography>{"ne radi"}</Typography>}
  

    
    </>)
}

