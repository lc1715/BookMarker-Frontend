import axios from 'axios';

const BASE_URL = process.env.VITE_BASE_URL || "http://localhost:3001"

/** API Class.
 *
 * Static class tying together methods used to get/send to the API.
 *
 */

class BookMarkerApi {
    //store the received token
    static token;

    static async request(endpoint, data = {}, method = "get") {
        console.debug('API Call:', endpoint, data, method)

        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${BookMarkerApi.token}` };
        const params = (method === "get") ? data : {};

        try {
            return (await axios(url, method, data, params, headers)).data;
        }
        catch (err) {
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    /**Individual API Routes */

    /**Sign up and get token from username, password and email*/
    static async signup(data) {
        const res = await this.request(`/users/register`, data, "post");
        return res.token;
    }

    /**Log in and get token from username and password */
    static async login(data) {
        const res = await this.request(`/users/login`, data, "post");
        return res.token;
    }

    /**Get the current user 
     * Returns: { id, username, email, saved_booksId: [id, ...]}}
    */
    static async getCurrentUser(username) {
        const res = await this.request(`/users/${username}`);
        return res.user;
    }

    /**Update user's profile
     * Data: email
     * Returns: { id, username, email }}
     */
    static async updateUserProfile(data) {
        const res = await this.request(`/users/${username}`, data, "patch");
        return res.user;
    }

    /**Delete a user
     * Returns: username
     */
    static async deleteUser(username) {
        const res = await this.request(`/users/${username}`, "delete");
        return res.deleted;
    }


    /**For User's Saved Books */

    /**Add a book to saved books
     * Data: {volume_id, title, author, publisher, category, description, image, has_read}
     * Returns: {id, user_id, volume_id, title, author, publisher, category, description, image, has_read}
     */
    static async addSavedBooks(username, volumeId, data) {
        const res = await this.request(`/savedbooks/${volumeId}/user/${username}`, data, "post");
        return res.savedBook;
    }

    /**Update a saved book status to Read or Wish To Read 
     * Data: {id, username, and data}
     * Returns: {id, user_id, volume_id, title, author, publisher, category, description, image, has_read}
     */
    static async changeBookStatus(savedBookId, username, data) {
        const res = await this.request(`/savedbooks/${savedBookId}/user/${username}`, data, "patch");
        return res.updatedBook;
    }

    /**Get all books in Read status
     * Data: {has_read = true} 
     * Returns: {id, user_id, volume_id, title, author, publisher, category, description, image, has_read}
     */
    static async getReadBooks(username, data) {
        const res = await this.request(`/savedbooks/read/user/${username}`, data);
        return res.readBooks;
    }

    /**Gets all books in Wish To Read status
     * Data: {has_read = false} 
     * Returns:{id, user_id, volume_id, title, author, publisher, category, description, image, has_read}
     */
    static async getWishBooks(username, data) {
        const res = await this.request(`/savedbooks/wish/user/${username}`, data);
        return res.wishBooks;
    }

    /**Get a saved book with review and rating.
     * Returns: {id, user_id, volume_id, title, author, publisher, category, description image, has_read, 
     *           review: {id, saved_book_id, user_id, comment, created_at, volume_id} or 'None',
     *           rating: {id, saved_book_id, user_id, rating, volume_id} or 'None'} 
     */
    static async getSavedBook(savedBookId, username) {
        const res = await this.request(`/savedbooks/${savedBookId}/user/${username}`);
        return res.savedBook;
    }

    /**Delete saved book 
     * Returns: id
     */
    static async deleteSavedBook(savedBookId, username) {
        const res = await this.request(`/savedbooks/${savedBookId}/user/${username}`, "delete");
        return res.deletedBook;
    }


    /**For User's Reviews */

    /**Add book review
     * Data: {comment, volume_id}
     * Returns: {id, comment, saved_book_id, user_id, volume_id, created_at}
     */
    static async addReview(savedBookId, username, data) {
        const res = await this.request(`/reviews/savedbook/${savedBookId}/user/${username}`, data, "post");
        return res.review;
    }

    /**Update book review 
     * Data: {comment}
     * Returns: {id, comment, saved_book_id, user_id, volume_id, created_at}
     */
    static async updateReview(reviewId, username, data) {
        const res = await this.request(`/reviews/${reviewId}/user/${username}`, data, "patch");
        return res.updatedReview;
    }

    /**Get all book reviews 
     * Returns: [{id, comment, created_at, volume_id, saved_book_id, user_id, username}, ...]
     */
    static async getAllReviews(volumeId) {
        const res = await this.request(`/reviews/${volumeId}`);
        return res.allReviews;
    }

    /**Delete book review
     * Returns: id
     */
    static async deleteReview(reviewId, username) {
        const res = await this.request(`/reviews/${reviewId}/user/${username}`, "delete");
        return res.deletedReview;
    }


    /**For User's Book Rating */

    /**Add a book rating
     * Data: {rating, volume_id}
     * Returns: {id, rating, saved_book_id, user_id, volume_id}
     */
    static async addRating(savedBookId, username, data) {
        const res = await this.request(`/ratings/savedbook/${savedBookId}/user/${username}`, data, "post");
        return res.rating;
    }

    /**Update a book rating
     * Data: {rating}
     * Returns: {id, rating, saved_book_id, user_id, volume_id}
     */
    static async updateRating(ratingId, username, data) {
        const res = await this.request(`/ratings/${ratingId}/user/${username}`, data, "patch");
        return res.updatedRating;
    }

    /**Get a book rating
     * Returns: {id, rating, saved_book_id, user_id, volume_id}
     */
    static async getRating(savedBookId, username) {
        const res = await this.request(`/ratings/${savedBookId}/user/${username}`);
        return res.rating;
    }


    /**For Books Routes*/

    /**Get list of books from Google Books API
     * Returns: [{book1}, {book2}, ...]
    */
    static async getGoogleBooksList(term) {
        const res = await this.request(`/books/?term=${term}`);
        return res;
    }

    /**Get a detailed book from Google Books API
     * Returns: {book}
    */
    static async getGoogleBook(volumeId) {
        const res = await this.request(`/books/details/${volumeId}`);
        return res;
    }

    /**Get list of NYT current bestseller books 
     * Returns: [{book1}, {book2}, ...]
    */
    static async getNYTBestsellerList() {
        const res = await this.request(`/books/bestsellers`);
        return res;
    }

    /**From NYT bestsellers list, use isbn to get detailed book from Google Books API 
     * Returns: {book}
    */
    static async getGoogleBookFromNYT(isbn) {
        const res = await this.request(`/books/bestsellers/details/${isbn}`);
        return res;
    }
}

export default BookMarkerApi;

