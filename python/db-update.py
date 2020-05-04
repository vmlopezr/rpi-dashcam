import sqlite3 as lite
import os
import sys
import argparse


def printData(dbData):
    col_names = ["id", "camera", "Device", "NodePort", "IPAddress",
                 "TCPStreamPort", "LiveStreamPort", "recordingState"]
    for index, value in enumerate(dbData[0]):
        print("{}: {}".format(col_names[index], value))


# Set up the argument parser
parser = argparse.ArgumentParser(add_help=False)
parser.add_argument('-h', '--help', action='help', help="""This script is used
    to update the rpidashcam sqlite database. Enter the argument with the
    desired value to update it.""")
parser.add_argument('-cam', '--camera', type=str,
                    help='The webcam model to be used with the application')
parser.add_argument('-dev', '--Device', type=str,
                    help="""The linux device denoting the USB camera.
                    Can be found in /dev/. For webcam this is usually listed
                    as /dev/video*""")
parser.add_argument('-nport', '--NodePort', type=int,
                    help="""The port at which the back-end server will
                    listen to.""")
parser.add_argument('-ipaddr', '--IPAddress', type=str,
                    help="""The IP Address of the host running
                    the application.""")
parser.add_argument('-streamport', '--TCPStreamPort', type=int,
                    help="""The Port at which node listen to the TCP
                    video feed from gstreamer.""")
parser.add_argument('-LiveStreamPort', '--LiveStreamPort', type=int,
                    help="""The Port at which socket.io listens to stream live
                    camera feed to a webrowser.""")
parser.add_argument('-view', '--view', action='store_true',
                    help=""""View the current values of the application
                    settings""")
args = parser.parse_args()

# Create the sqlite command to run for updates
SQlite_command = 'UPDATE app_settings SET '

# Add arguments to sqlite command
if args.camera:
    SQlite_command += "camera = '{}', ".format(args.camera)
if args.Device:
    SQlite_command += "Device = '{}', ".format(args.Device)
if args.IPAddress:
    SQlite_command += "IPAddress = '{}', ".format(args.IPAddress)
if args.TCPStreamPort:
    SQlite_command += "TCPStreamPort = {}, ".format(args.TCPStreamPort)
if args.LiveStreamPort:
    SQlite_command += "LiveStreamPort = {}, ".format(args.LiveStreamPort)

SQlite_command = SQlite_command[:-2] + ' WHERE id = 1'

# Get sqlite3 db absolute path
script_path = os.path.dirname(os.path.abspath(__file__))
char = "/"
split_path = script_path.split(char)
split_path.pop()
split_path.extend(["data", "camData.sql"])
db_Path = char.join(split_path)

# Start sqlite db connection
connection = lite.connect(db_Path)
cursor = connection.cursor()

# Display the app_settings table contents
if args.view:
    cursor.execute("SELECT * FROM app_settings")
    data = cursor.fetchall()
    print("Printing the current application settings: ")
    printData(data)
else:
    # Update columns based on the arguments entered
    cursor.execute(SQlite_command)
    cursor.execute("SELECT * FROM app_settings")
    data = cursor.fetchall()
    print("""The application IP address has been updated.
        The new settings in the db are: """)
    printData(data)

connection.commit()
connection.close()
