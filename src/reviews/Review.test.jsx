import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from "../testUtils";
import Review from './Review';

const review = {
    id: 1,
    comment: 'user review',
    created_at: 'date1',
    user_id: 2,
    username: 'user1',
    volume_id: 'vol1'
}

it('renders the Review component', () => {
    render(
        <MemoryRouter>
            <UserProvider>
                <Review userReview={review} />
            </UserProvider>
        </MemoryRouter>
    )
})

it('matches with snapshot', async () => {
    const { asFragment } = render(
        <MemoryRouter>
            <UserProvider>
                <Review userReview={review} />
            </UserProvider>
        </MemoryRouter>
    )

    expect(asFragment()).toMatchSnapshot();
})

it('has correct review data', async () => {
    render(
        <MemoryRouter>
            <UserProvider>
                <Review userReview={review} />
            </UserProvider>
        </MemoryRouter>
    )

    expect(screen.getByText('My Review:')).toBeInTheDocument();
    expect(screen.getByText('user review')).toBeInTheDocument();
});