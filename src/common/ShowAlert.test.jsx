import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ShowAlert from './ShowAlert';

it('renders the ShowAlert component', () => {
    render(
        <ShowAlert />
    )
})

it('matches with snapshot for error', function () {
    let messages = ['not working correctly'];

    const { asFragment } = render(
        <ShowAlert type='error' messages={messages} />
    );

    expect(asFragment()).toMatchSnapshot();
});

it('matches with snapshot for success', function () {
    let messages = ['successful'];

    const { asFragment } = render(
        <ShowAlert type='success' messages={messages} />
    );

    expect(asFragment()).toMatchSnapshot();
});

it('renders correct message on the page', function () {
    let messages = ['new message'];

    render(
        <ShowAlert type="success" messages={messages} />
    );

    expect(screen.getByText('new message')).toBeInTheDocument();
});