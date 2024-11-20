import { useState, useEffect } from 'react';
import LoadSpinner from '../common/LoadSpinner';
import BookList from '../books/BookList';
import getNYTBooks from '../common/loadNYTBooks'
import useLocalStorage from '../hooks/useLocalStorage';


/**Homepage component
 * 
 * - calls getNYTBooks function to get nytbooks and checks if nytbooks contain new nyt books and timestamp
 *   or the stored nyt books from local storage
 * - if new nyt books and time stamp are returned, store them into local storage
 * - passes nytbooks and label for nyt books as props to BookList component
 * 
 * Route: '/'
 */
function Homepage() {
    const [nytBooks, setNytBooks] = useState(null);
    const [nytBookList, setNytBookList] = useLocalStorage('nytBooks');
    const [nytTimestamp, setNytTimestamp] = useLocalStorage('nytBooksTimestamp');

    // Runs at first render to get nyt book list and timestamp
    useEffect(() => {
        async function loadNYTBooks() {
            // gets stored nytbooks or new nytbooks and timestamp
            let bookList = await getNYTBooks();

            // check if new nyt book list and current timestamp exists and add to local storage
            if (bookList?.newBooks && bookList.currentTimeStamp) {
                let newBooks = bookList.newBooks;
                let currentTimeStamp = bookList.currentTimeStamp;

                // check if nyt books is empty
                if (newBooks.length === 0) {
                    setNytBooks(newBooks);
                    return;
                }
                // add new nyt books and current time stamp into local storage
                setNytBookList(JSON.stringify(newBooks));
                setNytTimestamp(currentTimeStamp);

                // set new nyt books to state
                setNytBooks(newBooks);
            } else {
                // set stored nyt books to state
                setNytBooks(bookList?.storedBooks);
            }
        };

        loadNYTBooks();
    }, []);

    if (!nytBooks) return <LoadSpinner />;

    return (
        <div>
            <BookList books={nytBooks} booksLabel={'NYT Bestsellers'} />
        </div>
    )
};

export default Homepage;
