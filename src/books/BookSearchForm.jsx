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

    //create advanced search term
    function advancedSearchTerm() {
        let advancedTerm = '';

        advancedTerm += formData.title ? `intitle:${formData.title}+` : '';
        advancedTerm += formData.author ? `inauthor:${formData.author}+` : '';
        advancedTerm += formData.isbn ? `inisbn:${formData.isbn}+` : '';
        advancedTerm += formData.keyword ? `${formData.keyword}` : '';

        // remove '+' at end of string
        if (advancedTerm[advancedTerm.length - 1] === '+') {
            advancedTerm = advancedTerm.slice(0, -1);
        }

        return advancedTerm;
    }
    // advancedTerm = 'inauthor:michael crichton+intitle:airframe'

    //on form submit, check that search terms exist and navigate to BookList component
    async function handleSubmit(evt) {
        evt.preventDefault();
        let advancedTerm = advancedSearchTerm();

        //check if term is an empty string because user did not fill in search fields
        if (formData.term === '' && advancedTerm === '') {
            return;
        };

        //navigate to BookList component 
        if (formData.term) {
            navigate(`/books/search/${formData.term}`);
        } else {
            navigate(`/books/search/${advancedTerm}`);
        }

        setFormData(initialState);
    };

    //Handles changing form data
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
                                sx={{ width: { xs: 235, sm: '100%' } }}
                            />
                        </FormControl>

                        <FormControl sx={{ m: 1 }} variant="outlined">
                            <OutlinedInput
                                id="AdvancedSearchBar-Author"
                                placeholder='Author'
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                sx={{ width: { xs: 235, sm: '100%' } }}
                            />
                        </FormControl>

                        <FormControl sx={{ m: 1 }} variant="outlined">
                            <OutlinedInput
                                id="AdvancedSearchBar-Keyword"
                                placeholder='Keyword'
                                name="keyword"
                                value={formData.keyword}
                                onChange={handleChange}
                                sx={{ width: { xs: 235, sm: '100%' } }}
                            />
                        </FormControl>

                        <FormControl sx={{ m: 1 }} variant="outlined">
                            <OutlinedInput
                                id="AdvancedSearchBar-ISBN"
                                placeholder='ISBN'
                                name="isbn"
                                value={formData.isbn}
                                onChange={handleChange}
                                sx={{ width: { xs: 235, sm: '100%' } }}
                            />
                        </FormControl>

                        <Box sx={{ mt: { xs: 1, md: 0 }, width: { xs: '100%', md: 'auto' }, display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                size="medium"
                                sx={{ mt: 1, ml: .5, height: '54px', minWidth: 'unset', width: '59px', backgroundColor: '#748cab' }}
                                onClick={handleSubmit}
                                type='submit'
                            >
                                <SearchIcon sx={{ fontSize: '31px' }} />
                            </Button>

                            <Button
                                variant="contained"
                                size="medium"
                                sx={{ mt: 1, ml: 1.5, height: '54px', minWidth: 'unset', width: '59px', backgroundColor: '#748cab' }}
                                onClick={() => (setOpenAdvancedSearch(false))}
                            >
                                <i class="fa-solid fa-up-down-left-right fa-2xl"></i>
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
                                    aria-label="search"
                                    size="large"
                                    onClick={handleSubmit}
                                    type='submit'
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>

                <Button
                    variant="contained"
                    sx={{ mt: 1, mr: 2, ml: .5, height: '54px', minWidth: 'unset', width: '59px', backgroundColor: '#748cab' }}
                    onClick={() => (setOpenAdvancedSearch(true))}
                >
                    <i class="fa-solid fa-up-down-left-right fa-2xl"></i>
                </Button>
            </Box >
        </form >
    )
};

export default BookSearchForm;
