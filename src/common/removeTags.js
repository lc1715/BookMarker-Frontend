/**Function to remove HTML tags in text
 * Used for the book descriptions in BookCard and BookDetail components
 * info is from: https://www.geeksforgeeks.org/how-to-strip-out-html-tags-from-a-string-using-javascript/
 */

function removeHtmlTags(string) {
    let doc = new DOMParser().parseFromString(string, 'text/html');
    return doc.body.textContent || "";
};

export default removeHtmlTags;