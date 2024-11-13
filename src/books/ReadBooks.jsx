import { useState, useEffect, useContext } from "react";
import UserContext from "../auth/UserContext";
import BookMarkerApi from '../api/api'
import BookList from "./BookList";


function ReadBooks() {
    const [readBooks, setReadBooks] = useState(null);

    const { currentUser } = useContext(UserContext);

    //get all read books for user
    useEffect(() => {
        try {
            async function getReadBooks() {
                const books = await BookMarkerApi.getReadBooks(currentUser.username, { has_read: true });
                console.log('read books=', books)

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


