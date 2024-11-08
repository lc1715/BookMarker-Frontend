import { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import BookMarkerApi from '../api/api';
import UserContext from '../auth/UserContext';
import Review from '../reviews/Review';
import ReviewForm from '../reviews/ReviewForm';
import AllReviews from '../reviews/AllReviews';
import Rating from '../rating/Rating';
import LoadSpinner from '../common/LoadSpinner';
import TimedMessage from '../common/TimedMessage';
import removeHtmlTags from '../common/removeTags';
import defaultBookImage from '../assets/bookImage.jpg'
//Material UI
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';


function BookDetail() {
    //states for books
    const [book, setBook] = useState(null);
    console.log('book=', book)

    const [bookStatus, setBookStatus] = useState(null);
    console.log('bookStatus=', bookStatus)

    const [openBookDeleteMessage, setOpenBookDeleteMessage] = useState(false);

    //states for reviews
    const [allReviews, setAllReviews] = useState([]);
    console.log('allReviews state=', allReviews)

    const [review, setReview] = useState(null);
    console.log('review state=', review)

    const [reviewChange, setReviewChange] = useState(false);
    console.log('reviewChange state=', reviewChange)

    const [openReviewForm, setOpenReviewForm] = useState(false);

    const [showAllReviews, setShowAllReviews] = useState(false);

    //states for rating
    const [rating, setRating] = useState(0);
    console.log('rating state=', rating)

    const [ratingId, setRatingId] = useState(null);
    console.log('ratingId state=', ratingId)

    const [hover, setHover] = useState(null);
    console.log('hover state=', hover)

    //states for errors
    const [error, setError] = useState(false);
    console.log('error=', error)

    const [bookError, setBookError] = useState(false);
    console.log('bookError=', bookError)

    //states for scrolling to user's review
    const [scrollToReview, setScrollToReview] = useState(false);

    const [ranFirstScroll, setRanFirstScroll] = useState(false);


    const { currentUser, hasSavedBook, saveBook, deleteSavedBook } = useContext(UserContext);
    console.log('currentUser in BookDetail=', currentUser)

    const { bookId, bookIdType } = useParams();
    //get url params from BookCard. {isbn, 234234} or {volumeId, e783hf39}
    console.log('bookId=', bookId, 'bookIdType=', bookIdType)

    //Gets book details
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

    //Gets book status to label book as Read or Wish To Read status
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

    //Gets all reviews and user's review on the book  
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

    const scrollRef = useRef(null);
    console.log('scrollToReview=', scrollToReview)
    console.log('ranFirstScroll=', ranFirstScroll)

    //Scroll to user's review first time it is rendered
    useEffect(() => {
        if (scrollToReview && !ranFirstScroll && review) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
            setRanFirstScroll(true);
        }
    }, [scrollToReview, ranFirstScroll, review])

    //Scroll to all reviews
    useEffect(() => {
        if (showAllReviews) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showAllReviews])

    //Scroll to error message
    useEffect(() => {
        if (error) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [error])

    //Get user's rating on a book 
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


    //Add user's rating on a book
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

    //Update user's rating on a book
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

    //Add a book to db or update book status
    async function addBookOrChangeBookStatus(evt) {
        if (currentUser) {
            //check if user's has_read value is true or false
            let has_read_value;
            console.log('has_read_value=', has_read_value)

            evt.target.innerText === 'READ' ? has_read_value = true : has_read_value = false;
            console.log('evt.target.innerText=', evt.target.innerText)

            //if book has not been saved, add book. otherwise update book status.
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
            setBookError(true);
        }
    };

    //Contains the book details to add a book. Used by BookDetail and ReviewForm components.
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

    //Delete a user's saved book, review and rating
    async function removeSavedBook() {
        try {
            await deleteSavedBook(book.volumeId, currentUser.username);
            setBookStatus(null);

            if (review) {
                await BookMarkerApi.deleteReview(review.id, currentUser.username);

                setReviewChange(true);
            };

            if (rating) {
                await BookMarkerApi.deleteRating(ratingId, currentUser.username);

                setRating(0);
                setRatingId(null);
            }
        } catch (err) {
            console.log(err);
        }
    };

    //Shows all of the reviews for a book
    async function showReviews() {
        setShowAllReviews(true)
    };

    //Opens modal to show review text input
    function showReviewForm() {
        currentUser ? setOpenReviewForm(true) : setError(true);
    };

    //Closes modal to show review text input
    function closeReviewForm() {
        setOpenReviewForm(false);
    }

    //Opens modal to show delete book warning message
    const showBookDeleteMessage = () => {
        setOpenBookDeleteMessage(true);
    };

    //Closes modal for delete book warning message
    const closeBookDeleteMessage = () => {
        setOpenBookDeleteMessage(false);
    };

    //Styles the modal for review form and delete book warning message
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 620,
        bgcolor: 'background.paper',
        border: '1px solid #000',
        boxShadow: 24,
        py: 3,
        width: {
            xs: 348, sm: 446, md: 600, lg: 620
        }
    };

    if (!book) return <LoadSpinner />

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={4} sx={{ mx: 3, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: '100%', mt: 2, ml: 1 }}>
                        {bookStatus === true ? <h3 style={{ marginBottom: 0, fontSize: 20 }}>Read:</h3> : null}
                        {bookStatus === false ? <h3 style={{ marginBottom: 0, marginLeft: 6, fontSize: 20 }}>Wish To Read:</h3> : null}
                    </Box>

                    {/* Card to display book image */}
                    {/* If I add margins to the grid, they will not honor the breakpoints*/}
                    <Grid size={{ xs: 12, md: 12, lg: 6 }} sx={{ display: "flex", justifyContent: "center", alignItems: 'stretch' }}>
                        <Card sx={{ width: '100%', p: 4, display: "flex", justifyContent: "center", alignItems: 'center' }}>
                            <Box component="section">
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <Box component="img" src={book.image ? book.image : defaultBookImage}
                                        sx={{ width: { xs: 215, md: 320 } }}>
                                        {/* sx={{ width: { xs: '100%', md: 320 } }}> */}
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button onClick={addBookOrChangeBookStatus} variant="contained" sx={{ mt: 3, backgroundColor: '#cf8d86' }}>
                                        Read
                                    </Button>

                                    <Button onClick={addBookOrChangeBookStatus} variant="contained" sx={{ mt: 3, ml: 2, backgroundColor: '#cf8d86' }}>
                                        Wish To Read
                                    </Button>
                                </Box>

                                {bookError ?
                                    <TimedMessage setTimedMessage={setBookError} />
                                    :
                                    null
                                }
                            </Box>
                        </Card>
                    </Grid>

                    {/* Card to display book details */}
                    <Grid size={{ xs: 12, md: 12, lg: 6 }} sx={{ display: "flex", justifyContent: "center", }}>
                        <Card sx={{ width: '100%', minHeight: '500px', display: "flex", flexDirection: 'column', position: 'relative', textAlign: 'center' }}>
                            <Box component="section" sx={{ px: 4, pt: 2, pb: 3, flexGrow: 1 }}>
                                <Typography sx={{ mt: 1, fontSize: '33px', }}>{book.title}</Typography>
                                <Typography sx={{ mt: 1 }}>By {book.author}</Typography>
                                <Typography sx={{ mt: 1 }}>Publisher: {book.publisher}</Typography>
                                <Typography sx={{ mt: 1 }}>Categories: {book.category}</Typography>
                                <Typography sx={{ mt: 1 }}>{!book.description ? null : removeHtmlTags(book.description)}</Typography>
                            </Box>
                        </Card>
                    </Grid>

                </Grid>
            </Box >

            {/* Shows the star rating, optional reviews, and delete book message*/}
            <Divider sx={{ mt: 6, borderWidth: 1 }} />
            <Box sx={{ position: 'absolute', right: 0 }}>
                {
                    currentUser && hasSavedBook(book.volumeId)
                        ?
                        <>
                            <IconButton onClick={showBookDeleteMessage} aria-label="delete review"  >
                                <HighlightOffIcon />
                            </IconButton>

                            <Modal
                                open={openBookDeleteMessage}
                                onClose={closeBookDeleteMessage}
                                aria-labelledby="modal-modal-delete-book-message"
                                aria-describedby="modal-modal-delete-book-message"
                            >
                                <Box sx={{ ...style, border: 2, borderRadius: 2 }}>
                                    <Box sx={{ m: 2 }}>
                                        <Typography style={{ fontSize: '19px', textAlign: 'center' }}>
                                            Are you sure you want to delete this book?
                                            Deleting this book will also delete your review and rating.
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center', gap: 2 }}>
                                        <Button variant="contained" onClick={removeSavedBook} >OK</Button>
                                        <Button variant="contained" onClick={closeBookDeleteMessage} >Cancel</Button>
                                    </Box>
                                </Box>
                            </Modal>
                        </>
                        :
                        null
                }
            </Box>

            <Box component="section" sx={{ pb: 9, mt: 1.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Rating rating={rating} setRating={setRating} addRating={addRating} updateRating={updateRating} hover={hover} setHover={setHover} />
            </Box>

            {/* Buttons to show user's review and all reviews */}
            <Box component="section" sx={{ pb: 3, mr: { lg: 4 }, display: 'flex', gap: 2, display: 'flex', justifyContent: { xs: 'center', lg: 'end' }, alignItems: 'center' }}>
                {!review && (
                    <>
                        <Button variant="outlined" onClick={showReviewForm} >Write A Review</Button>
                    </>
                )}

                <Button variant="outlined" onClick={showReviews}>All Reviews</Button>
            </Box>

            {/* Shows user's review and all reviews */}
            <Divider sx={{ borderWidth: 1 }} />
            <div ref={scrollRef}>
                {review && <Review userReview={review} setReviewChange={setReviewChange} setRanFirstScroll={setRanFirstScroll} setScrollToReview={setScrollToReview} />}
            </div>

            <div ref={scrollRef}>
                {showAllReviews && <AllReviews allReviews={allReviews} setShowAllReviews={setShowAllReviews} />}
            </div>

            {/* Message to login in if user is not logged in */}
            <div ref={scrollRef}>
                {error &&
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                        <TimedMessage setTimedMessage={setError} />
                    </Box>
                }
            </div>

            {/* Opens the review form */}
            <Modal
                open={openReviewForm}
                onClose={closeReviewForm}
                aria-labelledby="modal-modal-reviewForm"
                aria-describedby="modal-modal-reviewForm"
            >
                <Box sx={style}>
                    <ReviewForm setScrollToReview={setScrollToReview} book={book} addBook={addBook} setReviewChange={setReviewChange} setOpenReviewForm={setOpenReviewForm} setBookStatus={setBookStatus} />
                </Box>
            </Modal>

        </div >
    )
};

export default BookDetail;
