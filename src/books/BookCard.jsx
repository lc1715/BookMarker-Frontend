import { Link } from "react-router-dom";
import removeHtmlTags from '../common/removeTags';
import defaultBookImage from '../assets/bookImage.jpg'
//Material UI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';


/** BookCard 
 * 
 * - receives book as prop
 * - check if book contains isbn or volumeId property 
 * - {book} = {isbn or volumeId, title, author, description, image}
 * - show the book info 
 * 
 * - component using BookCard: BookList
 */

function BookCard({ book }) {
    console.log('book=', book)

    let bookId;
    let bookIdType;

    if (book.isbn) {
        bookId = book.isbn;
        bookIdType = 'isbn';
    } else {
        bookId = book.volumeId;
        bookIdType = 'volumeId'
    }
    console.log('book.descriptiopn', book.description)
    console.log('book.image', book.image)

    return (
        <Card sx={{ minWidth: { xs: 275, lg: 265 }, maxWidth: 150, minHeight: { xs: 500, lg: 485 }, mx: 5.5, mb: 5, backgroundColor: '#FCFBF4' }}>
            < Link to={`/books/${bookIdType}/${bookId}`} style={{ textDecoration: 'none' }}>
                <Box component="section" sx={{ p: 9, pt: 2, pb: 3 }}>
                    <CardMedia
                        component="img"
                        alt="book image"
                        height="auto"
                        image={book.image ? book.image : defaultBookImage}
                        sx={{ borderRadius: 2, width: { xs: '100%', lg: '99%' } }}
                    />
                </Box>

                <CardContent>
                    <Typography sx={{ color: 'text.primary', fontSize: { xs: 19, lg: 18 }, fontWeight: 'bold', textAlign: 'center' }}>
                        {book.title}
                    </Typography>

                    <Typography sx={{ color: 'text.primary', fontSize: { xs: 17, lg: 16 }, mb: 1.5, mt: 1.5, textAlign: 'center' }} >
                        By {book.author}
                    </Typography>

                    <Typography sx={{ color: 'text.primary', fontSize: { xs: 17, lg: 16 }, mb: 3, mt: 1.5, mx: 2, textAlign: 'center' }}>
                        {!book.description ? '' : removeHtmlTags(book.description).length > 200 ? removeHtmlTags(book.description).slice(0, 200) + '...' : removeHtmlTags(book.description)}
                    </Typography>
                </CardContent>
            </Link >
        </Card >
    )
};

export default BookCard;
