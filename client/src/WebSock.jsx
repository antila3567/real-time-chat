import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";

const WebSock = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef()
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('')
    console.log(messages)


    function connect() {
        socket.current = new WebSocket('ws://localhost:5000')

        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose = () => {
            const message = {
                event: 'disconnect',
                username,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
            setConnected(false)
        }
        socket.current.onerror = () => {
            setConnected(false)
            console.log('Socket error')
        }
    }


    const sendMessage = async () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        socket.current.send(JSON.stringify(message));
        setValue('')
    }

    if(!connected) {
        return (
            <div className="center">
                <div className="form">
                    <input 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    type="text" placeholder="enter your name, please"/>
                    <button onClick={connect}>connect</button>
                </div>
            </div>
        )
    }




    return (
        <div className="center">
            <div>
                <div className="form">
                    <input 
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    type="text"/>
                    <button onClick={sendMessage}>Отправить</button>
                </div>
                <div className="messages">
                    {messages.map(mess =>
                        <div key={mess.id}>
                            {mess.event === 'connection'
                                ? <div className="connection_message">
                                    Пользователь {mess.username} подключился
                                </div>
                                : <div className="message">
                                    {mess.username}: {mess.message}
                                </div>
                            }
                            {mess.event === 'disconnect' && 
                                <div className="message">
                                    Пользователь {mess.username} отключился
                                </div>
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebSock;
