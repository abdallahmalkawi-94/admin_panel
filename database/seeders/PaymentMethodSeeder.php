<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    public function run()
    {
        $methods = [
            [
                'code' => 'mada',
                'description' => 'Mada',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/0DDf3FVtHFm3MPPqrHN2jXKP3D1qW7IOuVGVWAhC.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'applepay',
                'description' => 'ApplePay',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/M2bsYxJZdT1dsTXOnFXp6upjN3qdn1klHlNDjAIO.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'mastercard',
                'description' => 'MasterCard',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/tPzGurkLaHn5EjpOp6NzuS7pN1O3lXNvIQGjWlNR.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'creditcard',
                'description' => 'Cards',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/6GyuXs8YXxgsayWJQGnHa0S3OGJ7jHKPjULPh0Iu.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'sadad',
                'description' => 'Sadad',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/M5Sn9mSxHKs9AWR4tcOmkt3KLu44WSrz2bGNFOLP.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'valu',
                'description' => 'Valu',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/9X3NaWZ3q3RPIu78soR7nFX6CavhRPkD971SiT7D.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'urpay',
                'description' => 'UrPay',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/1aapTmeCkBFXAKz9MAPmArWCHdwRKa552hLZVCdR.svg',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'stcpay',
                'description' => 'STCPay',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/E4L8pCoh6bpUIa76dhmiOwZLswCN49IHpGx7j3CU.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'omannet',
                'description' => 'OmanNet',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/whawMihvEZ8BpdMy9DpxdTCMCCcHCL8ttCbjuXsh.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'meeza',
                'description' => 'Meeza',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/Le9JRGKG7nOlLPYUgFwQQ5Ncr9BJ17OL9eJH45kQ.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'fawry',
                'description' => 'FAWRYPay',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/T5VAuHE3xqqOIAKGEMPhXuTE4yJ9rld5bNEjtxZc.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'wiretransfer',
                'description' => 'Wire Transfer',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/dHLlLpQEOHlPbhUsgsovASd0oogdSz0TOAWe9QBO.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'creditcard',
                'description' => 'Credit card',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/AddxrTLQwvgvoCKiHPWkhtLSABTzLWdh5zwWHY7s.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'paypal',
                'description' => 'PayPal',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/UtQKxw5IkLJle4VH55UNlp95Ow1uyKJueNs9rU15.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'momkn',
                'description' => 'Momkn',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/K34GpOZ4naAJWg5iDK8YYlRrmYKtHlt9zc5Zylw7.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'aman',
                'description' => 'AMAN',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/txhBPxzGlcSuYWQP0KncDhew0GDXQpbU8z2vTOAP.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'googlepay',
                'description' => 'Google Pay',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/c3Xm0mKu3V0X2YuDfXnBFjx3Re8BS75FGW5R8l5Z.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'samsungpay',
                'description' => 'Samsung Pay',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/r28zG5L8aU0z45MSGsudp5V9IzJFNvDlqngEWwmf.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'amex',
                'description' => 'American Express',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/im3bRakmFIALU8RL85TTErr3Oy5vnEt0BqvFrYXH.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'wechatpay',
                'description' => 'WeChat Pay',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/aHmX46Pf8CHiJKp8LNGGWecnMLhERKMpMeJedZPj.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'rupay',
                'description' => 'Rupay',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/dRZ1IOSfG8Xk3beoWPGx30sgR2jdySBKnf6ypTf0.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'unionpay',
                'description' => 'Union Pay',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/9y8ud3dP9eYIoHQQnthd7wBcTcoIfP19qZhsUOCu.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'knet',
                'description' => 'Knet',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/IKtlzvgQ199fZZKWUhRFbZkuViqqxi9owT0BRMz0.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'fawrypos',
                'description' => 'Fawry Pos',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/3m9NMutcci0uLkgkSkWufWQtDuZFKovsCo2IIqoh.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'tabby',
                'description' => 'Tabby',
                'info' => 'Pay in 4. No interest, no fees.',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/iYllItMpPPaDyEdCDo67LUHoJypISGCu9ZvNDZf5.png',
                'is_one_time_payment' => 0,
            ],
            [
                'code' => 'tamara',
                'description' => 'Tamara',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/jmcquxR5dlVydcs8XVCLhKejuAIzzppcJI9vuUCZ.png',
                'is_one_time_payment' => 0,
            ],
            [
                'code' => 'installments',
                'description' => 'Installments',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/WMf8A7JKWeXBWrThxwHbS3WW7HifTImGmd1C1Nwr.png',
                'is_one_time_payment' => 0,
            ],
            [
                'code' => 'mobilepay',
                'description' => 'MobilePay',
                'info' => '',
                'logo_url' => '',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'airtel',
                'description' => 'Airtel Money',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/230Qi7cDxErbyFEelibU6H3AGh9LnCvrpbemSoQG.jpg',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'moovmoney',
                'description' => 'Moov Money',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/N1JOlKhoJ8tII6D2kWTmo2u8GFoBy1IDqWRWAOHA.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'mobicash',
                'description' => 'MobiCash',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/OkfCyqoNmPbOPlQYApYU0ZEpqR3jBuR5TW4ZitX1.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'wallet',
                'description' => 'Wallet',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/NVH9ZBFvBLi2ioceYJezTuTmGHtelIrbpEJA8iP6.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'cwallet',
                'description' => 'C-Wallet',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/TCzDFkrPeLPxMVklFuB51caO7FYpvHOK62pGn10U.svg',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'pos',
                'description' => 'POS',
                'info' => '',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/Qh0lJuEObRBDyEcEgSOZlTvD9DF4kPlQFS1Zn5v2.png',
                'is_one_time_payment' => 1,
            ],
            [
                'code' => 'nearpay',
                'description' => 'NearPay',
                'info' => 'NearPay',
                'logo_url' => 'https://c-pay-prod.s3.eu-central-1.amazonaws.com/payment_methods/UR7xfe2KmMt3w4vZ8J37Av2BKEdrjCZvrEKrE4cn.png',
                'is_one_time_payment' => 1,
            ],
        ];

        foreach ($methods as $data) {
            PaymentMethod::query()->updateOrCreate(
                ['code' => $data['code']],
                $data
            );
        }
    }
}
