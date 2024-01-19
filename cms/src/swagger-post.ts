export const swaggerPostDocument = {
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
    "/api/cms/blog": {
      "post": {
        "tags": [
          "Cms"
        ],
        "summary": "Add new Blog",
        "description": "API by which User can add Blog detials",
        "operationId": "addBlog",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Add New Blog",
            "required": true,
            "schema": {
              "$ref": "#/definitions/AddBlogReq"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "New Blog Details",
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
                  "type": "array",
                  "example": {
                    "title": "string",
                    "blogId": "string",
                    "metaKeywords": ["string"],
                    "metaDescription": "string",
                    "seoUrl": "string",
                    "titleImageUrl": "string",
                    "content": "string",
                    "categories": ["string"],
                    "tags": ["string"],
                    "authorName": ["string"],
                    "publishedDate": "string",
                    "isPublished": "boolean",
                    "blogPublishedDate": "string",
                    "blogPublishedTime": "string",
                    "buttonCaption": "string",
                    "sorting": "number",
                    "publishOnHomePage": "boolean"
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
    "/api/cms/category": {
      "post": {
        "tags": [
          "Cms"
        ],
        "summary": "Add new Category",
        "description": "API by which User can add Category detials",
        "operationId": "addCategory",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Add New Category",
            "required": true,
            "schema": {
              "$ref": "#/definitions/AddCategoryReq"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "New Category Details",
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
                  "type": "array",
                  "example": {
                    "categoryName": "string"
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
    "/api/cms/tag": {
      "post": {
        "tags": [
          "Cms"
        ],
        "summary": "Add new Tag",
        "description": "API by which User can add Tag detials",
        "operationId": "addTag",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Add New Tag",
            "required": true,
            "schema": {
              "$ref": "#/definitions/AddTagReq"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "New Tag Details",
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
                  "type": "array",
                  "example": {
                    "tagName": "string"

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
    "AddBlogReq": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "required": "true"
        },
        "blogId": {
          "type": "string",
          "required": "true"
        },
        "metaKeywords": {
          "type": "array",
          "items": {
            "type": "string",
            "required": "false",
            "default": ""
          }
        },
        "metaDescription": {
          "type": "string",
          "required": "true"
        },
        "seoUrl": {
          "type": "string",
          "required": "true"
        },
        "titleImageUrl": {
          "type": "string",
          "required": "false",
          "default": ""
        },
        "content": {
          "type": "string",
          "required": "true"
        },
        "categories": {
          "items": {
            "type": "string",
            "required": "false",
          }
        },
        "tags": {
          "items": {
            "type": "string",
            "required": "false",
          }
        },
        "authorName": {
          "type": "string",
          "required": "true"
        },
        "publishedDate": {
          "type": "string",
          "required": "false",
          "default": ""
        },
        "isPublished": {
          "type": "boolean",
          "required": "true"
        },
        "blogPublishedDate": {
          "type": "string",
          "required": "false",
          "default": ""
        },
        "blogPublishedTime": {
          "type": "string",
          "required": "false",
          "default": ""
        },
        "buttonCaption": {
          "type": "string",
          "required": "false",
        },
        "sorting": {
          "type": "number",
          "required": "false",
        },
        "publishOnHomePage": {
          "type": "boolean",
          "required": "false",
        },
      },
      "xml": {
        "name": "AddBlogReq"
      }
    },
    "AddBlogRes": {
      "type": "object",
      "properties": {
        "status": {
          "type": "number",
        },
        "message": {
          "type": "string",
        },
        "data": {
          "type": "array",
          "example": {
            "title": {
              "type": "tring"
            },
            "blogId": {
              "type": "string"
            },
            "metaKeywords": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "metaDescription": {
              "type": "string"
            },
            "seoUrl": {
              "type": "string"
            },
            "titleImageUrl": {
              "type": "string"
            },
            "content": {
              "type": "string"
            },
            "categories": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "tags": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "authorName": {
              "type": "string"
            },
            "publishedDate": {
              "type": "string"
            },
            "isPublished": {
              "type": "boolean"
            },
            "blogPublishedDate": {
              "type": "string"
            },
            "blogPublishedTime": {
              "type": "string"
            },
            "buttonCaption": {
              "type": "string"
            },
            "sorting": {
              "type": "number"
            },
            "publishOnHomePage": {
              "type": "boolean"
            },
          }
        }
      },
      "xml": {
        "name": "AddBlogRes"
      }
    },
    "AddCategoryReq": {
      "type": "object",
      "properties": {
        "categoryName": {
          "type": "string",
          "required": "true"
        },
      },
      "xml": {
        "name": "AddCategoryReq"
      }
    },
    "AddCategoryRes": {
      "type": "object",
      "properties": {
        "status": {
          "type": "number",
        },
        "message": {
          "type": "string",
        },
        "data": {
          "type": "array",
          "example": {
            "categoryName": {
              "type": "string"
            },
          }
        }
      },
      "xml": {
        "name": "AddCategoryRes"
      }
    },
    "AddTagReq": {
      "type": "object",
      "properties": {
        "tagName": {
          "type": "string",
          "required": "true"
        },
      },
      "xml": {
        "name": "AddTagReq"
      }
    },
    "AddTagRes": {
      "type": "object",
      "properties": {
        "status": {
          "type": "number",
        },
        "message": {
          "type": "string",
        },
        "data": {
          "type": "array",
          "example": {
            "tagName": {
              "type": "string"
            },
          }
        }
      },
      "xml": {
        "name": "AddTagRes"
      }
    },
  },
  "externalDocs": {
    "description": "Find out more about Swagger",
    "url": "http://swagger.io"
  }
}