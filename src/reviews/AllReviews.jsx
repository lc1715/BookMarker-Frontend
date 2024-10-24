//show all reviews on a book
function AllReviews({ allReviews, setShowAllReviews }) {
    if (!allReviews.length) {
        return (
            <div>
                <p>There are no reviews. Be the first to write a review!</p>

                <button onClick={() => (setShowAllReviews(false))}>Hide</button>
            </div>
        )
    }

    return (
        <div>
            {allReviews.map((review) => (
                <div key={review.id}>
                    <p>All Reviews:</p>
                    <p>{review.username} {review.comment} {review.created_at.slice(0, 10)}</p>
                </div>
            ))}

            <button onClick={() => (setShowAllReviews(false))}>Hide</button>
        </div>
    )
};

export default AllReviews;