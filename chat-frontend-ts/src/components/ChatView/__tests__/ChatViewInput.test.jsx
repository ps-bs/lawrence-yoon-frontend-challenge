import { render, screen, waitFor, fireEvent } from "../../../test-utils";
import { MemoryRouter } from "react-router-dom";
import { Route } from "react-router";
import { ChatViewInput } from "../Input";
import { AppContext } from "../../../App/context";
import { SocketContext } from "../../../socket/context";
import socketIOClient from "socket.io-client";
import SocketMock from "socket.io-mock";

jest.mock("socket.io-client");

describe("ChatViewInput", () => {
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
  const channel = {
    conversationId: "2",
    conversationName: "channel",
    userIds: [],
  };
  const message = "message";

  beforeEach(() => {
    socket = new SocketMock();
    socketIOClient.mockReturnValue(socket);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render message input and send button", () => {
    render(
      <MemoryRouter
        initialEntries={[`/conversation/${conversation.conversationId}/`]}
      >
        <AppContext.Provider
          value={{
            currentUser,
            users: [currentUser, user2],
            conversations: [conversation],
          }}
        >
          <Route path="/conversation/:conversationId">
            <ChatViewInput />
          </Route>
        </AppContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByTestId("message-input")).toBeInTheDocument();
    expect(screen.getByTestId("send-button")).toBeInTheDocument();
  });

  it("should send a new message", async () => {
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
          }}
        >
          <SocketContext.Provider value={{ socket }}>
            <Route path="/conversation/:conversationId">
              <ChatViewInput />
            </Route>
          </SocketContext.Provider>
        </AppContext.Provider>
      </MemoryRouter>
    );

    const messageInput = screen.getByTestId("message-input");
    await waitFor(() => {
      fireEvent.change(messageInput, {
        target: { value: message },
      });
    });
    expect(messageInput).toHaveValue(message);
    await waitFor(() => {
      fireEvent.click(screen.getByTestId("send-button"));
    });
    expect(socketEmitMock).toHaveBeenCalledWith("sendMessage", {
      body: message,
      conversationId: conversation.conversationId,
      senderId: currentUser.userId,
    });
  });

  it("should emit message typing events", async () => {
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
          }}
        >
          <SocketContext.Provider value={{ socket }}>
            <Route path="/conversation/:conversationId">
              <ChatViewInput />
            </Route>
          </SocketContext.Provider>
        </AppContext.Provider>
      </MemoryRouter>
    );

    const messageInput = screen.getByTestId("message-input");
    await waitFor(() => {
      fireEvent.change(messageInput, {
        target: { value: message },
      });
    });
    expect(socketEmitMock).toHaveBeenCalledWith("startTyping", {
      conversationId: conversation.conversationId,
      userId: currentUser.userId,
    });
    await waitFor(() => {
      fireEvent.change(messageInput, {
        target: { value: "" },
      });
    });
    expect(socketEmitMock).toHaveBeenCalledWith("endTyping", {
      conversationId: conversation.conversationId,
      userId: currentUser.userId,
    });
  });

  it("should render & click on join channel button to join a channel ", async () => {
    const socketEmitMock = jest.spyOn(socket, "emit");

    render(
      <MemoryRouter
        initialEntries={[`/conversation/${channel.conversationId}/`]}
      >
        <AppContext.Provider
          value={{
            currentUser,
            users: [currentUser, user2],
            conversations: [channel],
          }}
        >
          <SocketContext.Provider value={{ socket }}>
            <Route path="/conversation/:conversationId">
              <ChatViewInput />
            </Route>
          </SocketContext.Provider>
        </AppContext.Provider>
      </MemoryRouter>
    );

    const joinButton = screen.getByTestId("join-button");
    expect(joinButton).toBeInTheDocument();
    await waitFor(() => {
      fireEvent.click(joinButton);
    });
    expect(socketEmitMock).toHaveBeenCalledWith("joinChannel", {
      conversationId: channel.conversationId,
      userId: currentUser.userId,
    });
  });
});
