import { useState, useEffect, useContext } from 'react';
import BookMarkerApi from '../api/api';
import UserContext from '../auth/UserContext';
import BookList from './BookList';


/** WishToReadBooks component
 * -makes API call to fetch user's 'Wish To Read' books
 * -passes 'Wish To Read' books and its label as props to BookList component
 * 
 * Route: 'books/wish'
 */
function WishToReadBooks() {
    const [wishBooks, setWishBooks] = useState(null);
    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        try {
            async function getWishToReadBooks() {
                const books = await BookMarkerApi.getWishBooks(currentUser.username, { has_read: false });
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