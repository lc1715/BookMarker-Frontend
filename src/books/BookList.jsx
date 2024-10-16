import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookCard from "./BookCard";
import LoadSpinner from "../common/LoadSpinner";
import BookSearchForm from "./BookSearchForm";
import BookMarkerApi from "../api/api";
import ShowAlert from "../common/ShowAlert";

/** BookList - shows a list of nyt books or google books
 * 
 * - prop: nyt books
 * - state: google books
 * - only set google books as state if term received from search form submission
 * - if term received, fetch the google books from Google Books API and update state 
 * - render google books if state exists otherwise render nyt books
 * - components using BooksList: Homepage, BookSearchForm
 * 
 * Route: '/books/search/:term'
 */

function BookList({ nytBooks }) {
    const [googleBooks, setGoogleBooks] = useState(null);
    const { term } = useParams();   //gets search term from book search form

    // if term exists, fetches the google books from the Google Books API
    // sets the state
    useEffect(function getGoogleBooks() {
        if (term != undefined) {
            try {
                async function getBooks() {
                    const result = await BookMarkerApi.getGoogleBooksList(term);
                    setGoogleBooks(result)
                }
                getBooks();
            } catch (err) {
                console.log(err);
            }
        }
    }, [term]);
    console.log('googleBooks=', googleBooks, 'nytBooks=', nytBooks)


    if (!googleBooks && !nytBooks) {
        return (
            <div>
                <BookSearchForm />
                <LoadSpinner />
            </div>
        )
    }

    if (nytBooks) {
        return (
            <div>
                <BookSearchForm />
                {nytBooks.map((book) => (
                    <BookCard book={book} />
                ))
                }
            </div>
        )
    }

    if (googleBooks.length) {
        return (
            <div>
                <BookSearchForm />
                {googleBooks.map((book) => (
                    <BookCard book={book} />
                ))
                }
            </div>
        )
    } else {
        return (
            <div>
                <BookSearchForm />
                <ShowAlert messages={['Sorry, no results were found!']} />
                {/* <p style={{ color: 'red' }}>Sorry, no results were found!</p> */}
            </div>
        )
    }
};

export default BookList;


