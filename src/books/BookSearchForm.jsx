import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';


function BookSearchForm() {
    const initialState = {
        term: '',
        title: '',
        author: '',
        isbn: '',
        keyword: ''
    }
    const [formData, setFormData] = useState(initialState);
    const [openAdvancedSearch, setOpenAdvancedSearch] = useState(false);
    const navigate = useNavigate();

    // Create advanced search term
    function advancedSearchTerm() {
        let advancedTerm = '';
        advancedTerm += formData.title ? `intitle:${formData.title}+` : '';
        advancedTerm += formData.author ? `inauthor:${formData.author}+` : '';
        advancedTerm += formData.isbn ? `inisbn:${formData.isbn}+` : '';
        advancedTerm += formData.keyword ? `${formData.keyword}` : '';

        if (advancedTerm[advancedTerm.length - 1] === '+') {
            advancedTerm = advancedTerm.slice(0, -1);
        }

        return advancedTerm;
    }

    // On form submit, check that search terms exist and navigate to BookList component
    async function handleSubmit(evt) {
        evt.preventDefault();
        let advancedTerm = advancedSearchTerm();

        if (formData.term === '' && advancedTerm === '') {
            return;
        }

        if (formData.term) {
            navigate(`/books/search/${formData.term}`);
        } else {
            navigate(`/books/search/${advancedTerm}`);
        }

        setFormData(initialState);
    };

    // Handles form data changing
    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData((data) => ({ ...data, [name]: value }));
    }

    if (openAdvancedSearch) {
        return (
            <Box sx={{ my: 3, display: 'flex', justifyContent: 'center' }}>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <FormControl sx={{ m: 1 }} variant="outlined">
                            <OutlinedInput
                                id="AdvancedSearchBar-Title"
                                placeholder='Title'
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                sx={{ width: { xs: 235, sm: '100%' }, height: { lg: '55px' } }}
                                inputProps={{ sx: { fontSize: { lg: '15.8px' } } }}
                            />
                        </FormControl>

                        <FormControl sx={{ m: 1 }} variant="outlined">
                            <OutlinedInput
                                id="AdvancedSearchBar-Author"
                                placeholder='Author'
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                sx={{ width: { xs: 235, sm: '100%' }, height: { lg: '54px' } }}
                                inputProps={{ sx: { fontSize: { lg: '15.8px' } } }}
                            />
                        </FormControl>

                        <FormControl sx={{ m: 1 }} variant="outlined">
                            <OutlinedInput
                                id="AdvancedSearchBar-Keyword"
                                placeholder='Keyword'
                                name="keyword"
                                value={formData.keyword}
                                onChange={handleChange}
                                sx={{ width: { xs: 235, sm: '100%' }, height: { lg: '54px' } }}
                                inputProps={{ sx: { fontSize: { lg: '15.8px' } } }}
                            />
                        </FormControl>

                        <FormControl sx={{ m: 1 }} variant="outlined">
                            <OutlinedInput
                                id="AdvancedSearchBar-ISBN"
                                placeholder='ISBN'
                                name="isbn"
                                value={formData.isbn}
                                onChange={handleChange}
                                sx={{ width: { xs: 235, sm: '100%' }, height: { lg: '54px' } }}
                                inputProps={{ sx: { fontSize: { lg: '15.8px' } } }}
                            />
                        </FormControl>

                        <Box sx={{ mt: { xs: 1, lg: 0 }, width: { xs: '100%', lg: 'auto' }, display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                size="medium"
                                sx={{ mt: 1, ml: .4, height: '54px', minWidth: 'unset', width: { xs: '59px', lg: '56px' }, backgroundColor: '#748cab' }}
                                onClick={handleSubmit}
                                type='submit'
                                aria-label="search"
                            >
                                <SearchIcon sx={{ fontSize: { xs: '33px', lg: '31px' } }} />
                            </Button>

                            <Button
                                variant="contained"
                                size="medium"
                                sx={{ mt: 1, ml: 1.5, height: '54px', minWidth: 'unset', width: { xs: '59px', lg: '56px' }, backgroundColor: '#748cab' }}
                                onClick={() => (setOpenAdvancedSearch(false))}
                                aria-label="advanced search"
                            >
                                <i className="fa-solid fa-up-down-left-right fa-2xl"></i>
                            </Button>
                        </Box>
                    </Box>
                </form >
            </Box >
        )
    }

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ my: 3, width: '100%', display: 'flex', justifyContent: 'center' }}>
                <FormControl sx={{ m: 1, ml: 2, width: '950px' }} variant="outlined">
                    <OutlinedInput
                        id="SearchBar"
                        placeholder='Search'
                        name="term"
                        value={formData.term}
                        onChange={handleChange}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    size="large"
                                    onClick={handleSubmit}
                                    type='submit'
                                    aria-label="search"
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>

                <Button
                    variant="contained"
                    sx={{ mt: 1, mr: 2, ml: .5, height: { xs: '55px', lg: '54px' }, minWidth: 'unset', width: '59px', backgroundColor: '#748cab' }}
                    onClick={() => (setOpenAdvancedSearch(true))}
                    aria-label="advanced search"
                >
                    <i className="fa-solid fa-up-down-left-right fa-2xl"></i>
                </Button>
            </Box >
        </form >
    )
};

export default BookSearchForm;
