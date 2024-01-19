export const swaggerPostDocument = {
  "swagger": "2.0",
  "info": {
    "description": "Unify Care",
    "version": "1.0.0",
    "title": "Unify Care"
  },
  "host": "34.126.94.166",
  "basePath": "/",
  "tags": [
    {
      "name": "Partner",
      "description": "Partner Onboarding APIs"
    }
  ],
  "schemes": [
    "https",
    "http"
  ],
  "paths": {
    "/api/partner/bankdetails": {
      "post": {
        "tags": [
          "Partner"
        ],
        "summary": "Add Partner Bank Details for Online Payment Procesing",
        "description": "API by which Partner can add bank detials for Online Payment Procesing",
        "operationId": "addBankdetails",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Bank Details that need to be configured",
            "required": true,
            "schema": {
              "$ref": "#/definitions/BankDetailReq"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "Bank Details Object",
            "schema": {
              "type": "object",
              "items": {
                "$ref": "#/definitions/BankDetailRes"
              }
            }
          },
          "400": {
            "description": "Invalid credentials"
          },
          "401": {
            "description": "User Not Verified"
          },
          "404": {
            "description": "Bad Request Error"
          }
        }
      }
    },
    "/api/partner/employee": {
      "post": {
        "tags": [
          "Partner"
        ],
        "summary": "Add Partner Employees (Doctor/Customer Support/Roster Manager etc)",
        "description": "API by which Partner can add Employees",
        "operationId": "addEmployees",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Employee Details that need to be added",
            "required": true,
            "schema": {
              "$ref": "#/definitions/EmployeeReq"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "Employee Details Object",
            "schema": {
              "type": "object",
              "items": {
                "$ref": "#/definitions/EmployeeRes"
              }
            }
          },
          "400": {
            "description": "Invalid credentials"
          },
          "401": {
            "description": "User Not Verified"
          },
          "404": {
            "description": "Bad Request Error"
          }
        }
      }
    },
    "/api/partner/signingauth": {
      "post": {
        "tags": [
          "Partner"
        ],
        "summary": "Add Partner Signing Authority Details",
        "description": "API by which Partner can add Signing Authority detials for legel documention",
        "operationId": "addSigningAuth",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Partner Signing Authority Details that need to be added",
            "required": true,
            "schema": {
              "$ref": "#/definitions/SigningAuthReq"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "Partner Signing Authority Details Object",
            "schema": {
              "type": "object",
              "items": {
                "$ref": "#/definitions/SigningAuthRes"
              }
            }
          },
          "400": {
            "description": "Invalid credentials"
          },
          "401": {
            "description": "User Not Verified"
          },
          "404": {
            "description": "Bad Request Error"
          }
        }
      }
    },
    "/api/partner/information": {
      "post": {
        "tags": [
          "Partner"
        ],
        "summary": "Add Partner Information for Onboarding",
        "description": "API by which Partner can add basic detials",
        "operationId": "addPartnerDetails",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Partner Details that need to be Added",
            "required": true,
            "schema": {
              "$ref": "#/definitions/PartnerDetailReq"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "Partner Details Object",
            "schema": {
              "type": "object",
              "items": {
                "$ref": "#/definitions/PartnerDetailRes"
              }
            }
          },
          "400": {
            "description": "Invalid credentials"
          },
          "401": {
            "description": "User Not Verified"
          },
          "404": {
            "description": "Bad Request Error"
          }
        }
      }
    },
  },
  "definitions": {
    "BankDetailReq": {
      "type": "object",
      "properties": {
        "bankAccountName": {
          "type": "string"
        },
        "bankAccountNumber": {
          "type": "string"
        },
        "bankIFSCCode": {
          "type": "string"
        },
        "bankName": {
          "type": "string"
        },
        "bankChequeURL": {
          "type": "string"
        },
      },
      "xml": {
        "name": "BankDetailReq"
      }
    },
    "BankDetailRes": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "partnerType": {
          "type": "string"
        },
        "partnerId": {
          "type": "string"
        },
        "superuserId": {
          "type": "string"
        },
        "bankAccountName": {
          "type": "string"
        },
        "bankAccountNumber": {
          "type": "string"
        },
        "bankIFSCCode": {
          "type": "string"
        },
        "bankName": {
          "type": "string"
        },
        "bankChequeURL": {
          "type": "string"
        },
        "bankChequeStatus": {
          "type": "string"
        },
        "partnerBankDetailsStatus": {
          "type": "string"
        },
      },
      "xml": {
        "name": "BankDetailRes"
      }
    },
    "EmployeeReq": {
      "type": "object",
      "properties": {
        "userFirstName": {
          "type": "string"
        },
        "userLastName": {
          "type": "string"
        },
        "emailId": {
          "type": "string"
        },
        "phoneNumber": {
          "type": "string"
        },
        "userType": {
          "type": "string"
        },
        "dateOfBirth": {
          "type": "string"
        },
        "experinceInYears": {
          "type": "number"
        },
      },
      "xml": {
        "name": "EmployeeReq"
      }
    },
    "EmployeeRes": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "userFirstName": {
          "type": "string"
        },
        "partnerId": {
          "type": "string"
        },
        "userLastName": {
          "type": "string"
        },
        "emailId": {
          "type": "string"
        },
        "phoneNumber": {
          "type": "string"
        },
        "userStatus": {
          "type": "string"
        },
        "accessLevel": {
          "type": "string"
        },
        "dateOfBirth": {
          "type": "string"
        },
        "experinceInYears": {
          "type": "string"
        },
        "userType": {
          "type": "string"
        },
      },
      "xml": {
        "name": "EmployeeRes"
      }
    },
    "SigningAuthReq": {
      "type": "object",
      "properties": {
        "signingAuthName": {
          "type": "string"
        },
        "signingAuthWorkEmail": {
          "type": "string"
        },
        "signingAuthTaxId": {
          "type": "string"
        },
        "signingAuthTaxIdUrl": {
          "type": "string"
        },
        "signingAuthTitle": {
          "type": "string"
        },
        "signingAuthLetterUrl": {
          "type": "string"
        },
      },
      "xml": {
        "name": "SigningAuthReq"
      }
    },
    "SigningAuthRes": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "partnerType": {
          "type": "string"
        },
        "partnerId": {
          "type": "string"
        },
        "superuserId": {
          "type": "string"
        },
        "partnerSigningAuthStatus": {
          "type": "string"
        },
        "signingAuthName": {
          "type": "string"
        },
        "signingAuthWorkEmail": {
          "type": "string"
        },
        "signingAuthTaxId": {
          "type": "string"
        },
        "signingAuthTaxIdUrl": {
          "type": "string"
        },
        "signingAuthTaxIdStatus": {
          "type": "string"
        },
        "signingAuthTitle": {
          "type": "string"
        },
        "signingAuthLetterUrl": {
          "type": "string"
        },
        "signingAuthLetterStatus": {
          "type": "string"
        },
      },
      "xml": {
        "name": "SigningAuthRes"
      }
    },
    "PartnerDetailReq": {
      "type": "object",
      "properties": {
        "services": {
          "type": "string"
        },
        "legalName": {
          "type": "string"
        },
        "website": {
          "type": "string"
        },
        "addressLine1": {
          "type": "string"
        },
        "addressLine2": {
          "type": "string"
        },
        "city": {
          "type": "string"
        },
        "state": {
          "type": "string"
        },
        "country": {
          "type": "string"
        },
        "pincode": {
          "type": "string"
        },
        "corporateId": {
          "type": "string"
        },
        "corporateIdUrl": {
          "type": "string"
        },
        "corporateTaxId": {
          "type": "string"
        },
        "corporateTaxIdUrl": {
          "type": "string"
        },
        "goodsAndServicesTaxId": {
          "type": "string"
        },
        "goodsAndServicesTaxIdUrl": {
          "type": "string"
        },
      },
      "xml": {
        "name": "PartnerDetailReq"
      }
    },
    "PartnerDetailRes": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "partnerType": {
          "type": "string"
        },
        "partnerId": {
          "type": "string"
        },
        "superuserId": {
          "type": "string"
        },
        "services": {
          "type": "string"
        },
        "legalName": {
          "type": "string"
        },
        "website": {
          "type": "string"
        },
        "addressLine1": {
          "type": "string"
        },
        "addressLine2": {
          "type": "string"
        },
        "city": {
          "type": "string"
        },
        "state": {
          "type": "string"
        },
        "country": {
          "type": "string"
        },
        "pincode": {
          "type": "string"
        },
        "corporateId": {
          "type": "string"
        },
        "corporateIdUrl": {
          "type": "string"
        },
        "corporateIdStatus": {
          "type": "string"
        },
        "corporateTaxId": {
          "type": "string"
        },
        "corporateTaxIdUrl": {
          "type": "string"
        },
        "corporateTaxIdStatus": {
          "type": "string"
        },
        "goodsAndServicesTaxId": {
          "type": "string"
        },
        "goodsAndServicesTaxIdUrl": {
          "type": "string"
        },
        "goodsAndServicesTaxIdStatus": {
          "type": "string"
        },
        "partnerInfoStatus": {
          "type": "string"
        }
      },
      "xml": {
        "name": "PartnerDetailRes"
      }
    },
  },
  "externalDocs": {
    "description": "Find out more about Swagger",
    "url": "http://swagger.io"
  }
}