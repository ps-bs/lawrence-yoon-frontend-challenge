import { render, screen } from "../../../../test-utils";
import { MemoryRouter } from "react-router-dom";
import { ConversationListItem } from "..";

describe("ConversationListItem", () => {
  const conversationId = "1";
  const user1 = {
    userId: "1",
    username: "user",
  };
  const user2 = {
    ...user1,
    socketId: "1",
  };

  it("should render conversation link for online user", () => {
    render(
      <MemoryRouter>
        <ConversationListItem conversationId={conversationId} {...user2} />
      </MemoryRouter>
    );

    expect(screen.getByText(user1.username)).toBeInTheDocument();
    expect(screen.getByTestId("status-online")).toBeInTheDocument();
  });

  it("should render conversation link for offline user", () => {
    render(
      <MemoryRouter>
        <ConversationListItem conversationId={conversationId} {...user1} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("status-offline")).toBeInTheDocument();
  });

  it("should render conversation link for typing user", () => {
    render(
      <MemoryRouter>
        <ConversationListItem
          conversationId={conversationId}
          typing
          {...user2}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId("status-typing")).toBeInTheDocument();
  });
});
