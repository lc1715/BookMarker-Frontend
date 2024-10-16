import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


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
    const [error, setError] = useState('');
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
            setError('Please enter a search term');

            setTimeout(() => {
                setError('')
            }, 10000)
            return;
        };

        setError('');

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
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor='title'>Title:</label>
                    <input
                        id='title'
                        name='title'
                        value={formData.title}
                        onChange={handleChange}
                    />

                    <label htmlFor='author'>Author:</label>
                    <input
                        id='author'
                        name='author'
                        value={formData.author}
                        onChange={handleChange}
                    />

                    <label htmlFor='isbn'>ISBN:</label>
                    <input
                        id='isbn'
                        name='isbn'
                        value={formData.isbn}
                        onChange={handleChange}
                    />

                    <label htmlFor='keyword'>Keyword:</label>
                    <input
                        id='keyword'
                        name='keyword'
                        value={formData.keyword}
                        onChange={handleChange}
                    />

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {/* can also use ShowAlert Comp */}

                    <button>Submit</button>
                    <button type='button' onClick={() => (setOpenAdvancedSearch(false))}>Close</button>
                </form>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                id='term'
                placeholder='Search'
                name='term'
                value={formData.term}
                onChange={handleChange}
            />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button>Submit</button>
            <button type='button' onClick={() => (setOpenAdvancedSearch(true))}>Advanced Search</button>
        </form>
    )
};

export default BookSearchForm;
