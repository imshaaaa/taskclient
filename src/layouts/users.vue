<template>
  <div>
    <Topbar />
     <div class="flex flex-wrap">
       <div class="w-3/12 hidden sm:block">
         <Sidebar />
       </div>
       <div class="w-full sm:w-9/12">
        <div class="container h-screen px-4 sm:px-8 sm:py-4 lg:px-4">
         <RouterView />
        </div>
       </div>
     </div>
  </div>
</template>