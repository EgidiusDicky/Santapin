<template>
  <div class="bg-white text-[#5B3A29]">
    <!-- Breadcrumb -->
    <nav aria-label="Breadcrumb" class="text-xs text-gray-600 mb-4 select-none px-6 sm:px-10 pt-6">
      <ol class="flex space-x-1 sm:space-x-2">
        <li>Menu</li>
        <li>/</li>
        <li class="truncate max-w-xs sm:max-w-md">{{ menu.name }}</li>
      </ol>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 sm:px-10 pb-16">
      <section class="flex flex-col sm:flex-row gap-8 sm:gap-12">
        <!-- Image -->
        <div class="flex-shrink-0 w-full sm:w-[400px] aspect-video bg-gray-200 rounded-lg overflow-hidden">
          <img :src="menu.image" :alt="menu.name" class="w-full h-full object-cover" />
        </div>

        <!-- Details -->
        <div class="flex-1">
          <h1 class="text-2xl font-extrabold mb-3">{{ menu.name }}</h1>
          <p class="text-sm mb-4 leading-relaxed max-w-xl">{{ menu.description }}</p>
          <p class="font-semibold text-[#7A4A39] mb-4 text-base">Rp. {{ menu.price.toLocaleString() }}</p>

          <!-- Quantity Control -->
          <div class="flex items-center space-x-3 mb-6">
            <button @click="decreaseQty" class="border border-[#7A4A39] text-[#7A4A39] rounded-md w-8 h-8 flex items-center justify-center text-lg font-semibold hover:bg-[#7A4A39] hover:text-white transition">−</button>
            <span class="text-base font-normal">{{ quantity }}</span>
            <button @click="increaseQty" class="border border-[#7A4A39] text-[#7A4A39] rounded-md w-8 h-8 flex items-center justify-center text-lg font-semibold hover:bg-[#7A4A39] hover:text-white transition">+</button>
          </div>

          <!-- Add to Cart Button -->
          <router-link to="/cart">
            <button class="w-full bg-[#7A4A39] text-white font-semibold rounded-md py-2 hover:bg-[#6a3f31] transition">
              Add to Cart
            </button>
          </router-link>

          <!-- Reviews -->
          <section class="mt-10 max-w-xl">
            <h2 class="font-semibold text-lg mb-3">Customer Reviews</h2>

            <div v-for="(review, index) in reviews" :key="index" class="mb-6">
              <p class="text-sm font-semibold mb-0.5">
                {{ review.name }}
                <span class="text-[#B94A2A] ml-1">
                  <i v-for="n in review.stars" :key="n" class="fas fa-star"></i>
                </span>
                <span class="text-xs text-gray-500 ml-2 font-normal">{{ review.date }}</span>
              </p>
              <p class="text-xs text-[#5B3A29] mt-1 leading-tight">{{ review.text }}</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const quantity = ref(1)

const menu = {
  name: 'Nasi Goreng Special',
  description: 'Nasi goreng dengan telur mata sapi, ayam, dan udang. Dibuat dengan bumbu rahasia khas Santapin dan disajikan dengan acar segar.',
  price: 45000,
  image: '/src/asset/Nasi Goreng Spesial.jpeg'
}

const reviews = [
  { name: 'Sarah K.', stars: 5, date: '2 days ago', text: 'Absolutely delicious! The flavors were perfectly balanced.' },
  { name: 'Michael R.', stars: 4, date: '1 week ago', text: 'Very tasty and generous portion. Would order again.' },
  { name: 'Linda T.', stars: 5, date: '2 weeks ago', text: "One of the best dishes I've had. The sauce was amazing!" }
]

const increaseQty = () => {
  quantity.value++
}

const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--
}
</script>
