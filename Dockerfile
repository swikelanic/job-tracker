# Use official lightweight Node.js image
FROM node:16-alpine

# Set working directory inside container
WORKDIR /app

# Install json-server globally
RUN npm install -g json-server

# Copy all your project files into the container
COPY . .

# Expose port 10000 (the port json-server will listen on)
EXPOSE 10000

# Command to run JSON Server, watching db.json on port 10000
CMD ["json-server", "--watch", "db.json", "--port", "10000"]
