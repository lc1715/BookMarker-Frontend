import { it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookList from './BookList';

const books = [{
    title: 'title1',
    author: 'auth1',
    volumeId: 'vol1',
    category: 'cat1',
    description: 'desc1',
    image: 'img1',
    publisher: 'pub1',
},
{
    title: 'title2',
    author: 'auth2',
    volumeId: 'vol2',
    category: 'cat2',
    description: 'desc2',
    image: 'img2',
    publisher: 'pub2',
}]

it('renders BookList component', () => {
    render(
        <MemoryRouter>
            <BookList />
        </MemoryRouter>
    )
})

it('matches with snapshot', () => {
    const { asFragment } = render(
        <MemoryRouter>
            <BookList books={books} booksLabel={'testBooks'} />
        </MemoryRouter>
    )

    expect(asFragment()).toMatchSnapshot();
})

it('has the correct book list data', () => {
    render(
        <MemoryRouter>
            <BookList books={books} booksLabel={'testBooks'} />
        </MemoryRouter>
    )

    expect(screen.getByText('title1')).toBeInTheDocument();
    expect(screen.getByText('title2')).toBeInTheDocument();
})
