import { Platform } from 'react-native';
import {
  initConnection,
  getProducts,
  requestSubscription,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  getAvailablePurchases,
  getSubscriptions
} from 'react-native-iap';
import { api } from '../lib/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAccessToken } from '../authStorage';
import { API_URL } from '../constants/config';

// Define your product IDs
const SUBSCRIPTION_SKUS = Platform.select({
  ios: __DEV__ 
    ? [
        // Local StoreKit Configuration product IDs
        'com.maitri.premium.monthly',
        'com.maitri.premium.quarterly',
        'com.maitri.premium.biannual',
        'com.maitri.premium.lifetime'
      ]
    : [
        // Production product IDs
        'com.maitri.premium.monthly',
        'com.maitri.premium.quarterly',
        'com.maitri.premium.biannual',
        'com.maitri.premium.lifetime'
      ],
  android: [
    'com.maitri.premium.monthly.android'
  ]
}) || [];

class IAPService {
  constructor() {
    this.purchaseUpdateSubscription = null;
    this.purchaseErrorSubscription = null;
    this.isInitialized = false;
  }

  async getAuthToken() {
    try {
      const token = await getAccessToken();
      console.log('Auth token retrieved:', token ? 'Token found' : 'No token');
      return token;
    } catch (error) {
      console.log('Error getting auth token:', error);
      return null;
    }
  }

  async validateReceipt(receipt, productId) {
    try {
      console.log('Validating receipt with backend...');
      
      const token = await this.getAuthToken();
      if (!token) {
        console.log('No auth token found. Please log in first.');
        throw new Error('Authentication required. Please log in to complete your purchase.');
      }

      console.log('Sending receipt to backend with auth token...');
      const response = await api.post(
        '/payments/verify/appstore',
        { receipt }
      );
      
      console.log('Receipt validation response:', response.data);
      return response.data;
    } catch (error) {
      console.log('Receipt validation error:', error.message);
      if (error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
        console.log('Error response headers:', error.response.headers);
        
        // Ha 401-es hibát kapunk, akkor a token lejárt vagy érvénytelen
        if (error.response.status === 401) {
          console.log('Authentication token expired or invalid. Please log in again.');
          // Itt esetleg törölhetnénk a tokent
          await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
        }
      } else if (error.request) {
        console.log('No response received from server');
        console.log('Request details:', error.request);
      } else {
        console.log('Error setting up request:', error.message);
      }
      throw error;
    }
  }

  async init() {
    try {
      if (this.isInitialized) {
        return;
      }

      console.log('=== IAP Debug Info ===');
      console.log('Platform:', Platform.OS);
      console.log('Development Mode:', __DEV__);
      console.log('SKUs to fetch:', SUBSCRIPTION_SKUS);

      const connected = await initConnection();
      console.log('IAP connection result:', connected);
      
      this.purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
        try {
          console.log('Purchase update received:', purchase);
          
          if (purchase) {
            // Ellenőrizzük, hogy van-e receipt
            if (purchase.transactionReceipt) {
              console.log('Transaction receipt available');
              
              try {
                // Küldjük el a receipt-et a backend-nek validálásra
                await this.validateReceipt(
                  purchase.transactionReceipt,
                  purchase.productId
                );
                
                // Ha a validálás sikeres, fejezzük be a tranzakciót
                await finishTransaction({
                  purchase,
                  isConsumable: false,
                });
                console.log('Transaction successfully finished');
              } catch (finishError) {
                console.log('Error finishing transaction:', finishError.message);
              }
            } else {
              console.log('No transaction receipt in purchase:', purchase);
            }
          } else {
            console.log('No purchase data received');
          }
        } catch (error) {
          console.log('Purchase update error:', error.message);
        }
      });

      this.purchaseErrorSubscription = purchaseErrorListener((error) => {
        console.log('Purchase error:', {
          code: error.code,
          message: error.message,
          details: error.details
        });
      });

      this.isInitialized = true;

    } catch (err) {
      console.log('IAP initialization failed:', err.message);
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
        console.log('No SKUs defined for this platform');
        return [];
      }

      console.log('Fetching products...');
      try {
        // Try fetching products one by one to see which ones work
        for (const sku of SUBSCRIPTION_SKUS) {
          console.log(`Testing individual SKU: ${sku}`);
          try {
            const singleProduct = await getProducts({ skus: [sku] });
            console.log(`Result for ${sku}:`, singleProduct);
          } catch (singleError) {
            console.log(`Failed to fetch ${sku}:`, singleError.message);
          }
        }

        // Now try fetching all products
        const products = await getProducts({ skus: SUBSCRIPTION_SKUS });
        console.log('All products response:', products);
        return products;
      } catch (productError) {
        console.log('Error fetching products:', {
          code: productError.code,
          message: productError.message,
          name: productError.name
        });
        throw productError;
      }
    } catch (err) {
      console.log('Failed to get products:', err.message);
      return [];
    }
  }

  async purchaseSubscription(sku) {
    try {
      if (!this.isInitialized) {
        await this.init();
      }

      // Először ellenőrizzük, hogy a termék elérhető-e
      const products = await getProducts({ skus: [sku] });
      console.log('Products available for purchase:', products);
      
      if (!products || products.length === 0) {
        throw new Error(`Product ${sku} not available`);
      }

      // Indítsuk el a vásárlást
      console.log('Starting purchase for:', sku);
      const result = await requestSubscription({
        sku: products[0].productId,
        andDangerouslyFinishTransactionAutomaticallyIOS: false
      });
      
      console.log('Purchase initiated:', result);

      // Ha van receipt, akkor sikeres volt a vásárlás
      if (result?.transactionReceipt) {
        console.log('Purchase successful');
        
        // Validáljuk a receipt-et a backend-en
        const validationResult = await this.validateReceipt(
          result.transactionReceipt,
          result.productId
        );

        return {
          success: true,
          receipt: result.transactionReceipt,
          productId: result.productId,
          transactionId: result.transactionId,
          transactionDate: result.transactionDate,
          validationResult
        };
      } else {
        console.log('Purchase completed but no receipt received');
        return {
          success: false,
          error: 'No receipt received'
        };
      }
    } catch (err) {
      console.log('Purchase failed:', err.message);
      return {
        success: false,
        error: err.message
      };
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
  }
}

export default new IAPService(); 