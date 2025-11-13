/**
 * HTML Helper
 * @flow
 * @format
 */

import {tweakHtml} from '@app/utils';
import {moderateScale} from '@app/styles';

const htmlStyles = `
 <head>
   <style>
     body {
       background-color: #ffffff;
       padding: ${moderateScale(10)}px;
     }
     p {
        font-size: ${moderateScale(24)} !important;
        color:#00196B;
        font-family: DINProCondensed !important;
      }
    span {
        font-size: ${moderateScale(28)} !important;
        color: #00196B;
        font-family: DINProCondensed !important;
      }
   </style>
 </head>
 `;

const htmlTitleStyles = `
 <head>
   <style>
     body {
       background-color: #ffffff;
       margin: 0 !important;
       padding: 0 !important;
       color: rgb(0,25,107) !important;
     }
     p,div {
        font-size: ${moderateScale(18)} !important;
        color: rgb(0,25,107);
        margin: 0 !important;
        padding: 0 !important;
        font-family: DINProCondensed !important;
      }
    span {
        font-size: ${moderateScale(20)} !important;
        font-family: DINProCondensed !important;
        margin: 0 !important;
        padding: 0 !important;
      }
   </style>
 </head>
 `;

export function addHtmlStyles(html) {
  return `${htmlStyles}${tweakHtml(html)}`;
}

export function addHtmlTitleStyles(html) {
  return `${htmlTitleStyles}${tweakHtml(html)}`;
}
