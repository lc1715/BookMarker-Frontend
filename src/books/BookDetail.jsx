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
    // states for books
    const [book, setBook] = useState(null);
    const [bookStatus, setBookStatus] = useState(null);
    const [openBookDeleteMessage, setOpenBookDeleteMessage] = useState(false);
    // states for reviews
    const [review, setReview] = useState(null);
    const [reviewChange, setReviewChange] = useState(false);
    const [openReviewForm, setOpenReviewForm] = useState(false);
    const [allReviews, setAllReviews] = useState([]);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [scrollToReview, setScrollToReview] = useState(false);
    const [ranFirstScroll, setRanFirstScroll] = useState(false);
    // states for rating
    const [rating, setRating] = useState(0);
    const [ratingId, setRatingId] = useState(null);
    const [hover, setHover] = useState(null);
    // states for errors
    const [error, setError] = useState(false);
    const [bookError, setBookError] = useState(false);

    const { bookId, bookIdType } = useParams();
    const { currentUser, hasSavedBook, saveBook, deleteSavedBook } = useContext(UserContext);


    // Gets the book data from the Google Books API and sets the book state
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

    // Gets the book status to label book as Read or Wish To Read status
    useEffect(() => {
        if (currentUser && book) {
            try {
                async function getBookStatus() {
                    let res = await BookMarkerApi.getSavedBook(book.volumeId, currentUser.username);
                    console.log('book status=', res);

                    if (res) setBookStatus(res.has_read);
                }
                getBookStatus();
            } catch (err) {
                console.log(err);
            }
        }
    }, [book])

    // Gets all reviews and user's review on the book  
    useEffect(() => {
        if (book) {
            try {
                async function getAllReviewsAndUserReview() {
                    // get all reviews
                    let reviews = await BookMarkerApi.getAllReviews(book.volumeId);
                    if (!reviews.length) {
                        setReview(null);
                        setReviewChange(false);
                        setAllReviews(reviews);
                        return;
                    }

                    // get user's review
                    if (currentUser) {
                        let review = reviews.filter((review) => (review.username === currentUser.username))
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

    // Scroll to the user's review the first time it is rendered
    useEffect(() => {
        if (scrollToReview && !ranFirstScroll && review) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
            setRanFirstScroll(true);
        }
    }, [scrollToReview, ranFirstScroll, review])

    // Scroll to all reviews
    useEffect(() => {
        if (showAllReviews) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showAllReviews])

    // Scroll to error message
    useEffect(() => {
        if (error) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [error])

    // Gets a user's rating on a book 
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

    // Function to add user's book rating to the database
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

    // Function to update user's book rating to the database
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

    // Function to add a book or change the book status to the database when user clicks on 'Read' or 'Wish To Read' buttons
    async function addBookOrChangeBookStatus(evt) {
        if (currentUser) {
            // get the user's has_read value for the book 
            let has_read_value;
            evt.target.innerText === 'READ' ? has_read_value = true : has_read_value = false;

            // check if the book has already been saved by the user
            // if it has, then update the book status
            // if it hasn't, then add the book to the user's saved books
            if (hasSavedBook(book.volumeId)) {
                try {
                    let res = await BookMarkerApi.changeBookStatus(
                        book.volumeId,
                        currentUser.username,
                        { has_read: has_read_value });

                    setBookStatus(res.has_read);
                } catch (err) {
                    console.log(err);
                }
            } else {
                let res = await addBook(book, has_read_value);
                setBookStatus(res.has_read);
            }

        } else {
            setBookError(true);
        }
    };

    // Helper function to save a book. Used by BookDetail and ReviewForm components.
    async function addBook(book, has_read_value) {
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

    // Function to delete a user's saved book, review and rating from the database
    async function removeSavedBook() {
        try {
            await deleteSavedBook(book.volumeId, currentUser.username);
            setBookStatus(null);

            if (review) {
                await BookMarkerApi.deleteReview(review.id, currentUser.username);
                setReviewChange(true);
            }

            if (rating) {
                await BookMarkerApi.deleteRating(ratingId, currentUser.username);

                setRating(0);
                setRatingId(null);
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Shows all of the reviews for a book
    async function showReviews() {
        setShowAllReviews(true)
    };

    // Opens modal to show review text input
    function showReviewForm() {
        currentUser ? setOpenReviewForm(true) : setError(true);
    };

    // Closes modal for the review text input
    function closeReviewForm() {
        setOpenReviewForm(false);
    }

    // Opens modal to show delete book warning message
    const showBookDeleteMessage = () => {
        setOpenBookDeleteMessage(true);
    };

    // Closes modal for delete book warning message
    const closeBookDeleteMessage = () => {
        setOpenBookDeleteMessage(false);
    };

    // Styles the modal for the review form and delete book warning message
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 620,
        backgroundColor: '#fff',
        border: '1px solid #000',
        boxShadow: 24,
        py: 3
    };

    if (!book) return <LoadSpinner />

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={4} sx={{ mx: 3, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: '100%', mt: 2, ml: 1 }}>
                        {bookStatus === true ? (
                            <Box component="h3" sx={{ mb: 0, ml: { lg: .5 }, fontSize: { xs: 20, lg: 18.5 } }}>
                                Read:
                            </Box>
                        ) : null}
                        {bookStatus === false ? (
                            <Box component="h3" sx={{ mb: 0, ml: { lg: .5 }, fontSize: { xs: 20, lg: 18.5 } }}>
                                Wish To Read:
                            </Box>
                        ) : null}
                    </Box>

                    {/* Card to display book image */}
                    {/* If I add margins to the grid, it will not honor the breakpoints*/}
                    <Grid size={{ xs: 12, lg: 6 }} sx={{ display: "flex", justifyContent: "center", alignItems: 'stretch' }}>
                        <Card sx={{ width: '100%', p: 4, display: "flex", justifyContent: "center", alignItems: 'center' }}>
                            <Box component="section">
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <Box component="img" src={book.image ? book.image : defaultBookImage}
                                        sx={{ width: { xs: 215, lg: 288 } }}>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button onClick={addBookOrChangeBookStatus} variant="contained" sx={{ mt: 3, backgroundColor: '#cf8d86', fontSize: { lg: 13 } }}>
                                        Read
                                    </Button>

                                    <Button onClick={addBookOrChangeBookStatus} variant="contained" sx={{ mt: 3, ml: 2, backgroundColor: '#cf8d86', fontSize: { lg: 13 } }}>
                                        Wish To Read
                                    </Button>
                                </Box>

                                {bookError ?
                                    <TimedMessage setState={setBookError} />
                                    :
                                    null}
                            </Box>
                        </Card>
                    </Grid>

                    {/* Card to display book details */}
                    <Grid size={{ xs: 12, lg: 6 }} sx={{ display: "flex", justifyContent: "center", }}>
                        <Card sx={{ width: '100%', minHeight: '500px', display: "flex", flexDirection: 'column', position: 'relative', textAlign: 'center' }}>
                            <Box component="section" sx={{ px: 4, pt: 2, pb: 3, flexGrow: 1 }}>
                                <Typography sx={{ mt: 1, fontSize: { xs: '34px', lg: '30px' } }}>{book.title}</Typography>
                                <Typography sx={{ mt: 1, fontSize: { xs: '18px', lg: '16px' } }}>By {book.author}</Typography>
                                <Typography sx={{ mt: 1, fontSize: { xs: '18px', lg: '16px' } }}>Publisher: {book.publisher}</Typography>
                                <Typography sx={{ mt: 1, fontSize: { xs: '18px', lg: '16px' } }}>Categories: {book.category}</Typography>
                                <Typography sx={{ mt: 1, fontSize: { xs: '18px', lg: '16px' } }}>{!book.description ? '' : removeHtmlTags(book.description)}</Typography>
                            </Box>
                        </Card>
                    </Grid>

                </Grid>
            </Box >

            {/* Shows the star rating, optional reviews, and delete book message*/}
            < Divider sx={{ mt: 6, borderWidth: 1 }} />
            < Box sx={{ position: 'absolute', right: { lg: 6 } }}>
                {currentUser && hasSavedBook(book.volumeId)
                    ?
                    <>
                        <IconButton onClick={showBookDeleteMessage} aria-label="delete review" >
                            <HighlightOffIcon />
                        </IconButton>

                        <Modal
                            open={openBookDeleteMessage}
                            onClose={closeBookDeleteMessage}
                        >
                            <Box sx={{ ...style, border: 2, borderRadius: 2, width: { xs: 348, sm: 446, lg: 620 } }}>
                                <Box sx={{ mb: 2, mt: { xs: 2, lg: 1 }, mx: { xs: 2, lg: 3 } }}>
                                    <Typography sx={{ fontSize: { xs: '19px', lg: '17px' }, textAlign: 'center' }}>
                                        Are you sure you want to delete this book?
                                        Deleting this book will also delete your review and rating.
                                    </Typography>
                                </Box>

                                <Box sx={{ mt: 4, mb: .5, display: 'flex', justifyContent: 'center', gap: 2 }}>
                                    <Button onClick={removeSavedBook} variant="contained" sx={{ fontSize: { lg: '14px' } }} >OK</Button>
                                    <Button onClick={closeBookDeleteMessage} variant="contained" sx={{ fontSize: { lg: '14px' } }} >Cancel</Button>
                                </Box>
                            </Box>
                        </Modal>
                    </>
                    :
                    null}
            </Box >

            <Box component='h1'
                sx={{ fontSize: 27, mt: 3, textDecoration: 'underline', textAlign: 'center', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                My Rating:
            </Box>

            <Box component="section" sx={{ pb: 9, mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Rating rating={rating} setRating={setRating} addRating={addRating} updateRating={updateRating} hover={hover} setHover={setHover} />
            </Box>

            {/* Buttons to show review form and all reviews */}
            <Box component="section" sx={{ pb: 3, mr: { lg: 4 }, display: 'flex', gap: 2, justifyContent: { xs: 'center', lg: 'end' }, alignItems: 'center' }}>
                {!review && (
                    <>
                        <Button onClick={showReviewForm} variant="outlined" sx={{ fontSize: { lg: '13.5px' } }}>Write A Review</Button>
                    </>
                )}

                <Button onClick={showReviews} variant="outlined" sx={{ fontSize: { lg: '13.5px' } }}>All Reviews</Button>
            </Box>

            {/* User's review and all reviews */}
            <Divider sx={{ borderWidth: 1 }} />
            <div ref={scrollRef}>
                {review && <Review userReview={review} setReviewChange={setReviewChange} setRanFirstScroll={setRanFirstScroll} setScrollToReview={setScrollToReview} />}
            </div>

            <div ref={scrollRef}>
                {showAllReviews && <AllReviews allReviews={allReviews} setShowAllReviews={setShowAllReviews} />}
            </div>

            {/* Opens the review form */}
            <Modal
                open={openReviewForm}
                onClose={closeReviewForm}
            >
                <Box sx={{ ...style, width: { xs: 348, sm: 446, md: 600, lg: 620 } }}>
                    <ReviewForm setScrollToReview={setScrollToReview} book={book} addBook={addBook} setReviewChange={setReviewChange} setOpenReviewForm={setOpenReviewForm} setBookStatus={setBookStatus} />
                </Box>
            </Modal>

            {/* Message to login in if user is not logged in */}
            <div ref={scrollRef}>
                {error &&
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                        <TimedMessage setState={setError} />
                    </Box>
                }
            </div>
        </div >
    )
};

export default BookDetail;
