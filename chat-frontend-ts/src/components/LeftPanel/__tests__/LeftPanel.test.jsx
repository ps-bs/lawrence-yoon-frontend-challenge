import { render, screen } from "../../../test-utils";
import { MemoryRouter } from "react-router-dom";
import { LeftPanel } from "..";
import { AppContext } from "../../../App/context";

describe("LeftPanel", () => {
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

  it("should render all components - texts, channels, direct messages", () => {
    render(
      <MemoryRouter>
        <AppContext.Provider
          value={{
            currentUser,
            users: [currentUser, user2],
            conversations: [conversation, channel],
          }}
        >
          <LeftPanel />
        </AppContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("New message")).toBeInTheDocument();
    expect(screen.getByText("New channel")).toBeInTheDocument();
    expect(screen.getByText("Channels")).toBeInTheDocument();
    expect(screen.getByText("Direct Messages")).toBeInTheDocument();
    expect(screen.getByText(channel.conversationName)).toBeInTheDocument();
    expect(screen.getByText(user2.username)).toBeInTheDocument();
  });
});
