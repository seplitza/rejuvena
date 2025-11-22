/**
 * HTML Utils
 * @flow
 * @format
 */

import {Linking} from 'react-native';
import {NavigationService} from '@app/utils';
import {Routes} from '@app/common';
import DINProCondensedBold from '@app/assets/base-64-fonts/din-pro-condensed-bold';
import PhosphateInline from '@app/assets/base-64-fonts/phosphate-inline';
import DINProCondensed from '@app/assets/base-64-fonts/din-pro-condensed-regular';

/**
 * Tweak html to make it mobile friendly and
 * fix common design issue due to content generated with a editor.
 * 1. Add meta to fit content in mobile
 * 2. Remove froala editor tag
 * 3. Fix emoji issues showing multiple
 *
 * @param {string} html
 */

export function tweakHtml(html: string) {
  return `
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0" />
    <style>
    ${DINProCondensedBold}
    ${PhosphateInline}
    ${DINProCondensed}
      * {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      [data-f-id|="pbf"] {
        display: none;
      }

      span.fr-emoticon.fr-emoticon-img {
        background-repeat: no-repeat !important;
        font-size: inherit;
        height: 1em;
        width: 1em;
        min-height: 20px;
        min-width: 20px;
        display: inline-block;
        margin: -0.1em 0.1em 0.1em;
        line-height: 1;
        vertical-align: middle;
      }
      .fr-video>* {
        box-sizing: content-box;
        max-width: 100%;
        border: 0;
      } 
    </style>
  </head>
  ${html}
  `;
}

export const handleWebviewClickScript = `window.onclick = function (e) {
    var node = e.target;
    while (node != undefined && node.localName != 'a') {
      node = node.parentNode;
    }
    if (node !== undefined) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ href: node.href }));
      return false;
    } else {
      return true;
    }
  }`;

export const onClickFromWebview = (event) => {
  const data = JSON.parse(event.nativeEvent.data);
  if (/inspiration_page/.test(data?.href)) {
    NavigationService.navigate(Routes.VotingScreen);
    return;
  }
  if (data.href) {
    Linking.openURL(data.href);
  }
};
