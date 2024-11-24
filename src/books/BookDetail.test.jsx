import { it, } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookDetail from './BookDetail';
import { UserProvider } from '../testUtils';

const mockBook = {
    title: 'title1',
    author: ['auth1'],
    volumeId: 'vol1',
    category: ['cat1'],
    description: 'desc1',
    image: 'img1',
    publisher: 'pub1',
}

const mockReviews = [{
    id: 1,
    comment: 'comment1',
    created_at: 'date1',
    username: 'user1',
    user_id: 2,
    volume_id: 'vol1'
}]

const mockRating = {
    id: 1,
    rating: 5,
    user_id: 2,
    volume_id: 'vol1'
}

const mockSavedBook = {
    ...mockBook,
    id: 1,
    has_read: true,
    user_id: 2,
    review: {
        ...mockReviews[0]
    },
    rating: { ...mockRating }
}

//mocks the useParams hook in react-router-dom
vi.mock('react-router-dom', async () => {
    await vi.importActual('react-router-dom');
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: () => ({ bookId: 'vol1', bookIdType: 'volumeId' }),
    };
});

//mocks the API calls in BookMarkerApi class
vi.mock('../api/api', () => ({
    default: {
        getGoogleBook: vi.fn(async () => mockBook),
        getAllReviews: vi.fn(async () => mockReviews),
        getSavedBook: vi.fn(async () => mockRating),
        getRating: vi.fn(async () => mockSavedBook)
    },
}));

afterEach(() => {
    vi.clearAllMocks();
});

it('renders BookDetail component', async () => {
    await act(async () => render(
        <MemoryRouter>
            <UserProvider>
                <BookDetail />
            </UserProvider>
        </MemoryRouter>
    ))
})

it('matches with snapshot', async () => {
    const { asFragment } = render(
        <MemoryRouter>
            <UserProvider>
                <BookDetail />
            </UserProvider>
        </MemoryRouter>
    )

    await waitFor(() => {
        expect(screen.getByText('title1')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
})

it('has the correct book data', async () => {
    render(
        <MemoryRouter>
            <UserProvider>
                <BookDetail />
            </UserProvider>
        </MemoryRouter>
    )

    await waitFor(() => {
        expect(screen.getByText('title1')).toBeInTheDocument();
        expect(screen.getByText('All Reviews')).toBeInTheDocument();
        const stars = screen.getAllByText('★');
        expect(stars).toHaveLength(5);
    });
})
