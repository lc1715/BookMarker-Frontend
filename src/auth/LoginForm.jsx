import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ShowAlert from '../common/ShowAlert';


/** Login form.
 *
 * Route is '/login'
 * 
 * Shows form and manages the update to formData state 
 * when values in input fields change.
 * 
 * On submission:
 * - calls the prop, login function, and redirects to homepage ('/')
 */

function LoginForm({ login }) {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [formErrors, setFormErrors] = useState([]);
    const navigate = useNavigate();

    /** Handles login form submission:
     * Calls the login function in App.jsx which will get token
     * If login successful and token received, returns { success: true }, and navigates to homepage
     * Otherwise returns { success: false, err }
     */
    async function handleSubmit(evt) {
        evt.preventDefault();
        let result = await login(formData);

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
                value={formData.value}
                onChange={handleChange}
            />

            <label htmlFor='password'>Password</label>
            <input
                id='password'
                type='password'
                name='password'
                value={formData.value}
                onChange={handleChange}
            />

            {formErrors.length ? <ShowAlert type='danger' messages={formErrors} /> : null}

            <button>Submit</button>
        </form>
    )
};

export default LoginForm;