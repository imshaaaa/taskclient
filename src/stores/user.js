import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      approved: '',
      authenticated: '',
      token: ''
    }
  },
  actions: {
    setUser(user) {
      this.id = user.userData.id
      this.firstName = user.userData.firstName
      this.lastName = user.userData.lastName
      this.email = user.userData.email
      this.role = user.userData.role
      this.approved = user.userData.approved
      this.authenticated = user.auth
      this.token = user.token
    }
  },
  persist: true
})