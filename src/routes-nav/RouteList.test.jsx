import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import RouteList from "./RouteList";
import { UserProvider } from "../testUtils";

it('renders the RouteList component', () => {
    render(
        <MemoryRouter>
            <UserProvider>
                <RouteList />
            </UserProvider>
        </MemoryRouter>
    )
})

it('goes to the correct route', () => {
    render((
        <MemoryRouter initialEntries={['/login']}>
            <UserProvider currentUser={null}>
                <RouteList />
            </UserProvider>
        </MemoryRouter>
    ));

    expect(screen.getByText('Login Form')).toBeInTheDocument();
});