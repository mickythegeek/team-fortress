---
module: interswitch
feature: response-codes
source: https://docs.interswitchgroup.com/docs/payment-response-codes
audience: developer
title: Payment Response Codes and Transaction Status
---

# Payment Response Codes and Transaction Status

All transactions are valid for 
30 minutes
. Any response received after 30 minutes should be considered final.
Response Codes and Transaction Status
Response codes may change as a transaction progresses, as customers can retry the transaction until it expires. However, the final response code will indicate whether the transaction was successful, failed, or expired.
Webhooks
For webhook responses, the event type 
TRANSACTION.COMPLETED
 indicates a final webhook event for a particular transaction. No further updates will be sent for that transaction.
Response Description
Response Code
Status
Final Response Codes(customer cannot retry)
Approved by Financial Institution, Partial
Successful
Approved by Financial Institution, VIP
Successful
Approved by Financial Institution
Successful
Transaction In Progress
Pending
Customer Cancellation
Cancelled
Other Responses
Approved by Financial Institution
Refer to Financial Institution
Refer to Financial Institution, Special Condition
Invalid Merchant
pick-Up card
Don Not Honor
Error
Pick-Up Card, Special Condition
Honor with Identification
Request In Progress
Partially Approved by Financial Institution
Approved by Financial Institution, VIP
Invalid Transaction
Invalid Amount
Invalid Card Number
No Such Financial Institution
Approved by Financial Institution, Update Track 3
Customer Cancellation
Customer Dispute
Re-enter Transaction
Invalid Response From Financial Institution
No Action Taken by Financial Institution
Suspected Malfunction
Unacceptable Transaction Fee
File Update not Supported
Unable to Locate Record
Duplicate Record
First Update File Edit Error
File Update File Locked
File Update Failed
Format Error
Bank Not Supported
Completed Partially by Financial
Expired Card, Pick-Up
Suspected Fraud, Pick-Up
Restricted Card, Pick-Up
Incorrect Security Details Provided. PIN Tries Exceeded, Pick-Up
No Credit Account
Function not Supported
Lost Card, Pick-Up
No Universal Account
Stolen Card, Pick-Up Stolen Card, Pick-Up
No Investment Account
Declined by Bank for custom reasons
Declined by Bank for custom reasons
Declined by Bank for custom reasons
No customer record
Insufficient Funds
No Check Account
No Savings Account
Expired Card
Incorrect PIN
No Card Record
Transaction not Permitted to Cardholder
Transaction not Permitted on Terminal
Suspected Fraud
Contact Acquirer
Exceeds Withdrawal Limit
Restricted Card
Security Violation
Original Amount Incorrect
Exceeds withdrawal frequency
Call Acquirer Security
Hard Capture
Response Received Too Late
Incorrect Security Details Provided. PIN tries exceeded
Reserved for Future Postilion Use
Intervene, Bank Approval Required
Intervene, Bank Approval Required for Partial Amount
Invalid Digital Signature
Declined by Bank for custom reasons
Declined by Bank for custom reasons
Declined by Bank for custom reasons
Declined by Bank for custom reasons
Information not on file
Declined by Bank for custom reasons
Cut-off in Progress
Issuer or Switch Inoperative
Routing Error
Violation of law
Duplicate Transaction
Reconcile Error
System Malfunction
Declined by Bank for custom reasons
Exceeds Cash Limit
Declined by Bank for custom reasons
Unexpected Error
Transaction not Permitted to Card Holder, via channels
Stock has finished
Incorrect Phone Number
An unknown error has occurred, please contact system administrator.
E21
Interswitch processing error
E42
Interswitch processing error
E53
Interswitch processing error
E60
Declined by Bank for custom reasons
Declined by Bank for custom reasons
Declined by Bank for custom reasons
Declined by Bank for custom reasons
Declined by Bank for custom reasons
Time Out calling postilion service
Fraud Service Declined Transaction
Error processing transaction
Exceeds Maximum Amount Allowed
X03
Minimum Amount for Payment Item Not Met
X04
The Amount Requested is above the Limit permitted by your Bank, please contact your Bank
X05
Cannot Retrieve Collections Account
XGO
Successfully Retrieved Collections Account
XG1
Exceeded time period to complete transaction
XS1
Error processing transaction
Transaction Not Completed
Transaction Error
Bank Account Error
Bank Collections Account Error
Interface Integration Error
Duplicate Reference Error
Incomplete Transaction
Transaction Split Pre-Processing Error
Invalid Card Number, via Channels
Transaction not Found
Z25
Recurrent transaction rate limit exceeded
Z162
Payment Requires Token
Z61
Request to Generate Token is Successful
Z62
Token Not Generated. Customer Not Registered on Token Platform
Z63
Error Occurred. Could Not Generate Token
Z64
Payment Requires Token Authorization
Z65
Token Authorization Successful
Z66
Token Authorization Not Successful. Incorrect Token Supplied
Z67
Error Occurred. Could Not Authenticate Token
Z68
Customer Cancellation Secure3D
Z69
Cardinal Authentication Required
Z70
Cardinal Lookup Successful
Z71
Cardinal Lookup Failed
Z72
Cardinal Authenticate Successful
Z73
Cardinal Authenticate Failed
Z74
Wibmo Lookup Successful
Z76
Wibmo Lookup Failed
Z77
Error calling Cybersource Service
Z80
Bin has not been configured
Z81
Merchant not configured for BIN
Z82
This is a http response that is returned on the API for different reasons(e.g; "Bad Request", "Card has expired", Correct pin not found, etc
10400
This is a http response that is returned on the API for different reasons
10403
This is a http response that is returned on the API for different reasons
10500
Cardholder not enrolled for OTP
Payment requires authentication
No Response received for 3DS auth
Refund API Response Codes
Please refer to the standard HTTP response codes. Where anything starting with 2XX signifies approved, 4XX means client error and 5XX indicates server error. When the response codes start with 4XX or 5XX, an error object will be returned to explain further the reason for this failure. Find common response codes and their descriptions below:
Code
Description
60002
Refund amount greater than transaction amount
10400
Error creating refund: This refund reference has already been used.
10500
Error processing request, please try again.
404
Transaction not found for merchant
400
Error creating refund: refund amount greater than transaction amount
500
Could not validate refund.
Other 10400 code meaning
Case
Error Description
If parent payment id or parent transaction reference is not passed
Please provide the initial transaction details
If transaction is found but id is null
Invalid transaction not found
If merchant code on parent transaction is not the merchant code of the merchant
User operation unauthorized
If merchant code on parent transaction does not match with merchant code passed
Invalid transaction. cannot perform refund on their transaction.
If transaction is not successful
Invalid transaction. Only successful transactions can be refunded
If transaction is a split transaction
Cannot perform refund on split transaction
If payment has non card provider id as credit
Cannot perform refund on this transaction
If currency code of transaction is not supported
Cannot perform refund on this transaction
If payment channel is not supported for refund
Cannot perform refund on this transaction
If refund has been created for the parent transaction
Transaction has been refunded or is logged for refunds
If transaction is older than certain number of days
Cannot refund transaction older than - days
If transaction account number cannot be retrieved
Refund account number not found
If parent transaction is not found or it has no response code
Could not validate refund
If refund amount is null
Please provide a  refund Amount for the PARTIAL refund
If refund type or amount is null
Please provide a refund Type or a refund Amount
If refund is not full or partial
Invalid refund type
If refund amount is below minimum refundable amount
Refund amount cannot be less than minimum amount
If refund is full and refund amount is greater than parent transaction amount
Refund amount cannot exceed the transaction amount
Updated
about 1 month ago
Ask AI
