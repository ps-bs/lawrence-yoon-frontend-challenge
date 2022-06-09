import { config } from "dotenv";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { v4 } from "uuid";
import { Conversation, Message, User } from "./types";

config()

// store everything in memory
const conversations: Conversation[] = []
const messages: Message[] = [];
const users: User[] = [];

const httpServer = createServer()
const io = new Server(httpServer, {
  serveClient: false  
});

/**
TODO
- store a state of typing 
*/


io.on("connection", (socket: Socket) => {
  console.log(`Socket connected [socket.id]: ${socket.id}`);
  const {userId, username} = socket.handshake.query as unknown as {userId: string; username: string;}
  const userIndex = users.findIndex(u => u.userId === userId);
  // update socket id if this client has connected previously
  if (userIndex > -1) {
    users[userIndex] = {
      ...users[userIndex],
      socketId: socket.id
    }
  } else {
    users.push({ socketId: socket.id, userId, username  })
  }
  
  // send most up to date array of users bc new client connected
  io.sockets.emit('users', users)

  // send conversations, if any, to newly connected user
  socket.emit('conversations', conversations.filter(c => c.userIds.includes(userId)))
  
  socket.on('disconnect', () => {
    console.log(`Socket disconnected [socket.id]: ${socket.id}`)
    // set socketId to undefined so clients know the user is disconnected
    const userIndex = users.findIndex(u => u.socketId === socket.id)
    users[userIndex] = {
      socketId: undefined,
      userId,
      username,
    }
    // emit up-to-date users array
    io.sockets.emit('users', users)
  })

  socket.on('username', ({ userId, username }) => {
    const userIndex = users.findIndex(u => u.socketId === socket.id)
    users[userIndex] = {
      socketId: socket.id,
      userId,
      username,
    }

    // emit changed username
    io.sockets.emit('users', users)
  })

  socket.on('startConversation', ({ userId, recipientId }) => {
    const conversation: Conversation = {
      conversationId: v4(),
      userIds: [userId, recipientId]
    }
    conversations.push(conversation)

    // let both clients know theyre part of a conversation
    const userConversations = conversations.filter(c => c.userIds.includes(userId))
    socket.emit('conversations', userConversations)
    
    const recipient = users.find(u => u.userId === recipientId)
    if (recipient && recipient.socketId) {
      const recipientConversations = conversations.filter(c => c.userIds.includes(recipientId))
      io.to(recipient.socketId).emit('conversations', recipientConversations)
    }
  })

  socket.on('getConversations', ({ userId }) => {
    socket.emit('conversations', conversations.filter(c => c.userIds.includes(userId)))
  })

  socket.on('getConversationMessages', ({ conversationId }) => {
    socket.emit('messages', messages.filter(m => m.conversationId === conversationId))
  })

  socket.on('sendMessage', (newMessage: Message) => {
    const message = {...newMessage, createdAt: new Date(), messageId: v4()}
    messages.push(message);
    // send message back to sender
    socket.emit('message', message)
    // send messager to recipient, if possible
    const conversation = conversations.find(c => c.conversationId === message.conversationId);
    const recipient = users.find(u => conversation?.userIds.includes(u.userId) && u.userId !== userId)
    if (recipient?.socketId) {
      io.to(recipient.socketId).emit('message', message)
    }
  })

  
});

const port = process.env.PORT || 3001
httpServer.listen(port);
console.log(`Socket server listening on: ${port}`);
