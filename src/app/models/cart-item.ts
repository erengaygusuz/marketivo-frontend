import { Product } from './product';

export interface CartItem {
    id: string;
    name: string;
    imageUrl: string;
    unitPrice: number;
    quantity: number;
    // Store names for different languages
    localizedNames: { [languageCode: string]: string };
}

// Utility functions for CartItem
export const createCartItem = (product: Product, language: string = 'en-US'): CartItem => ({
    id: product.id.toString(),
    name: product.name,
    imageUrl: product.imageUrl,
    unitPrice: product.unitPrice,
    quantity: 1,
    // Initialize with the current language
    localizedNames: {
        [language]: product.name,
    },
});

// Function to get name for specific language
export const getNameForLanguage = (cartItem: CartItem, language: string): string =>
    cartItem.localizedNames[language] || cartItem.name;

// Function to add/update name for a specific language
export const addLocalizedName = (cartItem: CartItem, language: string, name: string): CartItem => ({
    ...cartItem,
    localizedNames: {
        ...cartItem.localizedNames,
        [language]: name,
    },
    name: name, // Update current name
});
