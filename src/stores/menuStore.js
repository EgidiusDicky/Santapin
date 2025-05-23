import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenuStore = defineStore('menu', () => {
const menuItems = ref([
    {
        id: 1,
        name: 'Nasi Goreng',
        description: 'Nasi goreng khas Indonesia.',
        price: 25000,
        image: '/asset/Nasi Goreng.jpeg',
        category: 'Makanan',
    },
    {
        id: 2,
        name: 'Es Teh Manis',
        description: 'Minuman dingin teh manis.',
        price: 8000,
        image: '/asset/Es Teh Manis.jpeg',
        category: 'Minuman',
    },
    {
        id: 3,
        name: 'Mie Ayam',
        description: 'Mie ayam dengan topping melimpah.',
        price: 20000,
        image: '/asset/Mie Ayam.jpeg',
        category: 'Makanan',
    },
    {
        id: 4,
        name: 'Jus Alpukat',
        description: 'Jus alpukat segar.',
        price: 15000,
        image: '/asset/Jus Alpukat.jpeg',
        category: 'Minuman',
    },
    {
        id: 5,
        name: 'Sate Ayam',
        description: 'Sate ayam dengan bumbu kacang khas.',
        price: 30000,
        image: '/asset/Sate Ayam.jpeg',
        category: 'Makanan',
    },
    {
        id: 6,
        name: 'Bakso',
        description: 'Semangkuk bakso sapi dengan kuah gurih.',
        price: 22000,
        image: '/asset/Bakso.jpeg',
        category: 'Makanan',
    },
    {
        id: 7,
        name: 'Rendang',
        description: 'Rendang daging sapi khas Padang.',
        price: 35000,
        image: '/asset/Rendang.jpeg',
        category: 'Makanan',
    },
    {
        id: 8,
        name: 'Es Jeruk',
        description: 'Minuman jeruk segar dingin.',
        price: 9000,
        image: '/asset/Es Jeruk.jpeg',
        category: 'Minuman',
    },
    {
        id: 9,
        name: 'Kopi Tubruk',
        description: 'Kopi hitam khas Indonesia.',
        price: 12000,
        image: '/asset/Kopi Tubruk.jpeg',
        category: 'Minuman',
    },
    {
        id: 10,
        name: 'Teh Tarik',
        description: 'Teh tarik khas Malaysia dengan busa lembut.',
        price: 10000,
        image: '/asset/Teh Tarik.jpeg',
        category: 'Minuman',
    },
])

function getItemById(id) {
    return menuItems.value.find(item => item.id == id)
}

return { menuItems, getItemById }
})
