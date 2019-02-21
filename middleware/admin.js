export default function ({ store, redirect, route }) {
  if (!store.getters.admin) {
    return redirect('/dashboard')
  }
}
