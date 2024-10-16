import BookMarkerApi from "../api/api";


/**getNYTBooks Function
 * 
 * - gets the nyt book list and timestamp from local storage
 * - checks if nyt book list was stored in local storage for 1 week  
 * - if nyt book list has been in local storage for less than 1 week, return stored nyt book list
 * - otherwise return new nyt book list with new timestamp 
 * -component using getNYTBooks: Homepage
 * 
 */

const getNYTBooks = async () => {
    //get the stored books and timestamp when books were first stored from local storage
    const storedBooks = JSON.parse(localStorage.getItem("nytBooks"));
    const firstTimeStamp = localStorage.getItem("nytBooksTimestamp");

    const oneWeek = 7 * 24 * 60 * 60 * 1000;  // One week in milliseconds
    const currentTimeStamp = new Date().getTime();  //Number of milliseconds as of now

    // Check if books are in local storage and if they are older than a week
    if (storedBooks && firstTimeStamp && currentTimeStamp - firstTimeStamp < oneWeek) {
        return { storedBooks };       // Use cached data if within one week
    } else {
        // Clear old data if it's over a week old
        localStorage.removeItem("nytBooks");
        localStorage.removeItem("nytBooksTimestamp");
        //Request new data from NYT Books API
        const newBooks = await BookMarkerApi.getNYTBestsellerList();
        return { newBooks, currentTimeStamp };  //return object with newBooks and currentTimeStamp properties
    }
};

export default getNYTBooks;
