import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookCard from "./BookCard";
import LoadSpinner from "../common/LoadSpinner";
import BookSearchForm from "./BookSearchForm";
import BookMarkerApi from "../api/api";
import ShowAlert from "../common/ShowAlert";

/** BookList 
 * 
 * - prop: nyt bestseller books, user's read books, or user's wish to read books
 * - state: google searched books
 * - only set google books as state if term received from search form submission
 * - if term received, fetch the google books from Google Books API and update state 
 * - render google books if state exists otherwise render prop
 * - components using BooksList: Homepage, BookSearchForm, ReadBooks, WishToReadBooks
 * 
 * Route: '/books/search/:term'
 */

function BookList({ bestsellerBooks, readBooks, wishToReadBooks }) {
    const [searchedBooks, setSearchedBooks] = useState(null);

    const { term } = useParams();   //gets search term from book search form

    // if search term exists, fetches the google books from the Google Books API and
    // sets the state
    useEffect(function getGoogleBooks() {
        if (term != undefined) {
            try {
                async function getBooks() {
                    const result = await BookMarkerApi.getGoogleBooksList(term);
                    setSearchedBooks(result);
                }

                getBooks();
            } catch (err) {
                console.log(err);
            }
        }
    }, [term]);
    console.log('searchedBooks=', searchedBooks, 'bestsellerBooks=', bestsellerBooks, 'readBooks=', readBooks, 'wishToReadBooks=', wishToReadBooks)

    let bookList = bestsellerBooks || searchedBooks || readBooks || wishToReadBooks || undefined;


    if (!bookList) {
        return (
            <div>
                <BookSearchForm />

                <LoadSpinner />
            </div>
        )
    }

    let bookStatus = null;

    if (bookList === readBooks) {
        bookStatus = 'My Read Books:'
    } else if (bookList === wishToReadBooks) {
        bookStatus = 'My Wish To Read Books:'
    };


    if (bookList.length) {
        return (
            <div>
                <BookSearchForm />

                <h3> {bookStatus ? bookStatus : ''}</h3>

                {bookList.map((book, index) => (
                    <BookCard book={book} key={index} />
                ))
                }
            </div>
        )
    } else {
        return (
            <div>
                <BookSearchForm />

                {bookList != readBooks && bookList !== wishToReadBooks ? <ShowAlert messages={['Sorry, no results were found!']} /> : null}
                {bookList === readBooks ? <ShowAlert messages={['No Read Books']} /> : null}
                {bookList === wishToReadBooks ? <ShowAlert messages={['No Wish To Read Books']} /> : null}
            </div>
        )
    }
};

export default BookList;


