import { Link } from "react-router-dom";

/** BookCard 
 * 
 * - receives book as prop
 * - check if book contains isbn or volumeId property 
 * - {book} = {isbn or volumeId, title, author, description, image}
 * - show the book info 
 * - component using BookCard: BookList
 * 
 */

function BookCard({ book }) {
    console.log('book=', book)

    let bookId;
    let bookIdType;

    if (book.isbn) {
        bookId = book.isbn;
        bookIdType = 'isbn';
    } else {
        bookId = book.volumeId;
        bookIdType = 'volumeId'
    }

    return (
        <div>
            <Link to={`/books/${bookIdType}/${bookId}`}>
                <img src={book.image} />
                <p>Title: {book.title}</p>
                <p>Author: {book.author}</p>
                <p>Description: {removeHtmlTags(book.description)}</p>
            </Link>
        </div>
    )
};

export default BookCard;

function removeHtmlTags(string) {
    let doc = new DOMParser().parseFromString(string, 'text/html');
    return doc.body.textContent || "";
};
