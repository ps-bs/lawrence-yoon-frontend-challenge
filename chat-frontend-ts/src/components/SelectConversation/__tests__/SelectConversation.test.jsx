import {
  render,
  screen,
  waitFor,
  within,
  fireEvent,
} from "../../../test-utils";
import UserEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { SelectConversation } from "..";
import { AppContext } from "../../../App/context";
import { SocketContext } from "../../../socket/context";
import socketIOClient from "socket.io-client";
import SocketMock from "socket.io-mock";

jest.mock("socket.io-client");

describe("SelectConversation", () => {
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

  beforeEach(() => {
    socket = new SocketMock();
    socketIOClient.mockReturnValue(socket);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render all components", () => {
    render(
      <AppContext.Provider value={{ currentUser, users: [currentUser] }}>
        <SocketContext.Provider value={{ socket }}>
          <SelectConversation />
        </SocketContext.Provider>
      </AppContext.Provider>
    );

    expect(screen.getByText("New message")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Select an existing conversation from the left or pick a new user here to start chatting:"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByTestId("user-select")).toBeInTheDocument();
    expect(screen.getByTestId("start-conversation-button")).toBeInTheDocument();
  });

  it("should select a user and create a new conversation with the selected user", async () => {
    const socketEmitMock = jest.spyOn(socket, "emit");

    render(
      <AppContext.Provider
        value={{ currentUser, users: [currentUser, user2], conversations: [] }}
      >
        <SocketContext.Provider value={{ socket }}>
          <SelectConversation />
        </SocketContext.Provider>
      </AppContext.Provider>
    );

    const startConversationButton = screen.getByTestId(
      "start-conversation-button"
    );
    expect(startConversationButton.disabled).toBeTruthy();
    expect(screen.getByText("Select one")).toBeInTheDocument();
    await waitFor(() => {
      UserEvent.click(
        within(screen.getByTestId("user-select")).getByRole("button")
      );
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText(user2.username));
    });
    await waitFor(() => {
      expect(screen.getByText(user2.username)).toBeInTheDocument();
      expect(startConversationButton.disabled).toBeFalsy();
      fireEvent.click(startConversationButton);
    });
    expect(socketEmitMock).toHaveBeenCalledWith("startConversation", {
      userId: currentUser.userId,
      recipientId: user2.userId,
    });
  });

  it("should select a user and navigates to an existing conversation with the selected user", async () => {
    const socketEmitMock = jest.spyOn(socket, "emit");

    render(
      <MemoryRouter>
        <AppContext.Provider
          value={{
            currentUser,
            users: [currentUser, user2],
            conversations: [conversation],
          }}
        >
          <SocketContext.Provider value={{ socket }}>
            <SelectConversation />
          </SocketContext.Provider>
        </AppContext.Provider>
      </MemoryRouter>
    );

    const startConversationButton = screen.getByTestId(
      "start-conversation-button"
    );
    expect(startConversationButton.disabled).toBeTruthy();
    expect(screen.getByText("Select one")).toBeInTheDocument();
    await waitFor(() => {
      UserEvent.click(
        within(screen.getByTestId("user-select")).getByRole("button")
      );
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText(user2.username));
    });
    await waitFor(() => {
      expect(screen.getByText(user2.username)).toBeInTheDocument();
      expect(startConversationButton.disabled).toBeFalsy();
      fireEvent.click(startConversationButton);
    });
    expect(socketEmitMock).not.toHaveBeenCalled();
  });
});
