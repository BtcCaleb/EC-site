import { useState } from 'react';

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from 'firebase/firestore';

import { db } from '../firebase/config';

import { useAuthContext } from './useAuthContext';
import { useCartContext } from './useCartContext';
import { useCheckoutContext } from './useCheckoutContext';
import { useCart } from './useCart';
import { useCheckout } from './useCheckout';

export const useOrder = () => {
  const { user } = useAuthContext();
  const { items } = useCartContext();
  const { email, shippingAddress, shippingOption } = useCheckoutContext();
  const { deleteCart } = useCart();
  const { deleteCheckoutSession } = useCheckout();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const collectionRef = collection(db, 'orders');

  const createOrder = async (paymentInfo) => {
    setError(null);
    setIsLoading(true);
    try {
      const createdAt = Timestamp.fromDate(new Date());
      await addDoc(collectionRef, {
        createdAt,
        items,
        email,
        shippingAddress,
        shippingOption,
        paymentInfo,
        createdBy: user.uid,
      });

      await deleteCart();
      await deleteCheckoutSession();

      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setError(err);
      setIsLoading(false);
    }
  };

  const getOrders = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const orders = [];

      const q = query(collectionRef, where('createdBy', '==', user.uid));
      console.log('running');

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });

      return orders;
    } catch (err) {
      console.log(err);
      setError(err);
      setIsLoading(false);
    }
  };

  return { createOrder, getOrders, isLoading, error };
};