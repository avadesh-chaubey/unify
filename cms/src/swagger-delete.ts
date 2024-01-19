export const swaggerDeleteDocument = {
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
      "type" : "apiKey",
      "name": "Authorization",
      "schema": "auth",
      "in": "header"
    }
  },
  "security": [{
    "authtoken": []
  }],
  "paths": {
    "/api/cms/blog/{blogId}": {
      "delete": {
        "tags": [
          "Cms"
        ],
        "summary": "Delete Blog",
        "description": "API by which User can Delete Blog",
        "operationId": "deleteBlog",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "blogId",
            "in": "path",
            "description": "Delete Blog by blogid",
            "required": true,
            "schema": {
              "$ref": "#/definitions/DeleteBlogReq"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Deleted Blog Successfully",
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
    "/api/cms/category/{id}": {
      "delete": {
        "tags": [
          "Cms"
        ],
        "summary": "Delete Category",
        "description": "API by which User can Delete Category",
        "operationId": "deleteCategory",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "description": "Delete Category by id",
            "required": true,
            "schema": {
              "$ref": "#/definitions/DeleteCategoryReq"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Deleted Category Successfully",
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
      "delete": {
        "tags": [
          "Cms"
        ],
        "summary": "Delete Tag",
        "description": "API by which User can Delete Tag",
        "operationId": "deleteTag",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "description": "Delete Tag by id",
            "required": true,
            "schema": {
              "$ref": "#/definitions/DeleteTagReq"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Deleted Tag Successfully",
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
    "DeleteBlogReq": {
      "type": "object",
      "properties": {
        "blogId": {
          "type": "string",
          "required": "true"
        },
      },
      "xml": {
        "name": "DeleteBlogReq"
      }
    },
    "DeleteBlogRes": {
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
        "name": "DeleteBlogRes"
      }
    },
    "DeleteCategoryReq": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "required": "true"
        },
      },
      "xml": {
        "name": "DeleteCategoryReq"
      }
    },
    "DeleteCategoryRes": {
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
        "name": "DeleteCategoryRes"
      }
    },
    "DeleteTagReq": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "required": "true"
        },
      },
      "xml": {
        "name": "DeleteTagReq"
      }
    },
    "DeleteTagRes": {
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
        "name": "DeleteTagRes"
      }
    },
  },
  "externalDocs": {
    "description": "Find out more about Swagger",
    "url": "http://swagger.io"
  }
}