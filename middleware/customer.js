export default function ({ store, redirect, route }) {
  if (!store.getters.customer) {
    return redirect('/dashboard')
  }
}
