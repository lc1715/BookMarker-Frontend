import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from "../testUtils";
import ProfileForm from './ProfileForm';

it('renders the Profile Form component', () => {
    render(
        <MemoryRouter>
            <UserProvider>
                <ProfileForm />
            </UserProvider>
        </MemoryRouter>
    )
})

it('matches with snapshot', () => {
    const { asFragment } = render(
        <MemoryRouter>
            <UserProvider>
                <ProfileForm />
            </UserProvider>
        </MemoryRouter>
    )

    expect(asFragment()).toMatchSnapshot();
})

it('should correctly render the text User Profile', () => {
    render(
        <MemoryRouter>
            <UserProvider>
                <ProfileForm />
            </UserProvider>
        </MemoryRouter>
    )

    expect(screen.getByText('User Profile')).toBeInTheDocument()
})