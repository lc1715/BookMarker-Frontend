import { expect, it } from 'vitest';
import removeHtmlTags from './removeTags';

it('removes tag from string', () => {
    let string = '<p>Hello!</p>'
    const newString = removeHtmlTags(string);

    expect(newString).toEqual('Hello!')
})


