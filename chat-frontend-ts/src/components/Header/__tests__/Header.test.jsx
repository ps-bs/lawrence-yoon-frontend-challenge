import { render, screen } from "../../../test-utils";
import { MemoryRouter } from "react-router-dom";
import { Header } from "..";
import { AppContext } from "../../../App/context";

describe("Header", () => {
  it("should render logo and username", () => {
    const currentUser = {
      socketId: "1",
      userId: "1",
      username: "user",
    };

    render(
      <MemoryRouter>
        <AppContext.Provider value={{ currentUser }}>
          <Header />
        </AppContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByText(currentUser.username)).toBeInTheDocument();
  });

  it("shouldn't render username", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('Pick a username')).toBeInTheDocument();
  });
});
