package configs

const SwaggerJSON = `
{
    "swagger": "2.0",
    "info": {
        "title": "Ekel Backend",
        "termsOfService": "http://swagger.io/terms/",
        "contact": {
            "name": "API Support",
            "url": "http://www.swagger.io/support",
            "email": "support@swagger.io"
        },
        "license": {
            "name": "Apache 2.0",
            "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
        },
        "version": "1.0"
    },
    "paths": {
        "/": {
            "get": {
                "description": "Get Home",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Home"
                ],
                "summary": "Get Home",
                "responses": {
                    "200": {
                        "description": "Get Home Success",
                        "schema": {
                            "$ref": "#/definitions/models.APIHomeResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/models.APIErrorResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/models.APIErrorResponse"
                        }
                    }
                }
            }
        },
        "/api/v1/admin/get-all-user-by-email": {
            "get": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "Get All User By Email",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Admin"
                ],
                "summary": "Get All User By Email",
                "responses": {
                    "200": {
                        "description": "Success Get All User By Email",
                        "schema": {
                            "$ref": "#/definitions/models.APISuccessGetUserByEmailResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/models.APIErrorResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/models.APIErrorResponse"
                        }
                    }
                }
            }
        },
        "/api/v1/admin/login": {
            "post": {
                "description": "Login Admin",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Admin"
                ],
                "summary": "Login Admin",
                "parameters": [
                    {
                        "description": "Auth Request",
                        "name": "authRequest",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.AuthRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Success Login Admin",
                        "schema": {
                            "$ref": "#/definitions/models.AuthAPISuccessResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/models.APIErrorResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/models.APIErrorResponse"
                        }
                    }
                }
            }
        },
        "/api/v1/admin/validate-cookie": {
            "post": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "Validate Cookie",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Admin"
                ],
                "summary": "Validate Cookie",
                "responses": {
                    "200": {
                        "description": "Success Validate Cookie",
                        "schema": {
                            "$ref": "#/definitions/models.APISuccessResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/models.APIErrorResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/models.APIErrorResponse"
                        }
                    }
                }
            }
        },
        "/api/v1/guestbook": {
            "get": {
                "description": "Get Guestbook",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Guestbook"
                ],
                "summary": "Get Guestbook",
                "responses": {
                    "200": {
                        "description": "Success Get Guestbook",
                        "schema": {
                            "$ref": "#/definitions/models.APISuccessGetGuestbookResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/models.APIErrorResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/models.APIErrorResponse"
                        }
                    }
                }
            },
            "post": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "Create Guestbook",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Guestbook"
                ],
                "summary": "Create Guestbook",
                "parameters": [
                    {
                        "description": "Guestbook",
                        "name": "guestbook",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/entities.Guestbook"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Success Create Guestbook",
                        "schema": {
                            "$ref": "#/definitions/models.APISuccessResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/models.APIErrorResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/models.APIErrorResponse"
                        }
                    }
                }
            }
        },
        "/api/v1/guestbook/{id}": {
            "put": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "Update Guestbook\nEnter the token with the BearerAuth prefix.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Guestbook"
                ],
                "summary": "Update Guestbook",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "Guestbook",
                        "name": "guestbook",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/entities.Guestbook"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Success Update Guestbook",
                        "schema": {
                            "$ref": "#/definitions/models.APISuccessResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/models.APIErrorResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/models.APIErrorResponse"
                        }
                    }
                }
            },
            "delete": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "Delete Guestbook\nEnter the token with the BearerAuth prefix.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Guestbook"
                ],
                "summary": "Delete Guestbook",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Success Delete Guestbook",
                        "schema": {
                            "$ref": "#/definitions/models.APISuccessResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/models.APIErrorResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/models.APIErrorResponse"
                        }
                    }
                }
            }
        },
        "/metrics": {
            "get": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "Get Metrics",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Metrics"
                ],
                "summary": "Get Metrics",
                "responses": {
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/models.APIErrorResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/models.APIErrorResponse"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "entities.Guestbook": {
            "type": "object",
            "properties": {
                "created_at": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "message": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                }
            }
        },
        "entities.User": {
            "type": "object",
            "properties": {
                "email": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                }
            }
        },
        "models.APIErrorResponse": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string"
                },
                "stack": {
                    "type": "string"
                },
                "status_code": {
                    "type": "integer"
                }
            }
        },
        "models.APIHomeResponse": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string"
                },
                "status_code": {
                    "type": "integer"
                }
            }
        },
        "models.APISuccessGetGuestbookResponse": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/entities.Guestbook"
                    }
                },
                "message": {
                    "type": "string"
                },
                "status_code": {
                    "type": "integer"
                }
            }
        },
        "models.APISuccessGetUserByEmailResponse": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/entities.User"
                    }
                },
                "message": {
                    "type": "string"
                },
                "status_code": {
                    "type": "integer"
                }
            }
        },
        "models.APISuccessResponse": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string"
                },
                "status_code": {
                    "type": "integer"
                }
            }
        },
        "models.AuthAPISuccessResponse": {
            "type": "object",
            "properties": {
                "auth_token": {
                    "type": "string"
                },
                "message": {
                    "type": "string"
                },
                "status_code": {
                    "type": "integer"
                }
            }
        },
        "models.AuthRequest": {
            "type": "object",
            "properties": {
                "email": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                }
            }
        }
    },
    "securityDefinitions": {
        "BearerAuth": {
            "description": "Enter the token with the BearerAuth prefix.\"",
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
        }
    }
}
`
