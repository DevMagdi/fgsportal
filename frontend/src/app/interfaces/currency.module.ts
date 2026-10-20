import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Currency } from './leadsAndContacts';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CurrencyModule { 
  public static CurrencyList:Currency[] = [{
    'currencyName': 'Egyptian pound-EGP',
    'currencyCode': 'EGP',
    'countryCode': 'eg',
    'countryName': 'Egypt',
    'symbol': '£'
  },{
    'currencyName': 'United States dollar-USD',
    'currencyCode': 'USD',
    'countryCode': 'us',
    'countryName': 'United States',
    'symbol': '$'
  },{
    'currencyName': 'Euro-EUR',
    'currencyCode': 'EUR',
    'countryCode': 'eu',
    'countryName': 'Euro',
    'symbol': '€'
  }, {
    'currencyName': 'Omani rial-OMR',
    'currencyCode': 'OMR',
    'countryCode': 'om',
    'countryName': 'Oman',
    'symbol': 'ر.ع.'
  },{
    'currencyName': 'Kuwaiti dinar-KWD',
    'currencyCode': 'KWD',
    'countryCode': 'kw',
    'countryName': 'Kuwait',
    'symbol': 'د.ك'
  },{
    'currencyName': 'Saudi riyal-SAR',
    'currencyCode': 'SAR',
    'countryCode': 'sa',
    'countryName': 'Saudi Arabia',
    'symbol': 'ر.س'
  }, {
    'currencyName': 'United Arab Emirates dirham-AED',
    'currencyCode': 'AED',
    'countryCode': 'ae',
    'countryName': 'United Arab Emirates',
    'symbol': 'د.إ'
  },{
    'currencyName': 'South African rand-ZAR',
    'currencyCode': 'ZAR',
    'countryCode': 'za',
    'countryName': 'South Africa',
    'symbol': 'R'
  }]
}
