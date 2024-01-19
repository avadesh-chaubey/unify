export const swaggerPutDocument = {
  "swagger": "2.0",
  "info": {
    "description": "Unify Care",
    "version": "1.0.0",
    "title": "Unify Care"
  },
  "host": "rainbowpro.unify.care",
  "basePath": "/",
  "tags": [
    {
      "name": "Cms",
      "description": "Cms APIs"
    }
  ],
  "schemes": [
    "https",
    "http"
  ],
  "securityDefinitions": {
    "authtoken": {
      "type": "apiKey",
      "name": "Authorization",
      "schema": "auth",
      "in": "header"
    }
  },
  "security": [{
    "authtoken": []
  }],
  "paths": {
    "/api/cms/category/{id}": {
      "put": {
        "tags": [
          "Cms"
        ],
        "summary": "Update Category",
        "description": "API by which User can Update Category detials",
        "operationId": "updateCategory",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "update Category",
            "required": true,
            "schema": {
              "$ref": "#/definitions/UpdateCategoryReq"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Updated Category Details",
            "schema": {
              "type": "object",
              "properties": {
                "status": {
                  "type": "number",
                },
                "message": {
                  "type": "string",
                },
                "data": {
                  "type": "object",
                  "properties": {
                    "massage": {
                      "type": "string"
                    }
                  }
                }

              },
            }
          },
          "400": {
            "description": "Invalid credentials",
            "schema": {
              "type": "object",
              "properties": {
                "status": {
                  "type": "number",
                },
                "message": {
                  "type": "string",
                },
                "data": {
                  "type": "object",
                  "properties": {
                    "response": {
                      "type": "string"
                    }
                  }
                }
              },
            }
          },
          "401": {
            "description": "User Not Verified",
            "schema": {
              "type": "object",
              "properties": {
                "status": {
                  "type": "number",
                },
                "message": {
                  "type": "string",
                },
                "data": {
                  "type": "object",
                  "properties": {
                    "response": {
                      "type": "string"
                    }
                  }
                }
              },
            }
          },
          "404": {
            "description": "Bad Request Error",
            "schema": {
              "type": "object",
              "properties": {
                "status": {
                  "type": "number",
                },
                "message": {
                  "type": "string",
                },
                "data": {
                  "type": "object",
                  "properties": {
                    "response": {
                      "type": "string"
                    }
                  }
                }
              },
            }
          }
        }
      }
    },
    "/api/cms/tag/{id}": {
      "put": {
        "tags": [
          "Cms"
        ],
        "summary": "Update Tag",
        "description": "API by which User can Update Tag detials",
        "operationId": "updateTag",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Update Tag",
            "required": true,
            "schema": {
              "$ref": "#/definitions/UpdateTagReq"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Updated Tag Details",
            "schema": {
              "type": "object",
              "properties": {
                "status": {
                  "type": "number",
                },
                "message": {
                  "type": "string",
                },
                "data": {
                  "type": "object",
                  "properties": {
                    "massage": {
                      "type": "string"
                    }
                  }
                }
              },
            }
          },
          "400": {
            "description": "Invalid credentials",
            "schema": {
              "type": "object",
              "properties": {
                "status": {
                  "type": "number",
                },
                "message": {
                  "type": "string",
                },
                "data": {
                  "type": "object",
                  "properties": {
                    "response": {
                      "type": "string"
                    }
                  }
                }
              },
            }
          },
          "401": {
            "description": "User Not Verified",
            "schema": {
              "type": "object",
              "properties": {
                "status": {
                  "type": "number",
                },
                "message": {
                  "type": "string",
                },
                "data": {
                  "type": "object",
                  "properties": {
                    "response": {
                      "type": "string"
                    }
                  }
                }
              },
            }
          },
          "404": {
            "description": "Bad Request Error",
            "schema": {
              "type": "object",
              "properties": {
                "status": {
                  "type": "number",
                },
                "message": {
                  "type": "string",
                },
                "data": {
                  "type": "object",
                  "properties": {
                    "response": {
                      "type": "string"
                    }
                  }
                }
              },
            }
          }
        }
      }
    },
  },
  "definitions": {
    "UpdateCategoryReq": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "required": "true"
        },
        "categoryName": {
          "type": "string",
          "required": "true"
        },
      },
      "xml": {
        "name": "UpdateCategoryReq"
      }
    },
    "UpdateCategoryRes": {
      "type": "object",
      "properties": {
        "status": {
          "type": "number",
        },
        "message": {
          "type": "string",
        },
        "data": {
          "type": "object",
          "properties": {
            "massage": {
              "type": "string"
            }
          }
        }
      },
      "xml": {
        "name": "UpdateCategoryRes"
      }
    },
    "UpdateTagReq": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "required": "true"
        },
        "tagName": {
          "type": "string",
          "required": "true"
        },
      },
      "xml": {
        "name": "UpdateTagReq"
      }
    },
    "UpdateTagRes": {
      "type": "object",
      "properties": {
        "status": {
          "type": "number",
        },
        "message": {
          "type": "string",
        },
        "data": {
          "type": "object",
          "properties": {
            "massage": {
              "type": "string"
            }
          }
        }
      },
      "xml": {
        "name": "UpdateTagRes"
      }
    },
  },
  "externalDocs": {
    "description": "Find out more about Swagger",
    "url": "http://swagger.io"
  }
}