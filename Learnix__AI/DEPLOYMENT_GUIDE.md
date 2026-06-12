# Learnix AI - Deployment Guide

This guide covers how to deploy the Learnix AI application for your final year project demonstration and production use.

## 📋 Table of Contents

1. [Frontend Deployment](#frontend-deployment)
2. [Backend Deployment](#backend-deployment)
3. [Database Setup](#database-setup)
4. [Environment Variables](#environment-variables)
5. [Production Checklist](#production-checklist)

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended for React)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Build the project**
```bash
npm run build
```

3. **Deploy**
```bash
vercel
```

4. **Configure**
- Project name: learnix-ai
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

### Option 2: Netlify

1. **Build the project**
```bash
npm run build
```

2. **Deploy via Netlify CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages

1. **Install gh-pages**
```bash
npm install --save-dev gh-pages
```

2. **Add to package.json**
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

3. **Deploy**
```bash
npm run deploy
```

## 🚀 Backend Deployment (Spring Boot)

### Option 1: Heroku

1. **Create Procfile**
```
web: java -jar target/learnix-backend-1.0.0.jar
```

2. **Configure application.properties for Heroku**
```properties
spring.datasource.url=${JDBC_DATABASE_URL}
server.port=${PORT:8080}
```

3. **Deploy**
```bash
heroku create learnix-backend
heroku addons:create cleardb:ignite
git push heroku main
```

### Option 2: AWS Elastic Beanstalk

1. **Package the application**
```bash
mvn clean package
```

2. **Create Elastic Beanstalk application**
```bash
eb init -p java-17 learnix-backend
eb create learnix-env
eb deploy
```

### Option 3: Railway

1. **Connect GitHub repository**
2. **Configure build settings**
   - Build command: `mvn clean package`
   - Start command: `java -jar target/learnix-backend-1.0.0.jar`
3. **Add environment variables**
4. **Deploy automatically on push**

### Option 4: DigitalOcean

1. **Create Droplet**
```bash
# Install Java
sudo apt update
sudo apt install openjdk-17-jdk

# Install MySQL
sudo apt install mysql-server

# Upload JAR file
scp target/learnix-backend-1.0.0.jar user@your-server:/home/user/

# Run application
java -jar learnix-backend-1.0.0.jar
```

2. **Setup as service**
```bash
sudo nano /etc/systemd/system/learnix.service
```

```ini
[Unit]
Description=Learnix Backend
After=syslog.target

[Service]
User=ubuntu
ExecStart=/usr/bin/java -jar /home/ubuntu/learnix-backend-1.0.0.jar
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable learnix
sudo systemctl start learnix
```

## 💾 Database Setup

### Local MySQL

```bash
# Install MySQL
sudo apt install mysql-server

# Secure installation
sudo mysql_secure_installation

# Create database
mysql -u root -p
CREATE DATABASE learnix_ai;
CREATE USER 'learnix'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON learnix_ai.* TO 'learnix'@'localhost';
FLUSH PRIVILEGES;

# Import schema
mysql -u learnix -p learnix_ai < database-schema.sql
```

### Cloud Database Options

#### 1. AWS RDS
- Create MySQL instance
- Configure security group
- Update connection string in application.properties

#### 2. Google Cloud SQL
- Create MySQL instance
- Configure authorized networks
- Update connection details

#### 3. DigitalOcean Managed Database
- Create MySQL cluster
- Add trusted sources
- Update connection string

#### 4. PlanetScale (Free tier available)
- Create database
- Get connection string
- Works well with serverless deployments

## 🔐 Environment Variables

### Frontend (.env)

Create `.env` file in frontend root:

```env
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_APP_NAME=Learnix AI
```

### Backend (application.properties or environment variables)

```properties
# Database
SPRING_DATASOURCE_URL=jdbc:mysql://host:3306/learnix_ai
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRATION=86400000

# Groq API
GROQ_API_KEY=your-groq-api-key

# File Upload
FILE_UPLOAD_DIR=/var/uploads

# CORS
CORS_ALLOWED_ORIGINS=https://your-frontend-url.com
```

## ✅ Production Checklist

### Frontend

- [ ] Remove console.log statements
- [ ] Optimize images and assets
- [ ] Enable compression
- [ ] Set up CDN for static assets
- [ ] Configure proper meta tags for SEO
- [ ] Add analytics (Google Analytics, etc.)
- [ ] Test on multiple browsers and devices
- [ ] Implement error boundaries
- [ ] Add loading states
- [ ] Configure proper CORS

### Backend

- [ ] Change default passwords and secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure rate limiting
- [ ] Add request validation
- [ ] Implement proper error handling
- [ ] Set up logging (Log4j, etc.)
- [ ] Configure database connection pooling
- [ ] Add health check endpoint
- [ ] Implement backup strategy
- [ ] Set up monitoring (Prometheus, Grafana)
- [ ] Configure firewall rules
- [ ] Implement API versioning

### Database

- [ ] Enable automated backups
- [ ] Set up replication (if needed)
- [ ] Optimize indexes
- [ ] Configure connection limits
- [ ] Enable SSL connections
- [ ] Regular security updates
- [ ] Set up monitoring

### Security

- [ ] Enable HTTPS
- [ ] Implement JWT refresh tokens
- [ ] Add CSRF protection
- [ ] Sanitize user inputs
- [ ] Implement rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable CORS properly
- [ ] Add security headers
- [ ] Regular dependency updates
- [ ] Implement audit logging

## 🔧 Docker Deployment (Optional)

### Frontend Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile

```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/learnix-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/learnix_ai
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=rootpassword
    depends_on:
      - db
    
  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=learnix_ai
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## 📊 Monitoring & Analytics

### Frontend Analytics

```javascript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Backend Monitoring

Add Spring Boot Actuator:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

```properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check backend CORS configuration
   - Verify frontend API URL
   - Ensure headers are properly set

2. **Database Connection Failed**
   - Verify credentials
   - Check network access
   - Ensure database is running

3. **File Upload Errors**
   - Check file size limits
   - Verify upload directory permissions
   - Check disk space

4. **API Key Issues**
   - Verify Groq API key is valid
   - Check environment variables
   - Ensure key has proper permissions

## 📝 Post-Deployment

1. **Test all features**
   - User registration/login
   - File upload
   - AI features
   - Quiz functionality
   - Chatbot

2. **Monitor logs**
   - Check for errors
   - Monitor performance
   - Track usage

3. **Backup data**
   - Database backups
   - File storage backups
   - Configuration backups

4. **Update documentation**
   - API documentation
   - User guide
   - Admin guide

## 🎓 For Final Year Project Presentation

### Demo Preparation

1. **Prepare test data**
   - Sample user accounts
   - Pre-uploaded notes
   - Quiz results

2. **Create presentation materials**
   - Architecture diagram
   - Technology stack slide
   - Feature demonstrations
   - Future enhancements

3. **Backup plan**
   - Local deployment
   - Screenshots/videos
   - Offline demo capability

### Recommended Demo Flow

1. Show registration/login
2. Upload a document
3. Generate AI summary
4. Generate questions
5. Take a quiz
6. Use chatbot
7. Create study plan
8. Show dashboard statistics

---

Good luck with your deployment and final year project presentation! 🚀
