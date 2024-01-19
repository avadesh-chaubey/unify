export const swaggerDocument = {
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
      "name": "Orders",
      "description": "Patient Order Payment Service"
    }
  ],
  "schemes": [
    "https",
    "http"
  ],
  "paths": {
    "/api/order/cancel": {
      "post": {
        "tags": [
          "Patient/Customer Support"
        ],
        "summary": "Cancel Appointment Order",
        "description": "API by which Patient can cancel payment for appointment order",
        "operationId": "cancelOrder",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "productId",
            "in": "body",
            "description": "Order for which payment need to cancel",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Order Object",
            "schema": {
              "type": "object",
              "items": {
                "$ref": "#/definitions/OrderRes"
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
    "/api/order/new": {
      "post": {
        "tags": [
          "Patient/Customer Support"
        ],
        "summary": "New Appointment Order",
        "description": "API by which Patient can do payment for appointment order",
        "operationId": "cancelOrder",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "productId",
            "in": "body",
            "description": "Order for which payment need to made",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Oredr Object",
            "schema": {
              "type": "object",
              "items": {
                "$ref": "#/definitions/OrderRes"
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
    "/api/order/{id}": {
      "get": {
        "tags": [
          "Patient/Customer Support"
        ],
        "summary": "View Appointment Order",
        "description": "API by which patient can view single order",
        "operationId": "viewOrder",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "description": "id by which order will be identified",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Oredr Object",
            "schema": {
              "type": "object",
              "items": {
                "$ref": "#/definitions/OrderRes"
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
    "/api/order/all/{customerId}": {
      "get": {
        "tags": [
          "Patient/Customer Support"
        ],
        "summary": "View All Appointment Orders",
        "description": "API by which patient can view all order",
        "operationId": "viewOrder",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "customerId",
            "in": "path",
            "description": "customerId by which all orders will be identified",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Oredr Object",
            "schema": {
              "type": "object",
              "items": {
                "$ref": "#/definitions/OrderRes"
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
    "OrderRes": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "basePriceInINR": {
          "type": "number"
        },
        "customerId": {
          "type": "string"
        },
        "currency": {
          "type": "string"
        },
        "productId": {
          "type": "string"
        },
        "status": {
          "type": "string"
        },
        "receipt": {
          "type": "string"
        },
        "order_id": {
          "type": "string"
        }
      },
      "xml": {
        "name": "OrderRes"
      }
    },
  },
  "externalDocs": {
    "description": "Find out more about Swagger",
    "url": "http://swagger.io"
  }
}