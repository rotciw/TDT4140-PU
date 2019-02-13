// Checks that the user is logged in. Redirected to login page if not
export default function ({ store, redirect, route }) {
  if (!store.state.user || store.state.user === null) {
    return redirect('/login')
  }
  else if (route.path === '/login') {
    return redirect('/dashboard')
  }
}
