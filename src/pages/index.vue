<template>
  <div>
    <div class="relative">
      <svg
        class="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true">
        <defs>
          <pattern id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527" width="200" height="200" x="50%" y="-1"
            patternUnits="userSpaceOnUse">
            <path d="M100 200V.5M.5 .5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y="-1" class="overflow-visible fill-gray-50">
          <path d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
            stroke-width="0" />
        </svg>
        <rect width="100%" height="100%" stroke-width="0" fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
      </svg>

      <div class="flex justify-between">
        <div class="mx-auto max-w-7xl px-10 py-24 w-full sm:w-1/2">
          <div class="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <h1 class="mt-10 max-w-lg text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">A better way to manage
              your task</h1>
            <p class="mt-6 text-lg leading-8 text-gray-600">Effective solutions to manage your tasks more efficiently and
              effectively, with powerful features and an intuitive interface that you can organize, track, and complete
              your tasks with ease.</p>
            <div class="mt-10 flex items-center gap-x-6">
              <router-link to="/login"
                class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Get
                started</router-link>
            </div>
          </div>
        </div>
        <div class="mx-auto max-w-7xl px-6 hidden sm:block sm:w-1/2 ">
          <img class="rounded-lg -mt-12" src="../assets/landing1.jpg">
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: index
</route>
