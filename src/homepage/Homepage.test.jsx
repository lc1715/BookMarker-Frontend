import { it } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../testUtils';
import Homepage from './Homepage';

it('renders the Homepage component', () => {
    render(
        <MemoryRouter>
            <Homepage />
        </MemoryRouter>
    );
})

it('matches snapshot when user is logged in', () => {
    const { asFragment } = render(
        <MemoryRouter>
            <UserProvider>
                <Homepage />
            </UserProvider>
        </MemoryRouter>
    )
    expect(asFragment()).toMatchSnapshot();
})

it('matches snapshot when user is logged out', () => {
    const { asFragment } = render(
        <MemoryRouter>
            <Homepage />
        </MemoryRouter>
    )
    expect(asFragment()).toMatchSnapshot();
})