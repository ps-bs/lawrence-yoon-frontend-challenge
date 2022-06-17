import { render, screen, waitFor, fireEvent } from "../../../test-utils";
import { MemoryRouter } from "react-router-dom";
import { Route } from "react-router";
import { ChatViewMessageList } from "../MessageList";
import { AppContext } from "../../../App/context";
import { SocketContext } from "../../../socket/context";
import socketIOClient from "socket.io-client";
import SocketMock from "socket.io-mock";

jest.mock("socket.io-client");

describe("ChatViewMessageList", () => {
  let socket;
  const currentUser = {
    socketId: "1",
    userId: "1",
    username: "user",
  };
  const user2 = {
    socketId: "2",
    userId: "2",
    username: "user2",
  };
  const conversation = {
    conversationId: "1",
    userIds: [currentUser.userId, user2.userId],
  };
  const message = {
    body: "message",
    conversationId: conversation.conversationId,
    createdAt: new Date(),
    messageId: "1",
    senderId: currentUser.userId,
  };

  beforeEach(() => {
    socket = new SocketMock();
    socketIOClient.mockReturnValue(socket);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should load & render messages list", () => {
    const socketEmitMock = jest.spyOn(socket, "emit");

    render(
      <MemoryRouter
        initialEntries={[`/conversation/${conversation.conversationId}/`]}
      >
        <AppContext.Provider
          value={{
            currentUser,
            users: [currentUser, user2],
            conversations: [conversation],
            messages: [message],
          }}
        >
          <SocketContext.Provider value={{ socket }}>
            <Route path="/conversation/:conversationId">
              <ChatViewMessageList />
            </Route>
          </SocketContext.Provider>
        </AppContext.Provider>
      </MemoryRouter>
    );

    expect(socketEmitMock).toHaveBeenCalledWith("getConversationMessages", {
      conversationId: conversation.conversationId,
    });
    expect(screen.getByText(currentUser.username)).toBeInTheDocument();
    expect(screen.getByText(message.body)).toBeInTheDocument();
  });
});
