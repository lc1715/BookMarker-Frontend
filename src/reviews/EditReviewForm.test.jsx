import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from "../testUtils";
import EditReviewForm from './EditReviewForm';

const review = {
    id: 1,
    comment: 'my review',
    created_at: 'date1',
    user_id: 2,
    username: 'user1',
    volume_id: 'vol1'
}

it('renders the EditReviewForm component', () => {
    render(
        <MemoryRouter>
            <UserProvider>
                <EditReviewForm userReview={review} />
            </UserProvider>
        </MemoryRouter>
    )
})

it('matches with snapshot', async () => {
    const { asFragment } = render(
        <MemoryRouter>
            <UserProvider>
                <EditReviewForm userReview={review} />
            </UserProvider>
        </MemoryRouter>
    )

    expect(asFragment()).toMatchSnapshot();
})

it('has the correct edit review data', async () => {
    render(
        <MemoryRouter>
            <UserProvider>
                <EditReviewForm userReview={review} />
            </UserProvider>
        </MemoryRouter>
    )

    expect(screen.getByText('my review')).toBeInTheDocument();
});