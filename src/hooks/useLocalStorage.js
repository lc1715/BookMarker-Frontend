import { useEffect, useState } from 'react';

/** Custom hook for keeping state synced with localStorage.
 *
 * This creates `item` as the state and looks in localStorage for the current value
 * (if not found, defaults to `firstValue`)
 *
 * When `item` changes, useEffect re-runs:
 * - if the new state is null, it gets removed from localStorage
 * - else, it gets set into localStorage
 *
 * To the Component, this acts like state that is synced to/from localStorage:
 * const [value, setValue] = useLocalStorage(keyName)
 */

function useLocalStorage(keyName, firstValue = null) {
    const initialValue = localStorage.getItem(keyName) || firstValue;

    const [item, setItem] = useState(initialValue);

    useEffect(function setKeyInLocalStorage() {
        if (item === null) {
            localStorage.removeItem(keyName);
        } else {
            localStorage.setItem(keyName, item)
        }
    }, [item, keyName])

    return [item, setItem];
}

export default useLocalStorage;