/** Component for showing alert messages.
 *
 * LoginForm, SignupForm, ProfileForm are components using this.
 **/

function ShowAlert({ type = 'danger', messages = [] }) {
    console.debug('ShowAlert:', 'type=', type, 'messages=', messages);

    return (
        <div className={`alert alert-${type}`} role="alert">

            {messages.map(error => (
                <p key={error}>{error}</p>
            ))}

        </div>
    )
};

export default ShowAlert;