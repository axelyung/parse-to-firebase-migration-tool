import Firebase from 'firebase';
import { excludeFields } from './parse'

export function firebaseInit(firebaseConfig) {
    return Firebase.initializeApp(firebaseConfig);
}

export async function authenticate(authId) {
    let provider;
    switch (authId) {
        case 'fb':
            provider = new Firebase.auth.FacebookAuthProvider();
            break
        case 'gh':
            provider = new Firebase.auth.GithubAuthProvider();
            break
        case 'g':
            provider = new Firebase.auth.GoogleAuthProvider();
            break
        case 't':
            provider = new Firebase.auth.TwitterAuthProvider();
            break
    }
    if (provider)
        return await Firebase.auth().signInWithPopup(provider)
}

export function firebaseFormat(parseObjs, dbConfig) {
    let node = {}
    parseObjs.forEach(parseObj => {
        let id = parseObj.id;
        let row = excludeFields(parseObj, dbConfig);
        row.id = id;
        node[id] = row;
    })
    return node;
}

export function pushToFirebase(nodeName, nodeData) {
    return Firebase.database().ref(`/${nodeName}`).set(nodeData);
}

export function signOut() {
    return Firebase.auth().signOut();
}

export function subscribeToAuthChange(cbFn) {
    Firebase.auth().onAuthStateChanged(user => {
        cbFn(user);
    });
}