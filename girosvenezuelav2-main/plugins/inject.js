import { fireAuth, fireStore, fireStorage } from '~/firebase/init'

// -------------------------------------------
// firebase
// -------------------------------------------

export default ({ app }, inject) => {
  inject('fireAuth', fireAuth)
  inject('fireStore', fireStore)
  inject('fireStorage', fireStorage)
}
