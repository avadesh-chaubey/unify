export const swaggerGetDocument = {
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
      "description": "Partner Information View APIs"
    }
  ],
  "schemes": [
    "https",
    "http"
  ],
  "paths": {
    "/api/partner/bankdetails": {
      "get": {
        "tags": [
          "Partner"
        ],
        "summary": "View All Bank Details of Partner",
        "description": "API by which partner can view bank details",
        "operationId": "viewBankDetails",
        "produces": [
          "application/json"
        ],
        "responses": {
          "200": {
            "description": "Oredr Object",
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
          }
        }
      }
    },
    "/api/partner/employee": {
      "get": {
        "tags": [
          "Partner"
        ],
        "summary": "View Employee Details of Partner",
        "description": "API by which partner can view Employee details",
        "operationId": "viewEmployeeDetails",
        "produces": [
          "application/json"
        ],
        "responses": {
          "200": {
            "description": "Oredr Object",
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
          }
        }
      }
    },
    "/api/partner/signingauth": {
      "get": {
        "tags": [
          "Partner"
        ],
        "summary": "View Partner Signing Authority Details of Partner",
        "description": "API by which partner can view details of Signing Authority",
        "operationId": "viewSigningAuthDetails",
        "produces": [
          "application/json"
        ],
        "responses": {
          "200": {
            "description": "Oredr Object",
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
          }
        }
      }
    },
    "/api/partner/information": {
      "get": {
        "tags": [
          "Partner"
        ],
        "summary": "View Partner Details",
        "description": "API by which partner can view  details",
        "operationId": "viewPartnerDetails",
        "produces": [
          "application/json"
        ],
        "responses": {
          "200": {
            "description": "Oredr Object",
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