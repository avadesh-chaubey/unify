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
      "name": "Appointment",
      "description": "Patient Doctor Appointment Service"
    }
  ],
  "schemes": [
    "https",
    "http"
  ],
  "paths": {
    "/api/appointment/addslots": {
      "post": {
        "tags": [
          "RosterManager"
        ],
        "summary": "Add Consultant Appointment Slots",
        "description": "API by which Roster Manager can add availablity of Doctor for online consultation",
        "operationId": "addslots",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Appointment Slot object that need to be configured for consultant",
            "required": true,
            "schema": {
              "$ref": "#/definitions/AppointmentSlotReq"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "Slot Added Successfully",
            "schema": {
              "type": "string"
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
    "/api/appointment/add": {
      "post": {
        "tags": [
          "Patient/Customer Support"
        ],
        "summary": "Add New Appointment",
        "description": "API by which patient can create new appointment",
        "operationId": "addNewAppointment",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Appointment Add object that need to be configured for consultant",
            "required": true,
            "schema": {
              "$ref": "#/definitions/AppointmentReq"
            }
          },
        ],
        "responses": {
          "201": {
            "description": "Appointment Object",
            "schema": {
              "type": "object",
              "items": {
                "$ref": "#/definitions/AppointmentRes"
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
    "/api/appointment/cancel": {
      "post": {
        "tags": [
          "Patient/Customer Support"
        ],
        "summary": "Cancel Appointment",
        "description": "API by which patient can cancel appointment",
        "operationId": "cancelAppointment",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "appointmentId",
            "in": "body",
            "description": "Appointment Id  that need to be cancelled",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
        ],
        "responses": {
          "201": {
            "description": "Appointment Object",
            "schema": {
              "type": "object",
              "items": {
                "$ref": "#/definitions/AppointmentRes"
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
    "/api/appointment/removeslots": {
      "post": {
        "tags": [
          "RosterManager"
        ],
        "summary": "Remove Consultant Appointment Slots",
        "description": "API by which Roster Manager can remove availablity of Doctor for online consultation",
        "operationId": "removeslots",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Appointment Slot object that need to be configured for consultant",
            "required": true,
            "schema": {
              "$ref": "#/definitions/AppointmentSlotRemoveReq"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "Slot Removed Successfully",
            "schema": {
              "type": "string"
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
    "/api/appointment/reschedule": {
      "post": {
        "tags": [
          "Customer Support"
        ],
        "summary": "Reshedule Appointment",
        "description": "API by which patient can reschedule appointment",
        "operationId": "rescheduleAppointment",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Appointment Reschedule object that need to be configured for consultant",
            "required": true,
            "schema": {
              "$ref": "#/definitions/AppointmentRescheduleReq"
            }
          },
        ],
        "responses": {
          "201": {
            "description": "Appointment Object",
            "schema": {
              "type": "object",
              "items": {
                "$ref": "#/definitions/AppointmentRes"
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
    "/api/appointment/view/{customerId}": {
      "get": {
        "tags": [
          "Patient/Customer Support"
        ],
        "summary": "View All Appointments of Patient",
        "description": "API by which patient can view all appointment",
        "operationId": "viewAppointment",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "customerId",
            "in": "path",
            "description": "customerId by which appointment will be identified",
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
                "$ref": "#/definitions/AppointmentRes"
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
    "/api/appointment/viewslots/{consultantId}": {
      "get": {
        "tags": [
          "RosterManager"
        ],
        "summary": "View all available slots of Consultant",
        "description": "API by which roster manager can view all available slots of consultant",
        "operationId": "viewslots",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "consultantId",
            "in": "path",
            "description": "consultantId by which slots will be identified",
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
                "$ref": "#/definitions/AppointmentSlotRes"
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
    "AppointmentSlotReq": {
      "type": "object",
      "properties": {
        "consultantId": {
          "type": "string"
        },
        "appointmentDate": {
          "type": "string"
        },
        "availableSlotList": {
          "type": "array",
          "items": {
            "type": "number"
          }
        }
      },
      "xml": {
        "name": "AppointmentSlotReq"
      }
    },
    "AppointmentSlotRemoveReq": {
      "type": "object",
      "properties": {
        "consultantId": {
          "type": "string"
        },
        "appointmentDate": {
          "type": "string"
        },
        "removeSlotList": {
          "type": "array",
          "items": {
            "type": "number"
          }
        }
      },
      "xml": {
        "name": "AppointmentSlotRemoveReq"
      }
    },
    "AppointmentReq": {
      "type": "object",
      "properties": {
        "consultantId": {
          "type": "string"
        },
        "appointmentDate": {
          "type": "string"
        },
        "customerId": {
          "type": "string"
        },
        "consultationType": {
          "type": "string"
        },
        "appointmentSlotId": {
          "type": "number"
        }
      },
      "xml": {
        "name": "AppointmentReq"
      }
    },
    "AppointmentSlotRes": {
      "type": "object",
      "properties": {
        "appointmentDate": {
          "type": "string"
        },
        "availableSlotsList": {
          "type": "array",
          "items": {
            "type": "number"
          }
        },
      },
      "xml": {
        "name": "AppointmentSlotRes"
      }
    },
    "AppointmentRes": {
      "type": "object",
      "properties": {
        "consultantId": {
          "type": "string"
        },
        "id": {
          "type": "string"
        },
        "creatorId": {
          "type": "string"
        },
        "partnerId": {
          "type": "string"
        },
        "appointmentDate": {
          "type": "string"
        },
        "customerId": {
          "type": "string"
        },
        "consultationType": {
          "type": "string"
        },
        "appointmentSlotId": {
          "type": "number"
        },
        "createdBy": {
          "type": "string"
        },
        "basePriceInINR": {
          "type": "number"
        },
        "appointmentStatus": {
          "type": "string"
        },
        "expirationDate": {
          "type": "Date"
        },
        "appointmentCreationTime": {
          "type": "Date"
        },
        "appointmentStatusUpdateTime": {
          "type": "Date"
        },
        "lastAppointmentStatus": {
          "type": "string"
        },
      },
      "xml": {
        "name": "AppointmentRes"
      }
    },
    "AppointmentRescheduleReq": {
      "type": "object",
      "properties": {
        "consultantId": {
          "type": "string"
        },
        "appointmentDate": {
          "type": "string"
        },
        "customerId": {
          "type": "string"
        },
        "appointmentId": {
          "type": "string"
        },
        "consultationType": {
          "type": "string"
        },
        "appointmentSlotId": {
          "type": "number"
        }
      },
      "xml": {
        "name": "AppointmentRescheduleReq"
      }
    },
  },
  "externalDocs": {
    "description": "Find out more about Swagger",
    "url": "http://swagger.io"
  }
}