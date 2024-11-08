import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookCard from "./BookCard";
import BookSearchForm from "./BookSearchForm";
import BookMarkerApi from "../api/api";
import ShowAlert from "../common/ShowAlert";
import LoadSpinner from "../common/LoadSpinner";
//Material UI
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


/** BookList 
 * 
 * - prop: nyt bestseller books, user's Read books, or user's Wish To Read books
 * - state: google searched books
 * - only set google books as state if term received from search form submission
 * - if term received, fetch the google books from Google Books API and update state 
 * - render google books if state exists otherwise render prop
 * - components using BooksList: Homepage, BookSearchForm, ReadBooks, WishToReadBooks
 * 
 * Route: '/books/search/:term'
 */

function BookList({ books, bookCategories }) {     // nytBooks, readBooks, wishToReadBooks
    console.debug('books:', books, 'bookCategories:', bookCategories)

    //stores google books
    const [searchedBooks, setSearchedBooks] = useState(null);
    console.log('searchedBooks=', searchedBooks)

    //gets search term from book search form
    const { term } = useParams();


    /** If search term exists, fetches the google books from the Google Books API 
     * and sets the state
    */
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

    if (!books && !searchedBooks) {
        return (
            <div>
                <BookSearchForm />

                <LoadSpinner />
            </div>
        )
    }

    let bookLabel = null;

    if (bookCategories === 'readBooks') {
        bookLabel = 'My Read Books:'
    } else if (bookCategories === 'wishToReadBooks') {
        bookLabel = 'My Wish To Read Books:'
    } else if (bookCategories === 'nytBooks') {
        bookLabel = 'NYT Bestsellers'
    };

    let bookList = books || searchedBooks || undefined;

    if (bookList.length) {
        return (
            <div>
                <BookSearchForm />

                <Typography sx={{ mt: 6, mb: 4, color: 'text.secondary', fontWeight: '200', fontSize: { xs: 30, lg: 35 }, textAlign: 'center' }}>
                    {bookLabel ? bookLabel : ''}
                </Typography>

                <Grid container sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {bookList.map((book, index) => (
                        <BookCard book={book} bookCategories={bookCategories} key={index} bookLabel={bookLabel} />
                    ))
                    }
                </Grid>
            </div>
        )
    } else {
        return (
            <div>
                <BookSearchForm />

                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {bookCategories === 'readBooks' ? <ShowAlert type={'info'} messages={['You have no Read Books']} /> : null}
                    {bookCategories === 'wishToReadBooks' ? <ShowAlert type={'info'} messages={['You have no Wish To Read Books']} /> : null}
                    {bookCategories != 'readBooks' && bookCategories != 'wishToReadBooks' ? <ShowAlert type={'info'} messages={['Sorry, no results were found!']} /> : null}
                </Box>
            </div>
        )
    }
};

export default BookList;
