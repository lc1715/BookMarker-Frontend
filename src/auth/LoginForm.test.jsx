import { it, expect } from 'vitest';
import { screen, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'
import LoginForm from './LoginForm';

it('renders LoginForm component', () => {
    render(
        <MemoryRouter>
            <LoginForm />
        </MemoryRouter>
    );
})

it('matches with snapshot', () => {
    const { asFragment } = render(
        <MemoryRouter>
            <LoginForm />
        </MemoryRouter>
    )

    expect(asFragment()).toMatchSnapshot();
})


it('should render the element containing the text Login Form', () => {
    render(
        <MemoryRouter>
            <LoginForm />
        </MemoryRouter>
    )

    expect(screen.getByText('Login Form')).toBeInTheDocument()
})
