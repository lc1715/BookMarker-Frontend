import UserContext from "./auth/UserContext";

const demoUser = {
    id: 1,
    username: 'testUser',
    email: 'test@email.com',
    volume_ids: ['e3', 't5'],
}

const UserProvider =
    ({ children, currentUser = demoUser, hasSavedBook = () => (true) }) => (
        <UserContext.Provider value={{ currentUser, hasSavedBook }}>
            {children}
        </UserContext.Provider>
    );

export { UserProvider };
