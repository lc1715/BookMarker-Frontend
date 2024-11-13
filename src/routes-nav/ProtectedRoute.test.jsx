import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { UserProvider } from "../testUtils";
import ProtectedRoute from "./ProtectedRoute";

it('renders the ProtectedRoute component', () => {
    render(
        <MemoryRouter>
            <UserProvider>
                <ProtectedRoute />
            </UserProvider>
        </MemoryRouter>
    )
})

it('matches with snapshot when logged in', async () => {
    const { asFragment } = render(
        <MemoryRouter>
            <UserProvider>
                <ProtectedRoute />
            </UserProvider>
        </MemoryRouter>
    )

    expect(asFragment()).toMatchSnapshot();
})

it('matches with snapshot when logged out', function () {
    const { asFragment } = render(
        <MemoryRouter>
            <UserProvider currentUser={null}>
                <ProtectedRoute />
            </UserProvider>
        </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
});
