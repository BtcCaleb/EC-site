import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useCheckoutContext } from 'hooks/useCheckoutContext';
import { useCartContext } from 'hooks/useCartContext';
import { useInventory } from 'hooks/useInventory';

import CheckoutProgression from './CheckoutProgression';
import ShippingInfo from './ShippingInfo';
import ShippingOption from './ShippingOption';
import Payment from './Payment';
import OrderSummary from './OrderSummary';

import Loader from 'common/Loader';
import NotificationModal from 'common/NotificationModal';

import logo from 'assets/images/checkout-logo-nav.png';

import styles from './index.module.scss';

const progressionSteps = [
  { id: 'cart', label: 'Carrito', url: '/carrito' },
  { id: 'info', label: 'Info' },
  { id: 'shipping', label: 'Envío' },
  { id: 'payment', label: 'Pago' },
];

const Checkout = () => {
  const { checkoutIsReady, currentStep } = useCheckoutContext();
  const { items } = useCartContext();
  const {
    checkInventory,
    isLoading: isInventoryLoading,
    error: inventoryError,
  } = useInventory();

  const [notificationModal, setNotificationModal] = useState(null);

  let formContent;

  if (progressionSteps[currentStep].id === 'info') {
    formContent = <ShippingInfo />;
  }

  if (progressionSteps[currentStep].id === 'shipping') {
    formContent = <ShippingOption />;
  }

  if (progressionSteps[currentStep].id === 'payment') {
    formContent = <Payment />;
  }

  useEffect(() => {
    checkInventory(items);
  }, []);

  useEffect(() => {
    if (inventoryError) {
      setNotificationModal({
        error: inventoryError,
        details: inventoryError.details,
      });
    }
  }, [inventoryError]);

  const toggleNotificationModal = () => {
    setNotificationModal(null);
  };

  return (
    <>
      {notificationModal && (
        <NotificationModal
          className={styles.error_modal}
          toggleNotificationModal={toggleNotificationModal}
          content={notificationModal}
        />
      )}
      <div className={styles.background}></div>
      <section className={styles.layout}>
        <>
          {!checkoutIsReady && <Loader noPortal={true} />}
          {checkoutIsReady && (
            <>
              <div className={`${styles.header} main-container`}>
                <Link to="/">
                  <img className={styles.logo} src={logo} alt="" />
                </Link>
              </div>
              <div className={`${styles.content_wrapper} main-container`}>
                <div className={styles.info_container}>
                  <div className={styles.info_header}>
                    <Link to="/">
                      <img className={styles.logo} src={logo} alt="" />
                    </Link>
                  </div>
                  <CheckoutProgression steps={progressionSteps} />
                  {formContent}
                </div>
                <div className={styles.order_summary_container}>
                  <OrderSummary />
                </div>
              </div>
            </>
          )}
        </>
      </section>
    </>
  );
};

export default Checkout;
