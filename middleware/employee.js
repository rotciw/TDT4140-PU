export default function ({ store, redirect, route }) {
  if (!store.getters.employee) {
    return redirect('/dashboard')
  }
}
