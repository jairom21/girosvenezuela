export default function ({ redirect, store, route }) {
  if (store.getters['user/isAdmin']) {
    const path = route.path
    if (path.includes('/dashboard')) {
      redirect('/admin')
    }
  }
}
