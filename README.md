# Document Management System

A modern, beautiful document management system built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 📄 Smart document organization with AI-powered tagging
- 🔄 Fluid workflow management and approval processes
- 👥 Team collaboration with role-based access control
- 🔒 Enterprise-grade security and compliance
- 🎨 Beautiful, modern UI with neumorphic design
- 📱 Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js 18 or later
- pnpm (recommended) or npm
- Docker and Docker Compose (for containerized deployment)

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd document-management-system
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker Deployment

This project includes Docker configurations for both development and production environments.

### Production Deployment with Docker

1. Build and run the production container:
   ```bash
   docker-compose up --build
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

2. To run in detached mode:
   ```bash
   docker-compose up -d --build
   ```

3. To stop the services:
   ```bash
   docker-compose down
   ```

### Development with Docker

For development with hot-reload and volume mounting:

```bash
docker-compose --profile development up app-dev
```

This will:
- Mount your local code into the container
- Enable hot-reload for development
- Run on [http://localhost:3001](http://localhost:3001)

### Docker Commands

| Command | Description |
|---------|-------------|
| `docker-compose up --build` | Build and start production services |
| `docker-compose up -d` | Start services in detached mode |
| `docker-compose down` | Stop and remove containers |
| `docker-compose logs app` | View application logs |
| `docker-compose exec app sh` | Access container shell |
| `docker-compose --profile development up app-dev` | Start development environment |

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Key environment variables:

- `NEXT_PUBLIC_APP_URL`: Your application URL
- `NEXTAUTH_URL`: Authentication URL (if using NextAuth.js)
- `NEXTAUTH_SECRET`: Secret key for authentication
- `DATABASE_URL`: Database connection string (if using a database)

### Adding Database Support

To add database support, uncomment the database service in `docker-compose.yml`:

```yaml
db:
  image: postgres:15-alpine
  environment:
    - POSTGRES_DB=document_management
    - POSTGRES_USER=postgres
    - POSTGRES_PASSWORD=password
  ports:
    - "5432:5432"
  volumes:
    - postgres_data:/var/lib/postgresql/data
  restart: unless-stopped
```

### Production Considerations

1. **Environment Variables**: Ensure all production environment variables are set
2. **Security**: Update default passwords and secrets
3. **SSL/TLS**: Configure HTTPS in production
4. **Backup**: Set up regular database backups if using a database
5. **Monitoring**: Add logging and monitoring solutions
6. **Resource Limits**: Configure appropriate memory and CPU limits

### Build Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

### Docker Image Optimization

The production Dockerfile uses multi-stage builds for optimal image size:

1. **Dependencies stage**: Installs dependencies
2. **Builder stage**: Builds the application
3. **Runner stage**: Creates minimal production image

The image includes:
- Node.js 18 Alpine for small footprint
- Non-root user for security
- Standalone output for faster cold starts
- Proper file permissions and ownership

### Troubleshooting

**Container won't start:**
- Check if port 3000 is already in use
- Verify environment variables are correctly set
- Check Docker logs: `docker-compose logs app`

**Build fails:**
- Ensure Docker has enough memory allocated
- Clear Docker cache: `docker system prune`
- Check for syntax errors in Dockerfile

**Development hot-reload not working:**
- Ensure volumes are properly mounted
- Check file permissions on host system
- Restart the development container

## Project Structure

```
├── app/                  # Next.js app directory
├── components/           # React components
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── public/              # Static assets
├── styles/              # Global styles
├── Dockerfile           # Production Docker image
├── Dockerfile.dev       # Development Docker image
├── docker-compose.yml   # Docker Compose configuration
└── .dockerignore       # Docker ignore file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker: `docker-compose up --build`
5. Submit a pull request

## License

This project is licensed under the MIT License.