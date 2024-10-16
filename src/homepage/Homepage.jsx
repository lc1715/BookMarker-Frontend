import { useState, useEffect } from 'react';
import LoadSpinner from '../common/LoadSpinner';
import BookList from '../books/BookList';
import getNYTBooks from '../common/loadNYTBooks'
import useLocalStorage from '../hooks/useLocalStorage';


function Homepage() {
    const [nytBooks, setNytBooks] = useState(null);
    const [nytBookList, setNytBookList] = useLocalStorage('nytBooks');
    const [nytTimestamp, setNytTimestamp] = useLocalStorage('nytBooksTimestamp');
    console.log('nytBooks=', nytBooks)

    //runs at first render to get nyt book list and timestamp
    useEffect(() => {
        async function loadNYTBooks() {
            let bookList = await getNYTBooks();

            //check if new nyt book list and current timestamp exists
            if (bookList.newBooks && bookList.currentTimeStamp) {
                let newBooks = bookList.newBooks;
                let currentTimeStamp = bookList.currentTimeStamp;
                //check if nyt books is empty
                if (newBooks.length === 0) {
                    setNytBooks(newBooks);
                    return;
                }
                //add new nyt books and current time stamp into local storage
                setNytBookList(JSON.stringify(newBooks));
                setNytTimestamp(currentTimeStamp);
                //set new nyt books to state
                setNytBooks(newBooks);
            } else {
                //set stored nyt books to state
                setNytBooks(bookList.storedBooks);
            }
        };

        loadNYTBooks();
    }, []);

    if (!nytBooks) return <LoadSpinner />;

    return (
        <div>
            {nytBooks.length ?
                <BookList nytBooks={nytBooks} />
                :
                <p>Sorry, no results were found!</p>
            }
        </div>
    )
};

export default Homepage;

