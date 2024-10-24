import { useState, useEffect, useContext } from "react";
import UserContext from "../auth/UserContext";
import BookMarkerApi from '../api/api'
import BookList from "./BookList";

//get all read books for user
function ReadBooks() {
    const [readBooks, setReadBooks] = useState(null);

    const { currentUser } = useContext(UserContext);


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
        <BookList readBooks={readBooks} />
    )
};

export default ReadBooks;

