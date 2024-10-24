import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import BookMarkerApi from '../api/api';
import UserContext from '../auth/UserContext';
import LoadSpinner from '../common/LoadSpinner';
import LoginMessage from '../common/LoginMessage';
import Review from '../reviews/Review';
import ReviewForm from '../reviews/ReviewForm';
import AllReviews from '../reviews/AllReviews';
import Rating from '../rating/Rating';

function BookDetail() {
    const [book, setBook] = useState(null);
    console.log('book=', book)

    const [bookStatus, setBookStatus] = useState(null);
    console.log('bookStatus=', bookStatus)

    const [error, setError] = useState(false);
    console.log('error=', error)
    const [allReviews, setAllReviews] = useState([]);
    console.log('allReviews state=', allReviews)

    const [review, setReview] = useState(null);
    console.log('review state=', review)

    const [reviewChange, setReviewChange] = useState(false);
    console.log('reviewChange state=', reviewChange)

    const [reviewForm, setReviewForm] = useState(false);

    const [showAllReviews, setShowAllReviews] = useState(false);

    const [rating, setRating] = useState(0);
    console.log('rating state=', rating)

    const [ratingId, setRatingId] = useState(null);
    console.log('ratingId state=', ratingId)

    const [hover, setHover] = useState(null);
    console.log('hover state=', hover)

    const { currentUser, hasSavedBook, saveBook, deleteSavedBook } = useContext(UserContext);
    console.log('currentUser in BookDetail=', currentUser)

    const { bookId, bookIdType } = useParams();
    //get url params from BookCard. {isbn, 234234} or {volumeId, e783hf39}
    console.log('bookId=', bookId, 'bookIdType=', bookIdType)


    //get book details
    //if bookId is isbn, call API getGoogleBookFromNYT method to get book detail
    //if bookId is volumeId, call API getGoogleBook method to get book detail
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

    //get book status to label book as Read or Wish To Read status
    useEffect(() => {
        if (currentUser && book) {
            try {
                async function getBookStatus() {
                    let status = await BookMarkerApi.getSavedBook(book.volumeId, currentUser.username);
                    console.log('book status=', status);

                    if (status) setBookStatus(status.has_read);
                }

                getBookStatus();
            } catch (err) {
                console.log(err);
            }
        }
    }, [book])

    //get all reviews and user's review on the book  
    useEffect(() => {
        if (book) {
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
                    if (currentUser) {
                        let review = reviews.filter((review) => (review.username === currentUser.username))
                        console.log('user review=', review)

                        review.length ? setReview(review[0]) : setReview(null);
                    }

                    setAllReviews(reviews);
                    setReviewChange(false);
                };
                getAllReviewsAndUserReview();
            } catch (err) {
                console.log(err);
            }
        }
    }, [book, reviewChange]);

    //get rating on a book 
    useEffect(() => {
        if (currentUser && book) {
            try {
                async function showRating() {
                    let res = await BookMarkerApi.getRating(book.volumeId, currentUser.username);

                    if (res) {
                        setRating(res.rating)
                        setRatingId(res.id)
                    }
                }

                showRating();
            } catch (err) {
                console.log(err);
            }
        }
    }, [book]);

    //add rating on a book
    async function addRating(star) {
        if (currentUser) {
            try {
                let res = await BookMarkerApi.addRating(book.volumeId, currentUser.username, { rating: star });

                setRating(star);
                setRatingId(res.id);
            } catch (err) {
                console.log(err);
            }
        } else {
            setError(true);
        }
    }

    //update rating on a book
    async function updateRating(star) {
        if (currentUser) {
            try {
                let res = await BookMarkerApi.updateRating(ratingId, currentUser.username, { rating: star });

                setRating(star);
                setRatingId(res.id);
            } catch (err) {
                console.log(err);
            }
        } else {
            setError(true);
        }
    }

    //add a book to saved books or update status
    async function addBookOrChangeBookStatus(evt) {
        if (currentUser) {
            //check if user's has_read value is true or false
            let has_read_value;

            evt.target.innerText === 'Read' ? has_read_value = true : has_read_value = false;

            //if book has not been saved, add book. otherwise update has_read status.
            if (!hasSavedBook(book.volumeId)) {
                let res = await addBook(has_read_value);

                setBookStatus(res.has_read);
            } else {
                try {
                    let res = await BookMarkerApi.changeBookStatus(
                        book.volumeId,
                        currentUser.username,
                        { has_read: has_read_value });

                    setBookStatus(res.has_read);
                } catch (err) {
                    console.log(err);
                }
            }
        } else {
            setError(true);
        }
    };

    //Helper function used to add book. Used by BookDetail and ReviewForm.
    async function addBook(has_read_value) {
        let savedBook = await saveBook(book.volumeId, {
            volume_id: book.volumeId,
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            category: book.category,
            description: book.description,
            image: book.image,
            has_read: has_read_value
        });

        return savedBook;
    }

    //delete user's saved book, review and rating
    async function removeSavedBook() {
        try {
            //delete book
            await deleteSavedBook(book.volumeId, currentUser.username);
            setBookStatus(null);

            //delete review
            if (review) {
                await BookMarkerApi.deleteReview(review.id, currentUser.username);

                setReviewChange(true);
            };

            //delete rating
            if (rating) {
                await BookMarkerApi.deleteRating(ratingId, currentUser.username);

                setRating(0);
                setRatingId(null);
            }
        } catch (err) {
            console.log(err);
        }
    };

    //show the review form or message to login
    function showReviewForm() {
        currentUser ? setReviewForm(true) : setError(true);
    };

    //show all reviews for a book
    async function showReviews() {
        setShowAllReviews(true)
    };

    if (!book) return <LoadSpinner />

    return (
        <div>

            {bookStatus === true ? <h3>Read:</h3> : null}
            {bookStatus === false ? <h3>Wish To Read:</h3> : null}

            <img src={book.image} />
            <p>Title: {book.title}</p>
            <p>Author: {book.author}</p>
            <p>Publisher: {book.publisher}</p>
            <p>Category: {book.category}</p>
            <p>Description: {removeHtmlTags(book.description)}</p>

            <button onClick={addBookOrChangeBookStatus}>Read</button>

            <button onClick={addBookOrChangeBookStatus}>Wish To Read</button>

            <button onClick={showReviews}>All Reviews</button>


            {currentUser && hasSavedBook(book.volumeId)
                ?
                <button onClick={removeSavedBook}>Delete Book</button>
                :
                null
            }

            <Rating rating={rating} setRating={setRating} addRating={addRating} updateRating={updateRating} hover={hover} setHover={setHover} />

            {review
                ?
                <Review userReview={review} setReviewChange={setReviewChange} />
                :
                <button onClick={showReviewForm}>Write A Review</button>
            }

            {reviewForm
                ?
                <ReviewForm book={book} addBook={addBook} setReviewChange={setReviewChange} setReviewForm={setReviewForm} setBookStatus={setBookStatus} />
                :
                null
            }

            {showAllReviews
                ?
                <AllReviews allReviews={allReviews} setShowAllReviews={setShowAllReviews} />
                :
                null
            }

            {error ? <LoginMessage setError={setError} /> : null}
        </div>
    )
};

export default BookDetail;

function removeHtmlTags(string) {
    let doc = new DOMParser().parseFromString(string, 'text/html');
    return doc.body.textContent || "";
};











