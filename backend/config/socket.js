import {Server} from 'socket.io'
import http from 'http'
import express from 'express';

const app=express();
const server=http.createServer(app)
const io=new Server(server,{
    cors:{
        origin:["http://localhost:5173"]
        
    },
})



io.on('connection', (socket) => {

   socket.on('join-event', ({ eventId, userId }) => {
    // Join the socket to a room with eventId
    socket.join(eventId);
    console.log(`User ${userId} joined event room ${eventId}`);
    
  });

  socket.on('send-message', ({ eventId, message }) => {
    socket.to(eventId).emit('receive-message', message);
    console.log(`Message sent to event ${eventId}:`, message);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);

  
  });
    socket.on('send-poll', ({ eventId, pollData }) => {
        socket.to(eventId).emit('poll-created', pollData);
       
    });
    socket.on('poll-update', ({ eventId, pollData }) => {
        socket.to(eventId).emit('poll-updated', pollData);
    });

    // socket.on('vote-poll', ({ eventId, pollId, userId, option }) => {
    //     socket.to(eventId).emit('poll-vote', { pollId, userId, option });
    //     console.log(`User ${userId} voted for option ${option} in poll ${pollId} for event ${eventId}`);
    // });


})

export {server,io,app}