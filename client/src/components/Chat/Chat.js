import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import './Chat.css';
import { useLocation } from "react-router-dom";


import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

 

let socket;
const Chat=()=>{
    
    const ENDPOINT = 'localhost:5000';
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const location = useLocation();
    useEffect(() => {
        
      
         const { name, room } = queryString.parse(location.search);
    
        socket = io(ENDPOINT);
    
        setRoom(room);
        setName(name)
    //  console.log(location.search);
        socket.emit('join', { name, room }, (error) => {
          if(error) {
            alert(error);
          }
        }
        );
//         return ()=>{
// socket.emit('disconnect');
// socket.off();
        }, [ENDPOINT, location.search]);

      
      useEffect(() => {
        socket.on('message', (message) => {
          // setMessages(messages => [ ...messages, message ]);
          setMessages([...messages, message]);
        });
        
        socket.on("roomData", ({ users }) => {
          setUsers(users);
        });
    }, [messages]);
    
      const sendMessage = (event) => {
        event.preventDefault();
    
        if(message) {
          socket.emit('sendMessage', message, () => setMessage(''));
        }
        console.log(message,messages);
      }
    
      return (
        <div className="outerContainer">
          <div className="container">
              <InfoBar room={room} />
              <Messages messages={messages} name={name} />
              <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
          </div>
          <TextContainer users={users}/>
        </div>
      );
    }
export default Chat;