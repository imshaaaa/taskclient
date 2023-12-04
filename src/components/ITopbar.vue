<template>
  <Disclosure as="nav" class="bg-white mb-4 md:mb-0 mt-2" v-slot="{ open }">
    <div class="px-4">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <img src="../assets/logo.svg" class="h-10 w-10 -mt-2 inline-block">
            <span class="text-xl text-gray-700 ">Task Tracking Tool</span>
          </div>
        </div>
      </div>
    </div>
  </Disclosure>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
</script>