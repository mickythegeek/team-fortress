---
module: interswitch
feature: api-overview
source: https://docs.interswitchgroup.com/docs/about-interswitch-apis
audience: developer
title: Interswitch API Overview - The Basics
---

# Interswitch API Overview - The Basics

Introduction
Interswitch's 
API
 marketplace exposes you to a host of APIs to build your software applications. It's properties are RESTFUL and would be organized around the major resources you would be interacting with, however when there are exceptions we will let you know.
Restful API's are HTTP verb driven, we created some examples below to define them.
Restful API resources (Request)
Definitions (response)
GET
Example:- 
GET  /order
This is used to retrieve information or search for a collection of orders.
POST
Example:- 
POST /order
This is used to create or build information into an endpoint.
Example, create a new order.
PUT / PATCH
Example :- 
PUT /order
This is used to update information
Example:- Bulk update all orders
DELETE
Example :- 
Delete /order
This is used to delete information
Example:- Delete all matching orders
/orders
// list of orders
/orders/ {id}
// Specific order
This is an important step
Create a free 
business account
 where you can test your APIs. We will definitely provide you with test keys which you can use to make 
API
 calls.
Once, you must have signed up, you will see some keys, below we explain what each of those keys represent and how to use them effectively.
API Identifiers
Name
Description
Key
This is a public key.
Secret
This is your Private key.
Token
This is your Client key.
API Environments
There are two different types of environments with different API keys. Below, we explain
Name
Description
Production
This is your live key gotten after you have fulfilled all 
KYC
 requirements, you gain access to our live environment.
Sandbox
This is a test key, where you can test our APIs in a live-like environment. No real transaction occurs in this environment
Need help ?
Ask questions from our team or other developers on our Interswitch's developer community slack channel
Sample Requests
The Interswitch API Marketplace leverages 
HTTP
 request methods and you can download our entire API collection here.
We provide sample API requests and responses leveraging curl after each process  has been expatiated on in terms of how to use.
We have also provisioned testing in our API reference documentation with various statuses.
Updated
5 months ago
Ask AI
