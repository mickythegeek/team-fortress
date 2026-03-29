---
module: interswitch
feature: quickstart
source: https://docs.interswitchgroup.com/docs/quickstart-accept-your-first-payment-in-5-minutes
audience: developer
title: QuickStart - Accept Your First Payment in 5 Minutes
---

# QuickStart - Accept Your First Payment in 5 Minutes

Step 1: Grab Your Test Credentials
Use these credentials immediately — no signup required.
Parameter
Value
Merchant Code
MX6072
Pay Item ID
9405967
Client ID
IKIAB23A4E2756605C1ABC33CE3C287E27267F660D61
Secret
secret
Mode
TEST
These are shared sandbox credentials for testing only. When you're ready for production, 
generate your own credentials
Step 2: Choose Your Integration Path
Pick the approach that fits your use case. Each one gets you to a working payment in minutes.
Path
Best For
Effort
A — Inline Checkout
Websites where customers pay without leaving your page
~10 lines of JS
B — Web Redirect
Simple HTML form, no JavaScript needed
~10 lines of HTML
C — API-First (Pay Bill)
Server-to-server, you control the entire flow
1 API call
Path A — Inline Checkout (Recommended)
The checkout widget opens as a popup on your page. The customer never leaves your site.
1. Add the checkout script to your page:
HTML
<script src="https://newwebpay.qa.interswitchng.com/inline-checkout.js"></script>
2. Trigger the payment:
JavaScript
function paymentCallback(response) {
    console.log('Payment complete:', response);
    // response.resp === "00" means the customer completed the flow
    // IMPORTANT: Always verify server-side before giving value
window.webpayCheckout({
    merchant_code: "MX6072",
    pay_item_id: "9405967",
    txn_ref: "test_" + Date.now(),   // unique per transaction
    amount: 10000,                    // ₦100.00 (amount is in kobo)
    currency: 566,                    // NGN
    cust_email: "[email protected]",
    onComplete: paymentCallback,
    mode: 'TEST'
});
3. Complete the payment using a test card from the table in 
Step 3
 below.
That's it — three steps. The checkout widget handles card entry, OTP, and all payment methods (Card, Transfer, USSD, Wallet, Google Pay).
Go Live
When you're ready for production, change the script URL to 
https://newwebpay.interswitchng.com/inline-checkout.js
 and set 
mode: 'LIVE'
Here's the full list of parameters you can pass to 
webpayCheckout
Field
Type
Required
Description
merchant_code
String
Yes
Your Merchant Code
pay_item_id
String
Yes
Your Pay Item ID
txn_ref
String
Yes
Unique transaction reference you generate
amount
Integer
Yes
Amount in minor currency (kobo). ₦100 = 
10000
currency
Integer
Yes
ISO 4217 numeric code. NGN = 
566
cust_email
String
Yes
Customer's email address
mode
String
Yes
TEST
LIVE
onComplete
Function
Yes
Callback invoked when customer completes payment
pay_item_name
String
Display name for the item
cust_name
String
Customer's name
cust_id
String
Your internal customer identifier
cust_mobile_no
String
Customer's mobile number
site_redirect_url
String
URL to redirect after payment
tokenise_card
String
"true"
 to receive a card token on requery
access_token
String
Access token from Passport (if using auth)
Path B — Web Redirect
A plain HTML form that sends the customer to the Interswitch payment page. No JavaScript required.
HTML
<form method="post" action="https://newwebpay.qa.interswitchng.com/collections/w/pay">
    <input type="hidden" name="merchant_code" value="MX6072" />
    <input type="hidden" name="pay_item_id" value="9405967" />
    <input type="hidden" name="txn_ref" value="test_12345" />
    <input type="hidden" name="amount" value="10000" />
    <input type="hidden" name="currency" value="566" />
    <input type="hidden" name="cust_email" value="[email protected]" />
    <input type="hidden" name="site_redirect_url" value="https://your-site.com/payment-response" />
    <button type="submit">Pay ₦100.00</button>
</form>
When the customer clicks the button, they're taken to the Interswitch payment page. After payment, they're redirected back to your 
site_redirect_url
 with the transaction reference.
Go Live
Change the form action to 
https://newwebpay.interswitchng.com/collections/w/pay
 for production.
Path C — API-First Integration (Pay Bill)
Create a payment link server-side with a single API call. You control the flow — redirect the customer yourself, embed in an iframe, send via email or SMS.
1. Create a payment link:
cURL
Node.js
Python
curl -X POST https://qa.interswitchng.com/collections/api/v1/pay-bill \
  -H "Content-Type: application/json" \
  -d '{
    "merchantCode": "MX6072",
    "payableCode": "9405967",
    "amount": "10000",
    "redirectUrl": "https://your-site.com/payment-response",
    "customerId": "[email protected]",
    "currencyCode": "566",
    "customerEmail": "[email protected]"
const response = await fetch('https://qa.interswitchng.com/collections/api/v1/pay-bill', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        merchantCode: 'MX6072',
        payableCode: '9405967',
        amount: '10000',
        redirectUrl: 'https://your-site.com/payment-response',
        customerId: '[email protected]',
        currencyCode: '566',
        customerEmail: '[email protected]'
});
const data = await response.json();
console.log(data.paymentUrl); // Send customer to this URL
import requests
response = requests.post(
    'https://qa.interswitchng.com/collections/api/v1/pay-bill',
    json={
        'merchantCode': 'MX6072',
        'payableCode': '9405967',
        'amount': '10000',
        'redirectUrl': 'https://your-site.com/payment-response',
        'customerId': '[email protected]',
        'currencyCode': '566',
        'customerEmail': '[email protected]'
data = response.json()
print(data['paymentUrl'])  # Send customer to this URL
2. Response — you get a 
paymentUrl
JSON
  "id": 21067,
  "merchantCode": "MX6072",
  "payableCode": "9405967",
  "amount": 10000,
  "code": "200",
  "reference": "3WuIKFZFvGWra4e",
  "paymentUrl": "https://project-x-merchant.k8.isw.la/paymentgateway/paybill/3WuIKFZFvGWra4e",
  "redirectUrl": "https://your-site.com/payment-response",
  "customerId": "[email protected]",
  "customerEmail": "[email protected]",
  "currencyCode": "566"
3. Redirect your customer to 
paymentUrl
 to complete payment.
 After payment, they'll be sent to your 
redirectUrl
When to use this approach
API-First is ideal when you need to generate payment links dynamically — for invoices, reservation systems, or sending payment requests via email/SMS/WhatsApp. You create the link on your server and decide how to deliver it.
Go Live
Change the base URL to 
https://webpay.interswitchng.com
 for production.
Try it in the API Explorer →
Step 3: Pay with a Test Card
When the checkout appears (for any of the three paths above), use one of these test cards.
Simulate a Successful Payment
Card Brand
Card Number
Expiry
CVV
PIN
OTP
Verve
5061050254756707864
06/26
111
1111
Verve
5060990580000217499
03/50
111
1111
Visa
4000000000002503
03/50
1111
Mastercard
5123450000000008
01/39
100
1111
123456
Simulate Failure Scenarios
Testing error handling is just as important. Use these cards to verify your integration handles failures gracefully:
Scenario
Card Number
Expiry
CVV
PIN
OTP
What Happens
Issuer Timeout
5061830100001895
01/40
111
1111
123456
Simulates the issuing bank not responding
Insufficient Funds
5060990580000000390
03/50
111
1111
123456
Card has insufficient balance
No Card Record
5612330000000000412
03/50
111
1111
123456
Card number not recognized
All test cards use PIN 
1111
 Where OTP is required, use 
123456
Step 4: Verify the Transaction (Server-Side)
After the customer completes payment, you 
must
 confirm the transaction from your server before giving value. Never rely on the client-side callback alone.
Make a GET request with your merchant code, the transaction reference, and the expected amount:
cURL
Node.js
Python
curl -X GET "https://qa.interswitchng.com/collections/api/v1/gettransaction.json?merchantcode=MX6072&transactionreference={txn_ref}&amount=10000" \
  -H "Content-Type: application/json"
const txnRef = 'test_1234567890'; // from your original request
const res = await fetch(
    `https://qa.interswitchng.com/collections/api/v1/gettransaction.json?merchantcode=MX6072&transactionreference=${txnRef}&amount=10000`,
    { headers: { 'Content-Type': 'application/json' } }
const txn = await res.json();
if (txn.ResponseCode === '00' && txn.Amount === 10000) {
    // Payment confirmed — deliver value
} else {
    // Payment failed or amount mismatch — do not deliver value
import requests
txn_ref = 'test_1234567890'  # from your original request
res = requests.get(
    'https://qa.interswitchng.com/collections/api/v1/gettransaction.json',
    params={
        'merchantcode': 'MX6072',
        'transactionreference': txn_ref,
        'amount': 10000
txn = res.json()
if txn['ResponseCode'] == '00' and txn['Amount'] == 10000:
    # Payment confirmed — deliver value
    pass
else:
    # Payment failed or amount mismatch — do not deliver value
    pass
Successful verification response:
JSON
    "Amount": 10000,
    "CardNumber": "",
    "MerchantReference": "test_1234567890",
    "PaymentReference": "UBA|API|MX6072|25-07-2024|249510|719456",
    "RetrievalReferenceNumber": "000647661227",
    "SplitAccounts": [],
    "TransactionDate": "2024-07-25T06:57:24",
    "ResponseCode": "00",
    "ResponseDescription": "Approved by Financial Institution",
    "AccountNumber": "9999999999"
Critical: Always verify two things
ResponseCode
"00"
 (approved)
Amount
 matches the amount you originally charged
If either check fails, do not deliver value to the customer.
Go Live
Change the base URL to 
https://webpay.interswitchng.com
 for production.
Try the verification endpoint in the API Explorer →
Step 5: Set Up Webhooks (Optional but Recommended)
Instead of polling for transaction status, configure a webhook URL and we'll POST to it whenever a transaction status changes. This is more reliable than redirect-based confirmation — it works even if the customer closes their browser.
Set up Webhooks →
You're Integrated! What's Next?
You've just completed a full payment flow in test mode. Here's what to do next:
Next Step
Link
Generate your own live credentials
Getting Integration Credentials
Handle all response codes
Response Codes
Process refunds
Refunds
Accept recurring payments
Recurring Payments
Use Hosted Fields for custom checkout UI
Hosted Fields
Accept non-card payments (Transfer, USSD, Wallet)
Non Card Payments
Handle 3D Secure for Visa/international cards
3D Secure Transactions
Go live checklist
Road to Go Live
Need help?
Join the 
 or visit the 
 to explore endpoints interactively.
Updated
6 days ago
Ask AI
