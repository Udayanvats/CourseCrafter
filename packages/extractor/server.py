from flask import Flask, request, jsonify
import os
import pika
# from app import upload_file_to_s3
import uuid
import boto3

app = Flask(__name__)

# RabbitMQ connection parameters
RABBITMQ_HOST = 'localhost'
RABBITMQ_PORT = 5672
RABBITMQ_USERNAME = 'guest'
RABBITMQ_PASSWORD = 'guest'
# coursecrafter
AWS_SERVER_PUBLIC_KEY = os.environ.get('AWS_ACCESS_KEY')
AWS_SERVER_SECRET_KEY = os.environ.get('AWS_SECRET_KEY')
bucket_name = 'coursecrafter'
s3 = boto3.client('s3',
        aws_access_key_id=AWS_SERVER_PUBLIC_KEY, 
        aws_secret_access_key=AWS_SERVER_SECRET_KEY, 
        region_name="ap-south-1"
        )


def upload_file_to_s3(filename,file_path):
   
    s3.upload_file(filename, bucket_name, file_path)
    

# Function to establish RabbitMQ connection and push message into queue
def send_to_queue(filepath):
    credentials = pika.PlainCredentials(RABBITMQ_USERNAME, RABBITMQ_PASSWORD)
    parameters = pika.ConnectionParameters(host=RABBITMQ_HOST, port=RABBITMQ_PORT, credentials=credentials)
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()
    channel.queue_declare(queue='extract')
    channel.basic_publish(exchange='', routing_key='extract', body=filepath)
    connection.close()

# Route to handle file uploads
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        # Save file to directory
        upload_dir = 'uploads'
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
        
        filename = os.path.join(upload_dir, file.filename)
        file.save(filename)

        s3_file_name = str(uuid.uuid4())
        s3_file_extension = file.filename.split('.')[-1]
        s3_file_name = f'{s3_file_name}.{s3_file_extension}'
        print(s3_file_name)
        s3_file_path= "files/"+s3_file_name
        upload_file_to_s3(filename,s3_file_path)
        
       
        send_to_queue(s3_file_path)

        os.remove(filename)

        return jsonify({'message': 'File uploaded successfully', 'file_path': filename}), 200

if __name__ == '__main__':
    app.run(debug=True)
