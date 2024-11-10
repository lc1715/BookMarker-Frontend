import { useState, useEffect, useContext } from 'react';
import BookMarkerApi from '../api/api';
import UserContext from '../auth/UserContext';
import BookList from './BookList';


function WishToReadBooks() {
    const [wishBooks, setWishBooks] = useState(null);

    const { currentUser } = useContext(UserContext);

    //get wish to read books
    useEffect(() => {
        try {
            async function getWishToReadBooks() {
                const books = await BookMarkerApi.getWishBooks(currentUser.username, { has_read: false });
                console.log('wish to read books=', books);

                setWishBooks(books);
            }
            getWishToReadBooks();
        } catch (err) {
            console.log(err);
        }
    }, [])

    return (
        <BookList books={wishBooks} booksLabel={'My Wish To Read Books:'} />
    );
};

export default WishToReadBooks;