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

function BookList({ books, booksLabel }) {
    console.debug('books:', books, 'booksLabel:', booksLabel)

    const [searchedBooks, setSearchedBooks] = useState(null);
    const { term } = useParams();

    const bookList = searchedBooks || books;

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

    if (!bookList) {
        return (
            <div>
                <BookSearchForm />
                <LoadSpinner />
            </div>
        )
    }

    if (bookList.length) {
        return (
            <div>
                <BookSearchForm />

                <Typography sx={{ mt: 6, mb: 4, color: 'text.secondary', fontWeight: '200', fontSize: { xs: 28, sm: 30, lg: 34.5 }, textAlign: 'center' }}>
                    {booksLabel}
                </Typography>

                <Grid container sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {bookList.map((book, index) => (
                        <BookCard book={book} key={index} />
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
                    {booksLabel === 'My Read Books:' ? <ShowAlert type={'info'} messages={['You have no Read books']} /> : null}
                    {booksLabel === 'My Wish To Read Books:' ? <ShowAlert type={'info'} messages={['You have no Wish To Read books']} /> : null}
                    {booksLabel === 'NYT Bestsellers' || !booksLabel ? <ShowAlert type={'info'} messages={['Sorry, no results were found!']} /> : null}
                </Box>
            </div>
        )
    }
};

export default BookList;
