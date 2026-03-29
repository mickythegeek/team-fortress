---
module: interswitch
feature: webhooks
source: https://docs.interswitchgroup.com/docs/webhooks
audience: developer
title: Webhooks - Real-time Notifications
---

# Webhooks - Real-time Notifications

Webhooks are a way to receive real-time notifications of events on Interswitch.
This allows you to automate tasks and workflows based on these events, such as updating your inventory, tracking transactions, sending customer notifications, or triggering fraud detection.
To set up webhooks:
Go to your Quickteller Business dashboard and click 
Developer Tools
Select the event types you want notified about( 
Invoices
Payout
Transactions
Payment links
Subscriptions
, and 
Enable all notifications
Under 
Webhooks
, click 
Save changes
Click 
Create
Webhook Events
We currently support the following Event types:
TRANSACTION:
 Transaction state changes when the customer is paying
SUBSCRIPTION:
 Subscription payments
PAYMENT LINKS:
 Payments on a payment link
INVOICES:
 Invoice Payments
Each Event has a set of actions that explain what type of event has just happened.
e.g. 
TRANSACTION.COMPLETED
 means that a transaction has just been completed; it has either been successfully paid for or failed and cannot be retried.
1. TRANSACTION Event Types
Action
Notification Event
Description
CREATED
TRANSACTION.CREATED
A transaction has been created for you (A customer has attempted to make a payment)
UPDATED
TRANSACTION.UPDATED
A transaction previously created for you has been updated(Various stages in the process of payment processing)
COMPLETED
TRANSACTION.COMPLETED
A transaction previously created for you has been completed(Such a transaction may or may not be successful). NOTE:
Do note that it is possible to get a completed transaction webhook without previously receiving any of the preceding
statuses
2. SUBSCRIPTION Event Types
Action
Notification Event
Description
Created subscription
SUBSCRIPTION.CREATED
When a customer successfully subscribes to one of your subscription
schedule
SUCCESSFUL
PAYMENT
SUBSCRIPTION.
TRANSACTION_SUCCESSFUL
A successful attempt to charge a subscribed customer
FAILED PAYMENT
SUBSCRIPTION.TRANSACTION_FAILURE
A failed attempt to charge a subscribed customer
Cancelled Subscription
SUBSCRIPTION.CANCELLED
When a customer cancels his subscription to your subscription schedule
3. PAYMENT LINK Event Types
Action
Notification Event
Description
SUCCESSFUL PAYMENT
LINK.TRANSACTION_SUCCESSFUL
A successful payment link payment by a customer
FAILED PAYMENT
LINK.TRANSACTION_FAILURE
A failed attempt of payment for a payment link by a customer
4. INVOICE Event Types
Action
Notification Event
Description
SUCCESSFUL PAYMENT
INVOICE.TRANSACTION_SUCCESSFUL
A successful payment by a customer
FAILED PAYMENT
INVOICE.TRANSACTION_FAILURE
A failed attempt at payment by a customer
Sample Message
All webhook messages you receive from us will follow this general format.
JSON
 "event": "TRANSACTION.COMPLETED",
 "uuid": "2Xdf35faAyX2Sk5Dalu405rUD",
 "timestamp": 1594646111460,
 "data": {
 "remittanceAmount": 0,
 "bankCode": "011",
 "amount": 12000,
 "paymentReference": "FBN|WEB|MX6072|13-07-2020|3481032|762672",
 "channel": "WEB",
 "splitAccounts": [],
 "retrievalReferenceNumber": "000106923853",
 "transactionDate": 1594646111460,
 "accountNumber": null,
 "responseCode": "00",
 "token": null,
 "responseDescription": "Approved by Financial Institution",
 "paymentId": 3481032,
 "merchantCustomerId": "
[email protected]
 "escrow": false,
 "merchantReference": "2Xdf35faAyX2Sk5Dalu405rUD",
 "currencyCode": "566",
 "merchantCustomerName": "yee tod",
 "cardNumber": "561233*********0865"
Field Descriptions
Field
Description
uuid
Unique ID for the Event(transaction reference, invoice reference, etc)
timestamp
Time event action occurred
event
The event that occurred that triggered the notification
data
Actual object that is relevant (Payment Object)
Sending Back Response
You are expected to return a 200 HTTP response to every message received. This is to confirm that you received the message. If you return any HTTP response code other than 200, Interswitch will retry up to 5 times.
Do not send any response body with the response code. Any response body you send with the HTTP 200 will be discarded.
Also, respond with a 200 immediately before starting any other long process. If your application takes too long to respond, Interswitch will retry, which can lead to duplicate data.
Message Security
All webhook messages sent are hashed with the 
HmacSHA512
 algorithm. The hash is generated using the entire object received in the current notification.
The secret key used to hash the message is the unique one generated for you in the configuration.
The generated hash is Hex encoded and then passed in the header with the parameter field. 
X-Interswitch-Signature
This enables you to verify that any message you receive on your configured URL is from 
Interswitch
To verify every message, you will need to do the following.
Generate another hash using the same algorithm (HMAC-SHA512), your secret key, and the raw JSON object received as a string.
Compare the hash generated to the one passed in the 
X-Interswitch-Signature
 header.
Example:
If the request body we send to you is
JSON
{"event": "TRANSACTION.UPDATED", "uuid": "2Xdf35faAyX2Sk5Dalu405rUD", "timestamp":1594646111460,"data":{ "bankCode":"011"}}
The hash is going to be hex-encoded with your secret key
JSON
**HmacSHA512** ( {"event": "TRANSACTION.UPDATED", "uuid": "2Xdf35faAyX2Sk5Dalu405rUD", "timestamp":1594646111460,"data":{ "bankCode":"011"}} )
If the hash you generate does not match the hash you receive in the 
X-Interswitch-Signature
 header, the request was not from us.
Any request you receive without the 
X-Interswitch-Signature
 is also not from 
Interswitch
Updated
5 months ago
Ask AI
