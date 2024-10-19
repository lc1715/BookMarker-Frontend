import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import BookMarkerApi from '../api/api';
import LoadSpinner from '../common/LoadSpinner';
import { useContext } from 'react';
import UserContext from '../auth/UserContext';
import ShowAlert from '../common/ShowAlert';
import LoginMessage from '../common/LoginMessage';
import Review from '../reviews/Review';
import ReviewForm from '../reviews/ReviewForm';
import AllReviews from '../reviews/AllReviews';


function BookDetail() {
    const [book, setBook] = useState(null);
    console.log('book=', book)

    const [error, setError] = useState(false);
    console.log('error=', error)

    const [allReviews, setAllReviews] = useState([]);
    console.log('allReviews state=', allReviews)

    const [review, setReview] = useState(null);
    console.log('review state=', review)

    const [reviewChange, setReviewChange] = useState(false);
    console.log('reviewChange state=', reviewChange)

    const [showReviewForm, setShowReviewForm] = useState(false);

    const [showAllReviews, setShowAllReviews] = useState(false);

    const { currentUser, hasSavedBook, saveBook, deleteSavedBook } = useContext(UserContext);
    console.log('currentUser in BookDetail=', currentUser)

    const { bookId, bookIdType } = useParams();
    //get url params from BookCard. {isbn, 234234} or {volumeId, e783hf39}
    console.log('bookId=', bookId, 'bookIdType=', bookIdType)

    const navigate = useNavigate();


    //both API methods will return a Google Book with volumeId
    useEffect(() => {
        async function getBookDetails() {
            try {
                if (bookIdType === 'isbn') {
                    setBook(await BookMarkerApi.getGoogleBookFromNYT(bookId));
                } else if (bookIdType === 'volumeId') {
                    setBook(await BookMarkerApi.getGoogleBook(bookId));
                }
            } catch (err) {
                console.log(err)
            }
        }

        getBookDetails()
    }, [bookId, bookIdType]);

    //shows the user's review and option to edit or delete review
    useEffect(() => {
        if (currentUser && book) {
            try {
                async function getAllReviewsAndUserReview() {
                    //get all reviews 
                    let reviews = await BookMarkerApi.getAllReviews(book.volumeId);
                    console.log('reviews=', reviews)

                    if (!reviews.length) {
                        setReview(null);
                        setAllReviews(reviews);
                        setReviewChange(false);
                        return;
                    }

                    //get user's review
                    const review = reviews.filter((review) => (review.username === currentUser.username))
                    console.log('user review=', review)

                    review.length ? setReview(review[0]) : setReview(null);

                    setAllReviews(reviews);
                    setReviewChange(false);
                };
                getAllReviewsAndUserReview();
            } catch (err) {
                console.log(err);
            }
        }
    }, [book, reviewChange]);

    //add a book to saved books or update status
    async function addBookOrChangeBookStatus(evt) {
        if (currentUser) {
            //check if has_read value is true or false
            let has_read_value;

            evt.target.innerText === 'Read' ? has_read_value = true : has_read_value = false;

            //if book has not been saved, add book. otherwise update has_read status.
            if (!hasSavedBook(book.volumeId)) {
                await addBook(has_read_value);
                //navigate to the read or wish to read book list or alert?
            } else {
                try {
                    await BookMarkerApi.changeBookStatus(
                        book.volumeId,
                        currentUser.username,
                        { has_read: has_read_value });

                    //navigate to the read or wish to read book list or alert?
                } catch (err) {
                    console.log(err);
                }
            }
        } else {
            setError(true);
        }
    };

    //helper func used to add book
    async function addBook(has_read_value) {
        try {
            await saveBook(book.volumeId, {
                volume_id: book.volumeId,
                title: book.title,
                author: book.author,
                publisher: book.publisher,
                category: book.category,
                description: book.description,
                image: book.image,
                has_read: has_read_value
            });
        } catch (err) {
            console.log(err);
        }
    }

    //delete the saved book in db
    async function removeSavedBook() {
        try {
            //delete book
            await deleteSavedBook(book.volumeId, currentUser.username);

            //delete review
            if (review) {
                await BookMarkerApi.deleteReview(review.id, currentUser.username);

                setReviewChange(true);
            };

            //call delete saved book func in app
            //delete review here
            //delete rating here
        } catch (err) {
            console.log(err);
        }
    };

    function reviewForm() {
        currentUser ? setShowReviewForm(true) : setError(true);
    };

    //show reviews comp
    async function showReviews() {
        setShowAllReviews(true)
    };

    if (!book) return <LoadSpinner />

    return (
        <div>
            <img src={book.image} />
            <p>Title: {book.title}</p>
            <p>Author: {book.author}</p>
            <p>Publisher: {book.publisher}</p>
            <p>Category: {book.category}</p>
            <p>Description: {removeHtmlTags(book.description)}</p>

            <button onClick={addBookOrChangeBookStatus}>Read</button>

            <button onClick={addBookOrChangeBookStatus}>Wish To Read</button>

            <button onClick={showReviews}>All Reviews</button>

            {hasSavedBook(book.volumeId)
                ?
                <button onClick={removeSavedBook}>Delete Book</button>
                :
                null
            }

            {review
                ?
                <Review book={book} userReview={review} setReviewChange={setReviewChange} />
                :
                <button onClick={reviewForm}>Write A Review</button>
            }

            {showAllReviews
                ?
                <AllReviews allReviews={allReviews} setShowAllReviews={setShowAllReviews} />
                :
                null
            }

            {showReviewForm
                ?
                <ReviewForm book={book} addBook={addBook} setReviewChange={setReviewChange} setShowReviewForm={setShowReviewForm} />
                :
                null
            }

            {error ? <LoginMessage setError={setError} /> : null}
        </div>
    )
};


function removeHtmlTags(string) {
    let doc = new DOMParser().parseFromString(string, 'text/html');
    return doc.body.textContent || "";
};


export default BookDetail;








