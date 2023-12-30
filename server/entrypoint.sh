#!/bin/bash

# Maximum number of retries
max_retries=20

# Time to wait between retries in seconds
wait_time=5

# Counter for current attempt
attempt=1

while [ $attempt -le $max_retries ]; do
    echo "Attempt $attempt of $max_retries"

    # Send a request to the specified URL and get the HTTP status code
    status_code=$(curl -o /dev/null -s -w "%{http_code}" http://chroma:8000)

    # Check if the status code is 404
    if [ "$status_code" -eq 404 ]; then
        echo "Chroma server is running, Generating embeddings for chroma"

        python3 save_embeddings.py

        echo "Embeddings saved"

        echo "Starting waitress server"

        gunicorn -w 4 -b 0.0.0.0:5000 'main:app'

        exit 0
    fi

    # Increment the attempt counter
    attempt=$((attempt + 1))

    # Wait for the specified time before retrying
    sleep $wait_time
done

echo "Chroma server didn't start after $max_retries attempts, exiting."
exit 1