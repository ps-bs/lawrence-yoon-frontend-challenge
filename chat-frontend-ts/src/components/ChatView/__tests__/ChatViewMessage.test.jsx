import { render, screen } from "../../../test-utils";
import { ChatViewMessage } from "../Message";
import { AppContext } from "../../../App/context";

describe("ChatViewMessage", () => {
  it("should render message contents", () => {
    const user = {
      socketId: "1",
      userId: "1",
      username: "user",
    };
    const message = {
      body: "message",
      conversationId: "1",
      createdAt: new Date(),
      messageId: "1",
      senderId: user.userId,
    };

    render(
      <AppContext.Provider value={{ users: [user] }}>
        <ChatViewMessage {...message} />
      </AppContext.Provider>
    );

    expect(screen.getByText(user.username)).toBeInTheDocument();
    expect(screen.getByText(message.body)).toBeInTheDocument();
  });
});
