import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import * as Store from '../store/index'
/* import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore' */


import { cloneDeep } from 'lodash'
beforeEach(() => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
})

test('Clears state when new state is called', () => {
  const store = new Vuex.Store(cloneDeep(Store))
  expect(store.state.admin).toBe(false)
  expect(store.state.employee).toBe(false)
  expect(store.state.error).toBe(null)
  expect(store.state.loading).toBe(false)
  expect(store.state.tables).toEqual([])
  expect(store.state.user).toBe(null)
  expect(store.state.reservations).toEqual([])
})

test('Updates getters admin and employee when set user is called with set user', () => {
  const store = new Vuex.Store(cloneDeep(Store))
  const user = {
    admin: true,
    employee: true,
  }
  expect(store.state.admin).toBe(false)
  expect(store.state.employee).toBe(false)
  store.commit('setUser', user)
  expect(store.state.admin).toBe(true)
  expect(store.state.employee).toBe(true)
})

test('Sets user when sign in is called with user object', () => {
  const store = new Vuex.Store(cloneDeep(Store))
  const user = {
    admin: true,
    employee: true,
    firstName: 'Sjef',
    lastName: 'Sjefesen'
  }
  store.commit('setUser', user)
  expect(store.getters.user).toBe(user)
})

test('Clear states when user is logged out', () => {
  const store = new Vuex.Store(cloneDeep(Store))
  const user = {
    admin: true,
    employee: true,
    firstName: 'Sjef',
    lastName: 'Sjefesen'
  }
  store.commit('setUser', user)
  expect(store.getters.user).toBe(user)
  store.commit('clearState')
  const emptyState = {
    admin: false,
    employee: false,
    error: null,
    loading: false,
    tables: [],
    todaysTables: [],
    user: null,
    reservations: []
  }
  expect(store.state).toEqual(emptyState)
})

test('Updates table when setTable is called with table', () => {
  const store = new Vuex.Store(cloneDeep(Store))
  const testTable = {
    tableID: 1,
    capacity: 2,
    currently: 3,
    occupied: true
  }
  expect(store.getters.tables.length).toBe(0)
  store.commit('setTable', testTable)
  expect(store.state.tables[0]).toBe(testTable)
})

test('Removes table when removeTable is called with table', () => {
  const store = new Vuex.Store(cloneDeep(Store))
  const testTable = {
    tableID: 1,
    capacity: 2,
    currently: 3,
    occupied: true
  }
  store.commit('setTable', testTable)
  expect(store.state.tables[0]).toBe(testTable)
  store.commit('removeTable', testTable)
  expect(store.getters.tables[testTable.tableID - 1]).toBe(null)
})
