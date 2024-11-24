import { it, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../testUtils';
import WishToReadBooks from './WishToReadBooks';

const mockWishToReadBook = [{
    id: 1,
    has_read: false,
    title: 'title1',
    author: 'auth1',
    volumeId: 'vol1',
    category: 'cat1',
    description: 'desc1',
    image: 'img1',
    publisher: 'pub1',
    user_id: 2
}]

// Mocks the getWishToReadBooks API call in BookMarkerApi class
vi.mock('../api/api', () => ({
    default: {
        getWishBooks: vi.fn(async () => mockWishToReadBook),
    },
}));

it('renders WishToReadBooks component', async () => {
    await act(async () => render(
        <MemoryRouter>
            <UserProvider>
                <WishToReadBooks />
            </UserProvider>
        </MemoryRouter>
    ))
})

it('matches with snapshot', async () => {
    const { asFragment } = render(
        <MemoryRouter>
            <UserProvider>
                <WishToReadBooks />
            </UserProvider>
        </MemoryRouter>
    )

    await waitFor(() => {
        expect(screen.getByText('title1')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
})

it('renders the correct wish to read book data', async () => {
    render(
        <MemoryRouter>
            <UserProvider>
                <WishToReadBooks />
            </UserProvider>
        </MemoryRouter>
    )

    await waitFor(() => {
        expect(screen.getByText('My Wish To Read Books:')).toBeInTheDocument();
        expect(screen.getByText('title1')).toBeInTheDocument();
    });
})
