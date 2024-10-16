import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BookMarkerApi from '../api/api';
import LoadSpinner from '../common/LoadSpinner';


function BookDetail() {
    const [book, setBook] = useState(null);

    const { bookId, bookIdType } = useParams();   //get params. from BookCard
    console.log('bookId=', bookId, 'bookIdType=', bookIdType)

    //if bookId is isbn, call API getGoogleBookFromNYT method to get book detail
    //if bookId is volumeId, call API getGoogleBook method to get book detail
    useEffect(() => {
        async function getBookDetails() {
            try {
                if (bookIdType === 'isbn') {
                    setBook(await BookMarkerApi.getGoogleBookFromNYT(bookId));
                } else if (bookIdType === 'volumeId') {
                    setBook(await BookMarkerApi.getGoogleBook(bookId));
                }
            } catch (err) {
                console.log(err)
            }
        }

        getBookDetails()
    }, [bookId, bookIdType]);

    console.log('book=', book)

    if (!book) return <LoadSpinner />

    return (
        <div>
            <img src={book.image} />
            <p>Title: {book.title}</p>
            <p>Author: {book.author}</p>
            <p>Publisher: {book.publisher}</p>
            <p>Category: {book.category}</p>
            <p>Description: {removeHtmlTags(book.description)}</p>
        </div>
    )
};

function removeHtmlTags(string) {
    let doc = new DOMParser().parseFromString(string, 'text/html');
    return doc.body.textContent || "";
};

export default BookDetail;

