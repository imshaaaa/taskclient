<template>
    <main class="flex justify-center items-center h-screen bg-white p-4">
    <div class="text-center -mt-52">
      <p class="text-3xl text-indigo-600 font-medium">404</p>
      <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900">Page not found</h1>
      <p class="my-6 text-base leading-7 text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p>
        <router-link to="/" class="ounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Go back home</router-link>
    </div>
  </main>
</template>

<script></script>

<route lang="yaml">
meta:
  layout: users
</route>