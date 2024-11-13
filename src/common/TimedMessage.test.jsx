import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TimedMessage from './TimedMessage';

const mockSetError = vi.fn();

it('renders the TimedMessage component', () => {
    render(
        <TimedMessage />
    )
})

it('matches with snapshot', function () {
    let message = 'unable to access';
    const { asFragment } = render(
        <TimedMessage setState={mockSetError} type='error' message={message} />
    );

    expect(asFragment()).toMatchSnapshot();
});

it('renders the correct message prop', () => {
    const message = 'please login or signup'
    render(
        <TimedMessage setState={mockSetError} type='error' message={message} />
    )

    expect(screen.getByText('please login or signup')).toBeInTheDocument();
})
