# Use Node.js LTS base image
FROM node:18

# Install required system compilers (g++, python3, openjdk)
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    openjdk-17-jdk \
    && apt-get clean

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy all backend files
COPY . .

# Create the temp folder for Java code fixes (optional but safe)
RUN mkdir -p /app/temp

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
