import { expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import AllReviews from './AllReviews';

const allReviews = [{
    id: 1,
    comment: 'comment1',
    created_at: 'date1',
    username: 'user1',
    user_id: 2,
    volume_id: 'vol1'
}]

it('renders the AllReviews component', () => {
    render(
        <AllReviews allReviews={allReviews} />
    )
})

it('matches with snapshot', async () => {
    const { asFragment } = render(
        <AllReviews allReviews={allReviews} />
    )

    expect(asFragment()).toMatchSnapshot();
})

it('has the correct reviews data', async () => {
    render(
        <AllReviews allReviews={allReviews} />
    )

    expect(screen.getByText('comment1')).toBeInTheDocument();
});
