import {
  render,
  screen,
  within,
  waitFor,
  fireEvent,
} from "../../../test-utils";
import { CreateChannel } from "..";
import { AppContext } from "../../../App/context";
import { SocketContext } from "../../../socket/context";
import socketIOClient from "socket.io-client";
import SocketMock from "socket.io-mock";

jest.mock("socket.io-client");

describe("CreateChannel", () => {
  let socket;
  const currentUser = {
    socketId: "1",
    userId: "1",
    username: "user",
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
      <AppContext.Provider value={{ currentUser }}>
        <SocketContext.Provider value={{ socket }}>
          <CreateChannel />
        </SocketContext.Provider>
      </AppContext.Provider>
    );

    expect(screen.getByText("New channel")).toBeInTheDocument();
    expect(
      screen.getByText("Create a new channel to start chatting:")
    ).toBeInTheDocument();
    expect(screen.getByTestId("channel-name-input")).toBeInTheDocument();
    expect(screen.getByTestId("create-channel-button")).toBeInTheDocument();
  });

  it("should input new channel name and click & tri socket event to create a channel", async () => {
    const socketEmitMock = jest.spyOn(socket, "emit");

    render(
      <AppContext.Provider value={{ currentUser }}>
        <SocketContext.Provider value={{ socket }}>
          <CreateChannel />
        </SocketContext.Provider>
      </AppContext.Provider>
    );

    const channelName = "channel";
    const createChannelButton = screen.getByTestId("create-channel-button");
    const channelNameInput = screen.getByTestId("channel-name-input");
    expect(createChannelButton.disabled).toBeTruthy();
    await waitFor(() => {
      expect(within(channelNameInput).getByRole("textbox")).toHaveValue("");
      fireEvent.change(within(channelNameInput).getByRole("textbox"), {
        target: { value: channelName },
      });
    });
    await waitFor(() => {
      expect(within(channelNameInput).getByRole("textbox")).toHaveValue(
        channelName
      );
      expect(createChannelButton.disabled).toBeFalsy();
      fireEvent.click(createChannelButton);
    });
    expect(within(channelNameInput).getByRole("textbox")).toHaveValue("");
    expect(socketEmitMock).toHaveBeenCalledWith("startChannel", {
      userId: currentUser.userId,
      conversationName: channelName,
    });
  });
});
