import { expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../testUtils';
import Rating from './Rating';

it('renders Rating component', () => {
    render(
        <MemoryRouter>
            <UserProvider>
                <Rating />
            </UserProvider>
        </MemoryRouter>
    )
})

it('matches with snapshot', async () => {
    const { asFragment } = render(
        <MemoryRouter>
            <UserProvider>
                <Rating />
            </UserProvider>
        </MemoryRouter>
    )

    expect(asFragment()).toMatchSnapshot();
})

it('has the correct rating data', async () => {
    render(
        <MemoryRouter>
            <UserProvider>
                <Rating />
            </UserProvider>
        </MemoryRouter>
    )

    expect(screen.getAllByText('★')).toHaveLength(5);
});
