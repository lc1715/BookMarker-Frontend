import { it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReadBooks from './ReadBooks';
import { UserProvider } from '../testUtils';

const mockReadBook = [{
    id: 1,
    has_read: true,
    title: 'title1',
    author: 'auth1',
    volumeId: 'vol1',
    category: 'cat1',
    description: 'desc1',
    image: 'img1',
    publisher: 'pub1',
    user_id: 2
}]

// Mocks the getReadBooks API call in BookMarkerApi class
vi.mock('../api/api', () => ({
    default: {
        getReadBooks: vi.fn(async () => mockReadBook),
    },
}));

it('renders ReadBooks component', () => {
    render(
        <MemoryRouter>
            <UserProvider>
                <ReadBooks />
            </UserProvider>
        </MemoryRouter>
    )
})

it('matches with snapshot', async () => {
    const { asFragment } = render(
        <MemoryRouter>
            <UserProvider>
                <ReadBooks />
            </UserProvider>
        </MemoryRouter>
    )

    await waitFor(() => {
        expect(screen.getByText('title1')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
})

it('renders the correct read book data', async () => {
    render(
        <MemoryRouter>
            <UserProvider>
                <ReadBooks />
            </UserProvider>
        </MemoryRouter>
    )

    await waitFor(() => {
        expect(screen.getByText('My Read Books:')).toBeInTheDocument();
        expect(screen.getByText('title1')).toBeInTheDocument();
    });
})

