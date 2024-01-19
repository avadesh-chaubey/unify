export const swaggerGetDocument = {
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
      "name": "cms",
      "description": "CMS Information View APIs"
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
      "get": {
        "tags": [
          "Cms"
        ],
        "summary": "View Cms blog",
        "description": "API by which User can View Content Management Blogs",
        "operationId": "viewblogs",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "startDate",
            "in": "query",
            "description": "Display Blogs within the  Date range ",
            "required": false,
            "schema": {
              "$ref": "#/definitions/CmsBlogReq"
            }
          },
          {
            "name": "endDate",
            "in": "query",
            "description": "Display Blogs within the  Date range",
            "required": false,
            "schema": {
              "$ref": "#/definitions/CmsBlogReq"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Enter page number which page want to dislpay",
            "required": false,
            "schema": {
              "$ref": "#/definitions/CmsBlogReq"
            }
          },
          {
            "name": "size",
            "in": "query",
            "description": "The number of records wants to display",
            "required": false,
            "schema": {
              "$ref": "#/definitions/CmsBlogReq"
            }
          },
          {
            "name": "sort",
            "in": "query",
            "description": "Display records in asc/desc",
            "required": false,
            "schema": {
              "$ref": "#/definitions/CmsBlogReq"
            }
          },
          {
            "name": "accessKey",
            "in": "query",
            "description": "Display records with parameter in ascending or descending order ",
            "required": false,
            "schema": {
              "$ref": "#/definitions/CmsBlogReq"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "CMS Blog List",
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
                    "tags": ["string"] ,
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
    "/api/cms/blog/searchauthor/{authorName}": {
      "get": {
        "tags": [
          "Cms"
        ],
        "summary": "View Cms blog",
        "description": "API by which User can View Content Management Blogs by Author Name",
        "operationId": "viewblogsbyauthorname",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "authorName",
            "in": "path",
            "description": "Display Blog Details by author name ",
            "required": false,
            "schema": {
              "$ref": "#/definitions/CmsBlogByAuthorReq"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "CMS Blog List",
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
                    "tags": ["string"] ,
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
    "/api/cms/blog/{blogId}": {
      "get": {
        "tags": [
          "Cms"
        ],
        "summary": "View Cms blog",
        "description": "API by which User can View Content Management Blogs by BlogId",
        "operationId": "viewblogsbyblogid",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "blogId",
            "in": "path",
            "description": "Display Blog Details by blogid ",
            "required": false,
            "schema": {
              "$ref": "#/definitions/CmsBlogByBlogIdReq"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "CMS Blog List",
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
                    "tags": ["string"] ,
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
      "get": {
        "tags": [
          "Cms"
        ],
        "summary": "View Cms Categories",
        "description": "API by which User can View Content Management Categories",
        "operationId": "viewCategories",
        "produces": [
          "application/json"
        ],
        "responses": {
          "200": {
            "description": "CMS Categories List",
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
                    "example": {
                      "id": "string",
                      "categoryName": "string"
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
    "/api/cms/tag": {
      "get": {
        "tags": [
          "Cms"
        ],
        "summary": "View Cms Tag",
        "description": "API by which User can View Content Management Tag",
        "operationId": "viewTag",
        "produces": [
          "application/json"
        ],
        "responses": {
          "200": {
            "description": "CMS Tag List",
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
                    "example": {
                      "id": "string",
                      "tagName": "string"
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
    "CmsBlogReq": {
      "type": "object",
      "properties": {
        "startDate": {
          "type": "string",
          "requred": false
        },
        "endDate": {
          "type": "string",
          "requred": false
        },
        "page": {
          "type": "string",
          "requred": false
        },
        "size": {
          "type": "string",
          "requred": false
        },
        "sort": {
          "type": "string",
          "requred": false
        },
        "accessKey": {
          "type": "string",
          "requred": false
        },
      },
      "xml": {
        "name": "CmsBlogReq"
      }
    },
    "CmsBlogRes": {
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
              "type": "string"
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
        "name": "CmsBlogReq"
      }
    },
    "CmsBlogByAuthorReq": {
      "type": "object",
      "properties": {
        "authorName": {
          "type": "string",
          "requred": true
        }
      },
      "xml": {
        "name": "CmsBlogByAuthorReq"
      }
    },
    "CmsBlogByBlogIdReq": {
      "type": "object",
      "properties": {
        "blogId": {
          "type": "string",
          "requred": true
        }
      },
      "xml": {
        "name": "CmsBlogByBlogIdReq"
      }
    },
  },
  "externalDocs": {
    "description": "Find out more about Swagger",
    "url": "http://swagger.io"
  }
}