<template>
  <Disclosure as="nav" class="bg-white shadow mb-4 md:mb-0" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <img src="../assets/logo.svg" class="h-10 w-10 -mt-2 inline-block">
            <span class="text-xl text-gray-700 ">Task Tracking Tool</span>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:block">
          <div class="flex items-center">

            <!-- Profile dropdown -->
            <Menu as="div" class="relative ml-3">
              <div class="flex justify-between space-x-2">
                <p class="text-md font-bold text-gray-600">{{ user.firstName }} {{ user.lastName }}</p>
                <MenuButton
                  class="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-500 -mt-1">
                  <span class="sr-only">Open user menu</span>
                  <span class="bg-indigo-500 text-white rounded-full px-1.5 py-1">{{ user.firstName.split(" ").map(w =>
                    w.charAt(0)).join("").toUpperCase() }}{{ user.lastName.charAt(0).toUpperCase() }}</span>
                </MenuButton>
              </div>
              <transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <MenuItems
                  class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <MenuItem v-slot="{ active }">
                  <a @click="logout" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Sign
                    out</a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>

        <div class="-mr-2 flex sm:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton
            class="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
      </div>
    </div>

    <!-- mobile view -->
    <DisclosurePanel class="sm:hidden" v-slot="{ close }">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <router-link to="/superadmin/users" @click="closeMenu(close)"
          class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-700 hover:text-white">Users</router-link>
      </div>
      <div class="border-t border-gray-300 pb-3 pt-4">
        <div class="flex items-center px-5">
          <div class="flex-shrink-0">
            <span class="bg-indigo-500 text-white rounded-full px-2.5 py-2.5">{{ user.firstName.split(" ").map(w =>
              w.charAt(0)).join("").toUpperCase() }}{{ user.lastName.charAt(0).toUpperCase() }}</span>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-600">{{ user.firstName }} {{ user.lastName }}</div>
            <div class="text-sm font-medium text-gray-500">{{ user.email }}</div>
          </div>
        </div>
        <div class="mt-3 space-y-1 px-2">
          <DisclosureButton as="a" @click="toProfile"
            class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-700 hover:text-white">
            Profile</DisclosureButton>
          <DisclosureButton as="a" @click="logout"
            class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-700 hover:text-white">Sign
            out</DisclosureButton>
        </div>
      </div>
    </DisclosurePanel>
    <!-- /mobile view -->
  </Disclosure>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toast-notification'

const $toast = useToast()
const router = useRouter()
const route = useRoute()
const user = useUserStore()

const closeMenu = (close) => close()

console.log(user)

const logout = async () => {
  user.$reset()
  router.push(`/login`)
  $toast.success('Successfully logged out!', {position: 'top-right'})
}

const toProfile = () => router.push(`/superadmin/profile`)
</script>