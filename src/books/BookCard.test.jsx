import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookCard from './BookCard';

const book = {
    title: 'title1',
    author: 'auth1',
    volumeId: 'vol1',
    category: 'cat1',
    description: 'desc1',
    image: 'img1',
    publisher: 'pub1',
}

it('renders the BookCard component', () => {
    render(
        <MemoryRouter>
            <BookCard book={book} />
        </MemoryRouter>
    )
})

it('matches with snapshot', () => {
    const { asFragment } = render(
        <MemoryRouter>
            <BookCard book={book} />
        </MemoryRouter>
    )

    expect(asFragment()).toMatchSnapshot();
})

it('renders the book information', () => {
    render(
        <MemoryRouter>
            <BookCard book={book} />
        </MemoryRouter>
    )

    expect(screen.getByText('title1')).toBeInTheDocument();
})
