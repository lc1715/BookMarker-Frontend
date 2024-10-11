import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ShowAlert from '../common/ShowAlert';


/** Signup form.
 *
 * Route is '/signup'
 * 
 * Shows form and manages the update to formData state 
 * when values in input fields change.
 * 
 * On submission:
 * - calls the prop, signup function, and redirects to homepage ('/')
 */

function SignupForm({ signup }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });

    const [formErrors, setFormErrors] = useState([]);
    const navigate = useNavigate();

    /** Handles signup form submission:
     * Calls the signup function in App.jsx which will get token
     * If signup successful and token received, returns { success: true }, and navigates to homepage
     * Otherwise returns { success: false, err }
     */
    async function handleSubmit(evt) {
        evt.preventDefault();
        let result = await signup(formData);

        if (result.success) {
            navigate('/');
        } else {
            setFormErrors(result.err);
        }
    }

    /**Update the state, formData, and render those changes in the input fields */
    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(data => ({ ...data, [name]: value }));
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor='username'>Username</label>
            <input
                id='username'
                name='username'
                value={formData.username}
                onChange={handleChange}
            />

            <label htmlFor='password'>Password</label>
            <input
                id='password'
                name='password'
                type='password'
                value={formData.password}
                onChange={handleChange}
            />

            <label htmlFor='email'>Email</label>
            <input
                id='email'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
            />

            {formErrors.length ? <ShowAlert type='danger' messages={formErrors} /> : null}

            <button>Submit</button>
        </form>
    )
};

export default SignupForm;