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
      "name": "user",
      "description": "User Auth Service"
    }
  ],
  "schemes": [
    "https",
    "http"
  ],
  "paths": {
    "/api/users/emailverification/{id}": {
      "get": {
        "tags": [
          "user"
        ],
        "summary": "User Email Verification API",
        "description": "API by which user can create password again",
        "operationId": "emailverification",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "description": "id by which user will be verified",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Email Verified Successfully, Welcome email has been sent to user's email id",
            "schema": {
              "type": "string"
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
    "/api/users/forgotpassword": {
      "post": {
        "tags": [
          "user"
        ],
        "summary": "Forgot Password API",
        "description": "API by which user can create password again",
        "operationId": "forgotPassword",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "emailId",
            "in": "body",
            "description": "emailId for which password has to be created",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Password reset initiated and reset password link has been sent to provided emailId",
            "schema": {
              "type": "string"
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
    "/api/users/employeesignin": {
      "post": {
        "tags": [
          "user"
        ],
        "summary": "Employee Signin API",
        "description": "API by which Employee can signin",
        "operationId": "employeesignin",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Email id and password",
            "required": true,
            "schema": {
              "$ref": "#/definitions/EmployeeSignin"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "User Object",
            "schema": {
              "type": "object",
              "items": {
                "$ref": "#/definitions/User"
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
    "/api/users/resetpassword": {
      "post": {
        "tags": [
          "user"
        ],
        "summary": "Reset Password API",
        "description": "API by which user can reset password",
        "operationId": "resetPassword",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Password and key",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ResetPassword"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Password has been reset successfully",
            "schema": {
              "type": "string"
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
    "/api/users/partnersignup": {
      "post": {
        "tags": [
          "user"
        ],
        "summary": "Signup API",
        "description": "API by which partner can register ",
        "operationId": "partnersignup",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "User object that need to be registered",
            "required": true,
            "schema": {
              "$ref": "#/definitions/User"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "User created",
            "schema": {
              "type": "object",
              "items": {
                "$ref": "#/definitions/User"
              }
            }
          },
          "400": {
            "description": "Email already in use"
          }
        }
      }
    },
    "/api/users/emailotpsignin": {
      "post": {
        "tags": [
          "user"
        ],
        "summary": "Patient Signin API",
        "description": "API by which patient can signin",
        "operationId": "emailotpsignin",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "emailId": "body",
            "in": "body",
            "description": "Email id and OTP",
            "required": true,
            "schema": {
              "$ref": "#/definitions/PatientEmailSignin"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "User Object",
            "schema": {
              "type": "object",
              "items": {
                "$ref": "#/definitions/User"
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
    "/api/users/patientsignup": {
      "post": {
        "tags": [
          "user"
        ],
        "summary": "Patient Signup API",
        "description": "API by which patient can register ",
        "operationId": "patientsignup",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "User object that need to be registered",
            "required": true,
            "schema": {
              "$ref": "#/definitions/Patient"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "User created",
            "schema": {
              "type": "object",
              "items": {
                "$ref": "#/definitions/Patient"
              }
            }
          },
          "400": {
            "description": "Email or Phone already in use"
          }
        }
      }
    },
    "/api/users/phoneotpsignin": {
      "post": {
        "tags": [
          "user"
        ],
        "summary": "Patient Signin API",
        "description": "API by which patient can signin",
        "operationId": "phoneotpsignin",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "emailId": "body",
            "in": "body",
            "description": "Phone Number and OTP",
            "required": true,
            "schema": {
              "$ref": "#/definitions/PatientPhoneSignin"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "User Object",
            "schema": {
              "type": "object",
              "items": {
                "$ref": "#/definitions/User"
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
    "/api/users/sendemailotp": {
      "post": {
        "tags": [
          "user"
        ],
        "summary": "Send OTP for Given Email ID",
        "description": "API by which user can create otp again",
        "operationId": "sendemailotp",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "emailId",
            "in": "body",
            "description": "emailId for which otp has to be created",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OTP Sent Successfully",
            "schema": {
              "type": "string"
            }
          },
          "400": {
            "description": "User Not Found"
          }
        }
      }
    },
    "/api/users/sendphoneemailotp": {
      "post": {
        "tags": [
          "user"
        ],
        "summary": "Phone and Email OTP API",
        "description": "API by which useer can get both otp",
        "operationId": "sendphoneemailotp",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "emailId": "body",
            "in": "body",
            "description": "Phone Number and Email Id",
            "required": true,
            "schema": {
              "$ref": "#/definitions/PatientEmailPhoneOTP"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OTP Sent Successfully",
            "schema": {
              "type": "string"
            }
          },
          "400": {
            "description": "User Not Found"
          }
        }
      }
    },
    "/api/users/sendphoneotp": {
      "post": {
        "tags": [
          "user"
        ],
        "summary": "Send OTP for Given Phone Number ",
        "description": "API by which user can create otp again",
        "operationId": "sendphoneotp",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "phoneNumber",
            "in": "body",
            "description": "phoneNumber for which otp has to be created",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OTP Sent Successfully",
            "schema": {
              "type": "string"
            }
          },
          "400": {
            "description": "User Not Found"
          }
        }
      }
    },
    "/api/users/sendverificationemail": {
      "post": {
        "tags": [
          "user"
        ],
        "summary": "Send Verification Email API",
        "description": "API to send email to user for verification",
        "operationId": "sendVerificationEmail",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "emailId",
            "in": "body",
            "description": "email id of user which has to be verify by user",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Verification Email Sent Successfully to provided emailID",
            "schema": {
              "type": "string"
            }
          },
          "400": {
            "description": "User has suspended"
          },
          "405": {
            "description": "Invalid credentials"
          }
        }
      }
    },
    "/api/users/signout": {
      "post": {
        "tags": [
          "user"
        ],
        "summary": "Signout API",
        "description": "API by which user can signout",
        "operationId": "signout",
        "produces": [
          "application/json"
        ],
        "parameters": [],
        "responses": {
          "200": {
            "description": "User successfully signout",
            "schema": {
              "type": "string"
            }
          }
        }
      }
    },
    "/api/users/deletebyemail": {
      "post": {
        "tags": [
          "user"
        ],
        "summary": "Delete User API",
        "description": "API by which user can be deleted ",
        "operationId": "deleteUser",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "emailId",
            "in": "body",
            "description": "email id of user which has to be deleted",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "User has been deleted successfully",
            "schema": {
              "type": "string"
            }
          },
          "405": {
            "description": "User not found"
          }
        }
      }
    }
  },
  "definitions": {
    "User": {
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
        "password": {
          "type": "string"
        },
        "phoneNumber": {
          "type": "string"
        }
      },
      "xml": {
        "name": "User"
      }
    },
    "Patient": {
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
        "emailOTP": {
          "type": "string"
        },
        "phoneNumber": {
          "type": "string"
        },
        "phoneOTP": {
          "type": "string"
        }
      },
      "xml": {
        "name": "Patient"
      }
    },
    "EmployeeSignin": {
      "type": "object",
      "properties": {
        "emailId": {
          "type": "string"
        },
        "password": {
          "type": "string"
        }
      },
      "xml": {
        "name": "EmployeeSignin"
      }
    },
    "PatientEmailPhoneOTP": {
      "type": "object",
      "properties": {
        "emailId": {
          "type": "string"
        },
        "phoneNumber": {
          "type": "string"
        }
      },
      "xml": {
        "name": "PatientEmailPhoneOTP"
      }
    },
    "PatientEmailSignin": {
      "type": "object",
      "properties": {
        "emailId": {
          "type": "string"
        },
        "otp": {
          "type": "string"
        }
      },
      "xml": {
        "name": "PatientEmailSignin"
      }
    },
    "PatientPhoneSignin": {
      "type": "object",
      "properties": {
        "phoneNumber": {
          "type": "string"
        },
        "otp": {
          "type": "string"
        }
      },
      "xml": {
        "name": "PatientPhoneSignin"
      }
    },
    "ResetPassword": {
      "type": "object",
      "properties": {
        "password": {
          "type": "string"
        },
        "key": {
          "type": "string"
        }
      },
      "xml": {
        "name": "ResetPassword"
      }
    }
  },
  "externalDocs": {
    "description": "Find out more about Swagger",
    "url": "http://swagger.io"
  }
}