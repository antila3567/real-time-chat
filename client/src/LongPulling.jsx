import React, {useEffect, useState} from 'react';
import axios from "axios";

const LongPulling = () => {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')

    useEffect(() => {
        subscribe()
    }, [])

    const subscribe = async () => {
     try {
         const {data} = await axios.get('http://localhost:5000/get-messages')

         setMessages((prev) => [data, ...prev])

         await subscribe()
     } catch (e) {
         setTimeout(() => {
             subscribe()
         }, 500)
        console.log('error', e)
     }
    }

    async function sendMessage() {
        await axios.post('http://localhost:5000/new-messages', {
            message: input,
            id: Date.now()
        })
    }

    return (
    <div className="center">
        <div>
            <div className="form">
                <input value={input} onChange={e => setInput(e.target.value)} type="text"/>
                <button onClick={sendMessage}>send message</button>
            </div>
            <div className="messages">
                {messages.map((msg) => (
                    <div key={msg.id} className="message">{msg.message}</div>
                ))}
            </div>
        </div>
    </div>
    )
}
export default LongPulling;
