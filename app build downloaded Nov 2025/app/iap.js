/**
 * In app purchase
 * @format
 */

import React from 'react';
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  type PurchaseError,
} from 'react-native-iap';
import {NavigationService, trackEvent} from '@app/utils';
import {Routes} from '@app/common';
import {request, endpoints} from '@app/api';
import {store} from '@app/redux';
import {presentLoader, dismissLoader} from '@app/modules/common';
import {setScreenParams} from '@app/modules/order-list';

class IAP extends React.Component {
  purchaseUpdateSubscription = null;
  purchaseErrorSubscription = null;
  async componentDidMount() {
    try {
      await RNIap.initConnection();

      if (Platform.OS === 'android') {
        await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      } else {
        this.purchaseUpdateSubscription = purchaseUpdatedListener(
          (purchase) => {
            const receipt = purchase.transactionReceipt;

            if (receipt) {
              store.dispatch(presentLoader());

              request
                .post(endpoints.purchase_with_iap, {
                  receipt,
                })
                .then(async (res) => {
                  try {
                    await RNIap.finishTransaction(purchase);
                    const params = {
                      marathonId: res,
                      shouldShowStartPage: true,
                      isTrail: true,
                    };
                    this.props.setScreenParams(params);
                    trackEvent('Subscribed Course', {
                      productId: purchase?.productId,
                    });
                    NavigationService.reset('tabs', {
                      screen: Routes.ExerciseScreen,
                    });
                  } catch {}
                })
                .catch((err) => {
                  if (err.message === 'already_purchased') {
                    RNIap.finishTransaction(purchase);
                  }
                })
                .finally(() => {
                  store.dispatch(dismissLoader());
                });
            }
          },
        );
        this.purchaseErrorSubscription = purchaseErrorListener(
          (error: PurchaseError) => {
            console.warn('purchaseErrorListener', error);
          },
        );
      }
    } catch (err) {
      console.log('Error in IAP connection', err);
    }
  }

  componentWillUnmount() {
    try {
      RNIap.endConnection();

      this.purchaseUpdateSubscription?.remove();
      this.purchaseUpdateSubscription = null;

      this.purchaseErrorSubscription?.remove();
      this.purchaseErrorSubscription = null;
    } catch (err) {
      console.log('Error in RNIap.endConnection', err);
    }
  }

  render() {
    return null;
  }
}

export default connect(null, {setScreenParams})(IAP);
