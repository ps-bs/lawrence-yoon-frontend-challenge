import {
  render,
  screen,
  waitFor,
  within,
  fireEvent,
} from "../../../test-utils";
import UserEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { UsernameModal } from "..";
import { AppContext } from "../../../App/context";
import { SocketContext } from "../../../socket/context";
import socketIOClient from "socket.io-client";
import SocketMock from "socket.io-mock";

jest.mock("socket.io-client");

describe("UsernameModal", () => {
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
      <MemoryRouter initialEntries={["/?isEditingName=true"]}>
        <AppContext.Provider value={{ currentUser }}>
          <SocketContext.Provider value={{ socket }}>
            <UsernameModal />
          </SocketContext.Provider>
        </AppContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("Edit your name")).toBeInTheDocument();
    expect(
      screen.getByText("Edit how your name displays when others chat with you.")
    ).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByTestId("username-input")).toBeInTheDocument();
    expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
    expect(screen.getByTestId("save-button")).toBeInTheDocument();
  });

  it("should input username", async () => {
    const setCurrentUserMock = jest.fn();

    render(
      <MemoryRouter initialEntries={["/?isEditingName=true"]}>
        <AppContext.Provider
          value={{ currentUser, setCurrentUser: setCurrentUserMock }}
        >
          <SocketContext.Provider value={{ socket }}>
            <UsernameModal />
          </SocketContext.Provider>
        </AppContext.Provider>
      </MemoryRouter>
    );

    const username = "new name";
    const usernameInput = screen.getByTestId("username-input");
    expect(within(usernameInput).getByRole("textbox")).toHaveValue(
      currentUser.username
    );
    await waitFor(() => {
      fireEvent.change(within(usernameInput).getByRole("textbox"), {
        target: { value: username },
      });
    });
    expect(setCurrentUserMock).toHaveBeenCalledWith({
      username,
      userId: currentUser.userId,
    });
  });

  it("should click save button to emit username change event & close dialog", async () => {
    const socketEmitMock = jest.spyOn(socket, "emit");

    render(
      <MemoryRouter initialEntries={["/?isEditingName=true"]}>
        <AppContext.Provider value={{ currentUser }}>
          <SocketContext.Provider value={{ socket }}>
            <UsernameModal />
          </SocketContext.Provider>
        </AppContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("save-button"));
    });
    await waitFor(() => {
      expect(screen.queryByTestId("username-input")).not.toBeInTheDocument();
    });
    expect(socketEmitMock).toHaveBeenCalledWith("username", currentUser);
  });

  it("should click cancel button to close dialog", async () => {
    const socketEmitMock = jest.spyOn(socket, "emit");

    render(
      <MemoryRouter initialEntries={["/?isEditingName=true"]}>
        <AppContext.Provider value={{ currentUser }}>
          <SocketContext.Provider value={{ socket }}>
            <UsernameModal />
          </SocketContext.Provider>
        </AppContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("cancel-button"));
    });
    await waitFor(() => {
      expect(screen.queryByTestId("username-input")).not.toBeInTheDocument();
    });
    expect(socketEmitMock).not.toHaveBeenCalled();
  });
});
