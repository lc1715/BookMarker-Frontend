import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BookMarkerApi from '../api/api';
import LoadSpinner from '../common/LoadSpinner';
import { useContext } from 'react';
import UserContext from '../auth/UserContext';
import ShowAlert from '../common/ShowAlert';


function BookDetail() {
    const [book, setBook] = useState(null);
    console.log('book=', book)

    const [error, setError] = useState(null);
    console.log('error=', error)

    const { currentUser, hasAlreadySavedBook, saveBook } = useContext(UserContext);

    const { bookId, bookIdType } = useParams();
    console.log('bookId=', bookId, 'bookIdType=', bookIdType)


    //both API methods in useEffect will return a Google Book with volumeId
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


    async function addBook(evt) {
        if (currentUser) {

            //check if has_read value is true or false
            let has_read_value;

            if (evt.target.innerText === 'Read') {
                has_read_value = true;
            } else {
                has_read_value = false;
            }

            //if book is already saved, then update has_read status. otherwise add book to saved books
            if (hasAlreadySavedBook(book.volumeId)) {
                let result = await BookMarkerApi.changeBookStatus(
                    book.volumeId,
                    currentUser.username,
                    { has_read: has_read_value })
            } else {
                try {
                    let result = await saveBook(book.volumeId, {
                        volume_id: book.volumeId,
                        title: book.title,
                        author: book.author,
                        publisher: book.publisher,
                        category: book.category,
                        description: book.description,
                        image: book.image,
                        has_read: has_read_value
                    });

                } catch (err) {
                    console.log(err);
                }
            }
        } else {
            setError('Please log in or sign up')
        }
    };

    if (!book) return <LoadSpinner />

    return (
        <div>
            <img src={book.image} />
            <p>Title: {book.title}</p>
            <p>Author: {book.author}</p>
            <p>Publisher: {book.publisher}</p>
            <p>Category: {book.category}</p>
            <p>Description: {removeHtmlTags(book.description)}</p>


            <button onClick={addBook}>Read</button>

            <button onClick={addBook}>Wish To Read</button>

            {error ? < ShowAlert messages={[error]} /> : null}
        </div>
    )
};

function removeHtmlTags(string) {
    let doc = new DOMParser().parseFromString(string, 'text/html');
    return doc.body.textContent || "";
};

export default BookDetail;


