export default function ({ store, redirect, route }) {
  if (!store.getters.user) {
    return redirect('/login')
  }
}
