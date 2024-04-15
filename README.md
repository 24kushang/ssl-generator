## Implementation Overview

# SSL Certificate Generator

This is a simple SSL certificate generator script written in Python. It allows you to easily create SSL certificates for your websites or applications.

## Features

- Generates **Letsencrypt** SSL certificates using `certbot` 
- Supports customizing certificate details such as common name, organization, file-location, etc.
- Easy-to-use command-line interface.

## Prerequisites

- NodeJS of 14 or later version.
- Terminal environment with Shell script execution.

## Installation

1. Clone the repository to your local machine:

```bash
git clone https://github.com/24kushang/ssl-generator.git
```

2. Navigate to the project directory:

```bash
cd ssl-generator
```

3. Install dependencies:

```bash
yarn add
```
or 
```bash
npm install
```

4. Install certbot for the local system:
```bash
sudo apt install certbot
```
## Usage

Run the script with the desired options:

```bash
node index
```

## Example

Generate a self-signed SSL certificate for a domain:

```bash
curl -H 'Content-Type: application/json' -d '{ "domain":"example.com" }' -X POST http://localhost:3000/generate-certificate
```
