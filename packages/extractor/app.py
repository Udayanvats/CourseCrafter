import pika
from pptx import Presentation      
import boto3
import os
import uuid
from dotenv import load_dotenv,dotenv_values
import tempfile 
import json

load_dotenv()


AWS_SERVER_PUBLIC_KEY = os.getenv('AWS_ACCESS_KEY')
AWS_SERVER_SECRET_KEY = os.getenv('AWS_SECRET_KEY')
print(AWS_SERVER_PUBLIC_KEY)
print(AWS_SERVER_SECRET_KEY)

print(AWS_SERVER_PUBLIC_KEY, AWS_SERVER_SECRET_KEY)

s3 = boto3.client('s3',
        aws_access_key_id=AWS_SERVER_PUBLIC_KEY, 
        aws_secret_access_key=AWS_SERVER_SECRET_KEY, 
        region_name="ap-south-1"
        )

RABBITMQ_HOST = 'localhost'
RABBITMQ_PORT = 5672
RABBITMQ_USERNAME = 'guest'
RABBITMQ_PASSWORD = 'guest'
bucket_name = 'coursecrafter'

credentials = pika.PlainCredentials(RABBITMQ_USERNAME, RABBITMQ_PASSWORD)
parameters = pika.ConnectionParameters(host=RABBITMQ_HOST, port=RABBITMQ_PORT, credentials=credentials)

connection = pika.BlockingConnection(parameters)
channel = connection.channel()

channel.queue_declare(queue='extract')
channel.queue_declare(queue='notification',durable=True)

def notify_user(body):
    print("Notifying user")

    channel.basic_publish(exchange='', routing_key='notification', body=body)

def upload_file_to_s3(file,object_name):
   
    s3.upload_fileobj(file,bucket_name,object_name)

def get_file_from_s3(filepath):
    try:
     
        print("Downloading ", filepath)
        filename = filepath.split("/")[-1]
        
        directory = "uploads/"
        
        if not os.path.exists(directory):
            os.makedirs(directory)
        
        full_path = os.path.join(directory, filename)

        print(f"filepath  {filepath}")
        
        with open(full_path, "wb") as f:
            s3.download_fileobj(bucket_name, filepath, f)

        print(f"File downloaded to {full_path}")

        return full_path
    except Exception as e:
        print(f"Error downloading file from S3: {e}")
        return None



def extract_text(ch, method, properties, body):
    try:
        s3ObjPath=body.decode('utf-8')
        print(f"file path: {s3ObjPath}")
        filepath = get_file_from_s3(s3ObjPath)
        print(f"file path: {filepath}")
        fileid = s3ObjPath.split("/")[-1].split(".")[0]
        
        ppt = Presentation(filepath) 
        text = []
        for slide in ppt.slides:
            for shape in slide.shapes:
                if hasattr(shape, "text"):
                    text.append(shape.text)

        print(text)
        with tempfile.NamedTemporaryFile(mode='w', delete=True) as temp_file:
            temp_file.write(str(text))
            temp_file.flush()  # Flush the buffer to ensure data is written to the file

            s3.upload_file(temp_file.name, bucket_name,"text/"+fileid+".txt")
            notify_user(json.dumps({
                "status":True,
                "object_path":"text/"+fileid+".txt",
                "error":""
            }))

        




        


            # Print confirmation message
            print("File uploaded to S3 successfully")
    except Exception as e:
        notify_user(json.dumps({
            status:False,
            object_path:"",
            error:"Error extracting text: "+str(e)
        }))
        print(f"Error extracting text: {e}")
    




    


   

channel.basic_consume(queue='extract', on_message_callback=extract_text, auto_ack=True)

print('Waiting for messages')

if __name__ == '__main__':
    channel.start_consuming()
    



