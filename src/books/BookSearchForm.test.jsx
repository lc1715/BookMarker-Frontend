import { it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookSearchForm from './BookSearchForm';

it('renders the BookSearchForm component', () => {
    render(
        <MemoryRouter>
            <BookSearchForm />
        </MemoryRouter>
    )
})

it('matches with snapshot', () => {
    const { asFragment } = render(
        <MemoryRouter>
            <BookSearchForm />
        </MemoryRouter>
    )

    expect(asFragment()).toMatchSnapshot();
})