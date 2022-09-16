import React from 'react'
import { useEffect, useState, useRef } from "react";
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import  ACTIONS  from '../Actions';
import {useLocation, useNavigate, Navigate, useParams} from 'react-router-dom';
import toast from 'react-hot-toast';

const EditorPage = () => {
    const  reactNavigator= useNavigate();
    const codeRef = useRef(null);
    const socketRef = useRef(null);
    const {roomId} = useParams();
    const location = useLocation();

    const [clients, setClients] = useState([]);


    useEffect(() =>{
        const init = async () =>{
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e){
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later');
                reactNavigator('/');
            }


            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.name,
            });


            socketRef.current.on(ACTIONS.JOINED, ({clients, username, socketId}) => {
                if(username !== location.state?.name){
                    toast.success(`${username} joined the room`);
                    console.log(`${username} joined the room`);
                }
                setClients(clients);
                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    code : codeRef.current,
                    socketId,
                });
            });



            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({socketId, username}) => {
                    toast.success(`${username} left the room`);
                    setClients((prev) =>{
                        return prev.filter(client => client.socketId !== socketId);
                    })
                }
            )
        }
        init();


        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOIN);
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        }

    }, [])
   

    async function copyRoomId() {
        try{
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID copied to clipboard');
        }

        catch(err){
            toast.error('Failed to copy room ID');
            console.error(err);
        }
    }

    function leaveRoom(){
        // socketRef.current.emit(ACTIONS.LEAVE, {roomId});
        reactNavigator('/');
    }


    if(!location.state){
        return <Navigate to="/"/>
    }

    

  return (
    <div className='mainWrap'>
        <div className='aside'>
            <div className='asideInner'>
                <img className='logoImg' src='/logo.png' alt='logo'></img>
                <h2>Connected...</h2>
                <div className='clients'>
                    {clients.map((client) => (<Client key={client.socketId} username={client.username}/>))}
                </div>
            </div>
            <button className='btn copybtn' onClick={copyRoomId}>Copy Room ID</button>
            <button className='btn leavebtn' onClick={leaveRoom}>Leave</button>
        </div>
        <div className='editor'>
            <Editor socketRef={socketRef} roomId = {roomId} onCodeChange = {(code) => {
                codeRef.current = code;
            }}/>
        </div>
    </div>
  )
}

export default EditorPage