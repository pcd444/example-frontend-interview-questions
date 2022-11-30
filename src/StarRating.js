import { useState } from 'react';

function StarRating(props) {
    const [rating, setRating] = useStateResetingOnFailure(null);
    return (
        <div>
            {[1, 2, 3, 4, 5].map(v => <Star index={v} rating={rating} setRating={setRating} />)}
        </div>
    );

}

function Star(props) {
    return (
        <button style={{ 'backgroundColor': props.index <= props.rating ? 'blue' : 'red' }} onClick={() => props.setRating(props.index, fakeFetch)}>{props.index}</button>
    );
}

function useStateResetingOnFailure(initial) {
    // Manages the state that needs to be confirmed through network request.
    let [state, setState] = useState(initial);
    // Used to freeze the state while the network request is ongoing.
    let [frozen, setFrozen] = useState(false);
    const setStateReseting = (newState, promiseGenerator) => {
        // promiseGenerator is a function that sends the side effect and returns a promise. Like fetch.
        if (frozen)
            return
        setFrozen(true);
        let promise = promiseGenerator();
        setState(newState);
        promise.then(() => {
            setFrozen(false);
        }).catch(
            () => {
                setFrozen(false);
                setState(state);
            }
        );
    }

    return [state, setStateReseting];
}

function fakeFetch() {
    const id = Math.random()
    console.log(`fakeFetch made, id=${id}`)
    return new Promise((res, rej) => {
        setTimeout(() => {
            if (Math.random() > .5) {
                console.log(`fakeFetch resolved, id=${id}`)
                res();
            }
            else {
                console.log(`fakeFetch rejected, id=${id}`)
                rej();
            }
        }, Math.random() * 1000);
    })
}

export { StarRating };