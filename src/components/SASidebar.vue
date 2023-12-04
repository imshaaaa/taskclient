<template>
  <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 h-full">
    <nav class="flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col gap-y-7">
        <li>
          <div class="-mx-2 space-y-2 mt-4">
            <router-link to="/superadmin/users"  class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-700 hover:text-white">Users</router-link>
            </div>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import { useUserStore } from '@/stores/user'
const user = useUserStore()
</script>