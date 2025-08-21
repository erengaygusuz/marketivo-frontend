import { createReducer, on } from '@ngrx/store';
import { CartItem } from '../../models/cart-item';
import * as CartActions from './cart.actions';
import { initialCartState } from './cart.state';

export const cartReducer = createReducer(
    initialCartState,

    on(CartActions.loadCart, state => ({
        ...state,
        loading: true,
        error: null,
    })),

    on(CartActions.loadCartSuccess, (state, { cartItems }) => {
        const migratedCartItems = cartItems.map(item => ({
            ...item,
            localizedNames: item.localizedNames || { 'en-US': item.name },
        }));

        const { totalPrice, totalQuantity } = computeTotals(migratedCartItems);

        return {
            ...state,
            cartItems: migratedCartItems,
            totalPrice,
            totalQuantity,
            loading: false,
            error: null,
        };
    }),

    on(CartActions.loadCartFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    on(CartActions.addToCart, (state, { cartItem }) => {
        const existingItemIndex = state.cartItems.findIndex(item => item.id === cartItem.id);

        let updatedCartItems;

        if (existingItemIndex > -1) {
            updatedCartItems = state.cartItems.map((item, index) =>
                index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            const newCartItem = {
                ...cartItem,
                quantity: 1,
                localizedNames: cartItem.localizedNames || { 'en-US': cartItem.name },
            };

            updatedCartItems = [...state.cartItems, newCartItem];
        }

        const { totalPrice, totalQuantity } = computeTotals(updatedCartItems);

        return {
            ...state,
            cartItems: updatedCartItems,
            totalPrice,
            totalQuantity,
        };
    }),

    on(CartActions.updateCartItemQuantity, (state, { cartItemId, quantity }) => {
        if (quantity <= 0) {
            const updatedCartItems = state.cartItems.filter(item => item.id !== cartItemId);
            const { totalPrice, totalQuantity } = computeTotals(updatedCartItems);

            return {
                ...state,
                cartItems: updatedCartItems,
                totalPrice,
                totalQuantity,
            };
        }

        const updatedCartItems = state.cartItems.map(item => (item.id === cartItemId ? { ...item, quantity } : item));

        const { totalPrice, totalQuantity } = computeTotals(updatedCartItems);

        return {
            ...state,
            cartItems: updatedCartItems,
            totalPrice,
            totalQuantity,
        };
    }),

    on(CartActions.removeFromCart, (state, { cartItemId }) => {
        const updatedCartItems = state.cartItems.filter(item => item.id !== cartItemId);
        const { totalPrice, totalQuantity } = computeTotals(updatedCartItems);

        return {
            ...state,
            cartItems: updatedCartItems,
            totalPrice,
            totalQuantity,
        };
    }),

    on(CartActions.clearCart, state => ({
        ...state,
        cartItems: [],
        totalPrice: 0,
        totalQuantity: 0,
    })),

    on(CartActions.computeCartTotals, state => {
        const { totalPrice, totalQuantity } = computeTotals(state.cartItems);

        return {
            ...state,
            totalPrice,
            totalQuantity,
        };
    }),

    on(CartActions.updateCartItemsLanguage, (state, { language }) => {
        const updatedCartItems = state.cartItems.map(item => ({
            ...item,
            name: item.localizedNames?.[language] || item.name,
        }));

        return {
            ...state,
            cartItems: updatedCartItems,
        };
    }),

    on(CartActions.addLocalizedNameToCartItem, (state, { cartItemId, language, name }) => {
        const updatedCartItems = state.cartItems.map(item => {
            if (item.id === cartItemId) {
                return {
                    ...item,
                    localizedNames: {
                        ...item.localizedNames,
                        [language]: name,
                    },
                    name: name,
                };
            }

            return item;
        });

        return {
            ...state,
            cartItems: updatedCartItems,
        };
    })
);

function computeTotals(cartItems: CartItem[]) {
    let totalPrice = 0;
    let totalQuantity = 0;

    for (const item of cartItems) {
        totalPrice += item.quantity * item.unitPrice;
        totalQuantity += item.quantity;
    }

    return { totalPrice, totalQuantity };
}
