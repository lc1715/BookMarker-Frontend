import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import NavBar from "./NavBar";
import { UserProvider } from "../testUtils";

it('renders the NavBar component', () => {
    render(
        <MemoryRouter>
            <UserProvider>
                <NavBar />
            </UserProvider>
        </MemoryRouter>
    )
})

it('matches with snapshot when logged in', async () => {
    const { asFragment } = render(
        <MemoryRouter>
            <UserProvider>
                <NavBar />
            </UserProvider>
        </MemoryRouter>
    )

    expect(asFragment()).toMatchSnapshot();
})

it("matches with snapshot when logged out", function () {
    const { asFragment } = render(
        <MemoryRouter>
            <UserProvider currentUser={null}>
                <NavBar />
            </UserProvider>
        </MemoryRouter>
    )

    expect(asFragment()).toMatchSnapshot();
});
