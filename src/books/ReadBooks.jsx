import { useState, useEffect, useContext } from "react";
import UserContext from "../auth/UserContext";
import BookMarkerApi from '../api/api'
import BookList from "./BookList";


/** ReadBooks component
 * -makes API call to fetch user's 'Read' books
 * -passes 'Read' books and its label as props to BookList component
 * 
 * Route: 'books/read'
 */
function ReadBooks() {
    const [readBooks, setReadBooks] = useState(null);
    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        try {
            async function getReadBooks() {
                const books = await BookMarkerApi.getReadBooks(currentUser.username, { has_read: true });
                setReadBooks(books);
            };
            getReadBooks();
        } catch (err) {
            console.log(err);
        }
    }, [])

    return (
        <BookList books={readBooks} booksLabel={'My Read Books:'} />
    )
};

export default ReadBooks;


