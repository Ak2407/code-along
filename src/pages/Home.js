import React, { useState } from 'react'
import {v4 as uuidv4} from 'uuid'
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";


const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('')
    const [name, setName] = useState('')
    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidv4();
        setRoomId(id);
        toast.success('Room created successfully');
    }

    const joinRoom = () => {
        if(!roomId || !name) {
            toast.error('Please enter room id and name');
        }
        else{

            navigate(`/editor/${roomId}`, {state: {name}});
        }
    }

    const handleEnter = (e) => {
        if(e.code === 'Enter') {
            joinRoom();
        }
    }


  return (
    <>
        <div className='homewrapper'>
            <div className='formwrapper'>
                <img className='logo' src='/logo.png' alt='logo' />
                <h2 className='formLabel' >Paste or type ROOM ID</h2>
                <div className='inputs'>
                    <input className='inputBox' type='text'  value={roomId} placeholder='ROOM ID' onChange={(e) => setRoomId(e.target.value)} />
                    <input className='inputBox' type='text'  value={name} placeholder='USERNAME' onChange={(e) => setName(e.target.value)} onKeyUp={handleEnter}/>
                    <button className='btn joinbtn' onClick={joinRoom} >JOIN</button>
                    <span className='newRoom' ><a href='' onClick={createNewRoom}>Click here &nbsp;</a> to create a new room</span>
                </div>
            </div>

            <footer>

            <span>Built with ☕️ by <a href='#'> Akshit</a></span>
            </footer>

        </div>
    </>
  )
}

export default Home