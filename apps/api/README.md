# Go Fiber Vercel Starter

An opionated production-ready starter template (included Swagger Docs) for deploying Go Fiber applications on Vercel's serverless platform.

## Features

- **Go Fiber v2**: High-performance web framework
- **Vercel Deployment**: Optimized for serverless deployment
- **Swagger Documentation**: API documentation using Swagger
- **Hot Reload**: Development with Air for automatic rebuilds
- **Structured Logging**: Using Uber's Zap logger
- **High Performance**: Using ByteDance's Sonic for JSON handling and Protocol Buffers for Data Representation

## Prerequisites

- Go 1.23.1 or later
- [Vercel CLI](https://vercel.com/cli) (for deployment)
- [Air](https://github.com/cosmtrek/air) (for development)

## Project Structure

```
.
├── cmd/
│   └── app/
│       ├── development/  # Development environment entry
│       └── production/   # Production environment entry
├── pkg/                  # Package code
├── tmp/                  # Temporary build files
├── .air.toml            # Air configuration for hot reload
├── go.mod               # Go modules file
├── go.sum               # Go modules checksum
└── vercel.json          # Vercel deployment configuration
```

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd go-fiber-vercel-starter
   ```

2. Install dependencies:

   ```bash
   go mod download
   ```

3. Run development server (with hot reload):
   ```bash
   air
   ```

## Development

The project uses Air for hot reload during development. The configuration in `.air.toml` watches for file changes and automatically rebuilds the application.

## Production Deployment

This project is configured for deployment on Vercel. The `vercel.json` configuration includes:

- Entry point: `cmd/app/production/main.go`
- Supported HTTP methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
- Automatic routing configuration

To deploy:

1. Install Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

## Dependencies

Key packages used in this project:

- `github.com/gofiber/fiber/v2`: Web framework
- `github.com/gofiber/contrib/swagger`: API documentation
- `github.com/gofiber/contrib/fiberzap/v2`: Structured logging
- `github.com/bytedance/sonic`: Fast JSON serialization
- `go.uber.org/zap`: Logging

## License

This project is open-source and available under the MIT License.
