// src/stores/reviewStore.js
import { defineStore } from 'pinia';
import axiosClient from '@/axios';

export const useReviewStore = defineStore('review', {
    state: () => ({
        reviews: [],
        averageRating: 0,
        totalReviews: 0,
        loading: false,
        error: null,
        submitSuccess: false,
    }),
    actions: {
        /**
         * Mengambil daftar review untuk produk tertentu.
         * @param {number} productId - ID produk yang review-nya ingin diambil.
         */
        async fetchReviewsForProduct(productId) {
            this.loading = true;
            this.error = null;
            try {
                const response = await axiosClient.get(`/products/${productId}/reviews`);
                this.reviews = response.data;
                this.calculateAverageRating(); // Hitung rata-rata rating setelah review dimuat
                console.log(`Reviews for product ${productId} loaded:`, this.reviews);
            } catch (err) {
                this.error = 'Gagal memuat review produk: ' + (err.response?.data?.message || err.message);
                console.error('Error fetching product reviews:', err);
            } finally {
                this.loading = false;
            }
        },

        /**
         * Mengirim review baru untuk produk tertentu.
         * @param {number} productId - ID produk.
         * @param {Object} reviewData - Objek yang berisi rating dan comment.
         */
        async submitReview(productId, reviewData) {
            this.loading = true;
            this.error = null;
            this.submitSuccess = false; // Reset status sukses
            try {
                const response = await axiosClient.post(`/products/${productId}/reviews`, reviewData);
                this.submitSuccess = true;
                // Tambahkan review yang baru ke daftar secara lokal
                this.reviews.unshift(response.data.review);
                this.calculateAverageRating(); // Perbarui rata-rata rating
                return response.data;
            } catch (err) {
                this.submitSuccess = false;
                this.error = 'Gagal mengirim review: ' + (err.response?.data?.message || 'Terjadi kesalahan.');
                if (err.response && err.response.data && err.response.data.errors) {
                    this.error += '\nDetail: ' + Object.values(err.response.data.errors).flat().join(', ');
                } else if (err.response && err.response.data && err.response.data.message) {
                    this.error = err.response.data.message; // Tangani pesan konflik (misal: "Anda sudah mereview")
                }
                console.error('Error submitting review:', err.response?.data || err.message);
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Memperbarui review yang sudah ada.
         * @param {number} reviewId - ID review yang akan diperbarui.
         * @param {Object} reviewData - Objek yang berisi rating dan comment.
         */
        async updateReview(reviewId, reviewData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await axiosClient.put(`/reviews/${reviewId}`, reviewData);
                // Perbarui review di state
                const index = this.reviews.findIndex(r => r.id === reviewId);
                if (index !== -1) {
                    this.reviews[index] = response.data.review;
                }
                this.calculateAverageRating();
                return response.data;
            } catch (err) {
                this.error = 'Gagal memperbarui review: ' + (err.response?.data?.message || err.message);
                console.error('Error updating review:', err.response?.data || err.message);
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Menghapus review.
         * @param {number} reviewId - ID review yang akan dihapus.
         */
        async deleteReview(reviewId) {
            this.loading = true;
            this.error = null;
            try {
                await axiosClient.delete(`/reviews/${reviewId}`);
                // Hapus review dari state
                this.reviews = this.reviews.filter(r => r.id !== reviewId);
                this.calculateAverageRating();
            } catch (err) {
                this.error = 'Gagal menghapus review: ' + (err.response?.data?.message || err.message);
                console.error('Error deleting review:', err.response?.data || err.message);
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Menghitung rata-rata rating dan total review.
         */
        calculateAverageRating() {
            if (this.reviews.length === 0) {
                this.averageRating = 0;
                this.totalReviews = 0;
                return;
            }
            const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
            this.averageRating = (total / this.reviews.length).toFixed(1); // Satu desimal
            this.totalReviews = this.reviews.length;
        },

        // Opsional: Aksi untuk mereset state review
        resetState() {
            this.reviews = [];
            this.averageRating = 0;
            this.totalReviews = 0;
            this.loading = false;
            this.error = null;
            this.submitSuccess = false;
        }
    }
});