import { it, expect } from 'vitest';
import { screen, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignupForm from './SignupForm';

it('renders the Signup Form component', () => {
    render(
        <MemoryRouter>
            <SignupForm />
        </MemoryRouter>
    )
})

it('matches with snapshot', () => {
    const { asFragment } = render(
        <MemoryRouter>
            <SignupForm />
        </MemoryRouter>
    )

    expect(asFragment()).toMatchSnapshot();
})

it('should render the element containing the text Signup Form', () => {
    render(
        <MemoryRouter>
            <SignupForm />
        </MemoryRouter>
    )

    expect(screen.getByText('Signup Form')).toBeInTheDocument()
})