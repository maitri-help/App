import { Platform } from 'react-native';
import {
  initConnection,
  getProducts,
  requestSubscription,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  getAvailablePurchases,
} from 'react-native-iap';

// Define your product IDs
const SUBSCRIPTION_SKUS = Platform.select({
  ios: __DEV__ 
    ? [
        // Local StoreKit Configuration product IDs
        'premium_monthly',    // This should match your StoreKit configuration
        'premium_yearly'      // This should match your StoreKit configuration
      ]
    : [
        // Production product IDs
        'com.maitri.premium.monthly',
        'com.maitri.premium.yearly'
      ],
  android: [
    'com.maitri.premium.monthly.android',
    'com.maitri.premium.yearly.android'
  ]
}) || [];

class IAPService {
  constructor() {
    this.purchaseUpdateSubscription = null;
    this.purchaseErrorSubscription = null;
    this.isInitialized = false;
  }

  async init() {
    try {
      if (this.isInitialized) {
        return;
      }

      console.log('Starting IAP initialization...');
      console.log('Platform:', Platform.OS);
      console.log('Development mode:', __DEV__);
      console.log('Available SKUs:', SUBSCRIPTION_SKUS);

      if (Platform.OS === 'ios' && __DEV__) {
        console.log('Using local StoreKit configuration for testing');
      }

      const result = await initConnection();
      console.log('IAP connection result:', result);
      
      this.purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
        console.log('Purchase successful:', purchase);
        
        try {
          const ackResult = await finishTransaction(purchase);
          console.log('Transaction finished:', ackResult);
          
          // Here you would typically update your backend
          // await this.updateBackendSubscription(purchase);
        } catch (error) {
          console.error('Error processing purchase:', error);
          throw error;
        }
      });

      this.purchaseErrorSubscription = purchaseErrorListener((error) => {
        console.error('Purchase error:', error.code, error.message);
      });

      this.isInitialized = true;
      console.log('IAP initialized successfully');

    } catch (err) {
      console.warn('Error initializing IAP:', err);
      this.isInitialized = false;
      throw err;
    }
  }

  async getAvailableSubscriptions() {
    try {
      if (!this.isInitialized) {
        await this.init();
      }

      if (!SUBSCRIPTION_SKUS || SUBSCRIPTION_SKUS.length === 0) {
        console.warn('No subscription SKUs defined for this platform');
        return [];
      }

      console.log('Fetching products for SKUs:', SUBSCRIPTION_SKUS);
      const products = await getProducts({ skus: SUBSCRIPTION_SKUS });
      console.log('Raw products response:', products);
      
      if (products.length === 0) {
        console.warn('No products found. Please verify:');
        console.warn('1. Product IDs are correctly set up in App Store Connect');
        console.warn('2. App bundle ID matches App Store Connect');
        console.warn('3. Sandbox tester account is being used');
        console.warn('4. Products are in "Ready to Submit" or "Active" state');
      } else {
        console.log('Found products:', products.map(p => ({
          productId: p.productId,
          title: p.title,
          price: p.price,
          currency: p.currency
        })));
      }
      
      return products;
    } catch (err) {
      console.warn('Error getting products:', err.code, err.message, err);
      return [];
    }
  }

  async purchaseSubscription(sku) {
    try {
      if (!this.isInitialized) {
        await this.init();
      }

      console.log('Starting subscription purchase for SKU:', sku);
      const result = await requestSubscription({
        sku: sku,
        andDangerouslyFinishTransactionAutomaticallyIOS: false
      });
      
      console.log('Subscription request result:', result);
      return result;
    } catch (err) {
      console.warn('Error purchasing subscription:', err.code, err.message, err);
      throw err;
    }
  }

  async getPurchaseHistory() {
    try {
      const purchases = await getAvailablePurchases();
      console.log('Purchase history:', purchases);
      return purchases;
    } catch (err) {
      console.warn('Error getting purchase history:', err);
      return [];
    }
  }

  cleanup() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
    this.isInitialized = false;
  }
}

export default new IAPService(); 