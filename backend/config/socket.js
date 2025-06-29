import {Server} from 'socket.io'
import http from 'http'
import express from 'express';

const app=express();
const server=http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true   
    },
});

io.on('connection', (socket) => {

   socket.on('join-event', ({ groupId, userId }) => {
    // Join the socket to a room with groupId
    socket.join(groupId);
    console.log(`User ${userId} joined event room ${groupId}`);
  });

  socket.on('leave-event', ({ groupId, userId }) => {
    // Leave the socket room
    socket.leave(groupId);
    console.log(`User ${userId} left event room ${groupId}`);
  });

  socket.on('send-message', ({ groupId, message }) => {
    // Broadcast message to all users in the room except the sender
    socket.to(groupId).emit('receive-message', message);
    console.log(`Message sent to event ${groupId}:`, message);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });

  socket.on('send-poll', (data) => {
    if (!data || !data.groupId || !data.pollData) {
      console.error("Invalid 'send-poll' payload:", data);
      return;
    }

    const { groupId, pollData } = data;
    // Broadcast poll to all users in the room except the sender
    socket.to(groupId).emit('poll-created', pollData);
  });

  socket.on('poll-update', ({ groupId, pollData }) => {
    // Broadcast poll update to all users in the room
    socket.to(groupId).emit('poll-updated', pollData);
  });

  // socket.on('vote-poll', ({ groupId, pollId, userId, option }) => {
  //     socket.to(groupId).emit('poll-vote', { pollId, userId, option });
  //     console.log(`User ${userId} voted for option ${option} in poll ${pollId} for event ${groupId}`);
  // });

});

export {server,io,app}