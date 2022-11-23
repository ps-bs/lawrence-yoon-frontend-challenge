import { render, screen } from "../../../../test-utils";
import { MemoryRouter } from "react-router-dom";
import { ChannelListItem } from "..";

describe("ChannelListItem", () => {
  it("should render channel link", () => {
    const conversation = {
      conversationId: "1",
      conversationName: "conversation",
      userIds: [],
    };

    render(
      <MemoryRouter>
        <ChannelListItem {...conversation} />
      </MemoryRouter>
    );

    expect(screen.getByText(conversation.conversationName)).toBeInTheDocument();
  });
});
