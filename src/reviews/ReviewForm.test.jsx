import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from "../testUtils";
import ReviewForm from './ReviewForm';

it('renders the ReviewForm component', () => {
    render(
        <MemoryRouter>
            <UserProvider>
                <ReviewForm />
            </UserProvider>
        </MemoryRouter>
    )
})

it('matches with snapshot', async () => {
    const { asFragment } = render(
        <MemoryRouter>
            <UserProvider>
                <ReviewForm />
            </UserProvider>
        </MemoryRouter>
    )

    expect(asFragment()).toMatchSnapshot();
})

it('has correct review form text', async () => {
    render(
        <MemoryRouter>
            <UserProvider>
                <ReviewForm />
            </UserProvider>
        </MemoryRouter>
    )

    expect(screen.getByLabelText('Add Review')).toBeInTheDocument();
});
