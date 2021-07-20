import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDZbt6YnHYaVM9YLyjdfhiW6uARQ8FTl0E',
  authDomain: 'giros-venezuela-9d086.firebaseapp.com',
  databaseURL: 'https://giros-venezuela-9d086.firebaseio.com',
  projectId: 'giros-venezuela-9d086',
  storageBucket: 'giros-venezuela-9d086.appspot.com',
  messagingSenderId: '469537848334',
  appId: '1:469537848334:web:5ffc462c01f16bc3c9105f'
}

try {
  firebase.initializeApp(firebaseConfig)
} catch (err) {

}

const fireAuth = firebase.auth()
const fireStore = firebase.firestore()
const fireStorage = firebase.storage()

export { fireAuth, fireStore, fireStorage }
