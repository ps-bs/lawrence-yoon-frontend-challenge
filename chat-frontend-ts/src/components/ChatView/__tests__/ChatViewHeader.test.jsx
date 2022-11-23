import { render, screen } from "../../../test-utils";
import { MemoryRouter } from "react-router-dom";
import { Route } from "react-router";
import { ChatViewHeader } from "../Header";
import { AppContext } from "../../../App/context";

describe("ChatViewHeader", () => {
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
    userIds: [currentUser],
  };

  it("should render channel header", () => {
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
          <Route path="/conversation/:conversationId">
            <ChatViewHeader />
          </Route>
        </AppContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(channel.conversationName)).toBeInTheDocument();
    expect(
      screen.getByText(`Joined users: ${channel.userIds.length}`)
    ).toBeInTheDocument();
  });

  it("should render conversation header", () => {
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
            <ChatViewHeader />
          </Route>
        </AppContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(user2.username)).toBeInTheDocument();
  });
});
