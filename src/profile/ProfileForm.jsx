import { useState, useContext } from 'react';
import ShowAlert from '../common/ShowAlert';
import BookMarkerApi from '../api/api';
import UserContext from '../auth/UserContext';


/** Edit profile form.
 * 
 * Route: /profile
 * Displays profile form
 * Submitting the form calls the BookMarkerApi to update user profile
 * If successful, triggers current user to be reloaded throughout the site and
 * shows successful alert message
 */
function ProfileForm() {
    const { currentUser, setCurrentUser } = useContext(UserContext);

    const [formData, setFormData] = useState({
        username: currentUser.username,
        email: currentUser.email
    });

    const [formErrors, setFormErrors] = useState([]);
    const [isSaved, setIsSaved] = useState(false);


    /** on form submit:
     * - attempt to save new user info to backend & report any errors
     * - if successful
     *   - clear previous error messages
     *   - show successful alert message
     *   - set new current user info throughout the site
     */
    async function handleSubmit(evt) {
        evt.preventDefault();
        let username = formData.username;
        let newEmail = formData.email;
        let updatedUser;

        try {
            updatedUser = await BookMarkerApi.updateUserProfile(username, { email: newEmail });
        } catch (err) {
            setFormErrors(err);
            return;
        }

        setFormErrors([]);
        setIsSaved(true);
        // trigger reloading of current user information throughout the site
        setCurrentUser(updatedUser);

        setTimeout(() => {
            setIsSaved(false)
        }, 3000)
    };

    /** Handle form info changing*/
    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(data => ({ ...data, [name]: value }));
        setFormErrors([]);
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor='username'>Username</label>
            <input
                id='username'
                name='username'
                value={formData.username}
                disabled={true}
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

            {isSaved ? <ShowAlert type='success' messages={['Updated successfully']} /> : null}

            <button>Submit</button>
        </form>

    )
};

export default ProfileForm;