# Use Node.js base image
FROM node:18

# Install required packages for compiling C++, Python, and Java
RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    python3 \
    python3-pip \
    openjdk-17-jdk \
    && apt-get clean

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install node dependencies
RUN npm install

# Copy entire project
COPY . .

# Create temp directory (needed for compilex or temp file operations)
RUN mkdir -p /app/temp

# Set environment variables for Java
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="$JAVA_HOME/bin:$PATH"

# Expose your backend port (adjust if yours is different)
EXPOSE 5000

# Start the backend
CMD ["node", "server.js"]
