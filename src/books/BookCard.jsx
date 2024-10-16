import { Link } from "react-router-dom";

/** BookCard 
 * 
 * - receives book as prop
 * - check if book contains isbn or volumeId property
 * - {book} = {isbn or volumeId, title, author, description, image}
 * - show a book info 
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
        <Link to={`/books/${bookIdType}/${bookId}`}>
            <img src={book.image} />
            <p>Title: {book.title}</p>
            <p>Author: {book.author}</p>
            <p>Description: {book.description}</p>
        </Link>
    )
};

export default BookCard;

