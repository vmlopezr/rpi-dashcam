#!/usr/bin/python3
# This program is licensed under GPLv3.
# Note the video encoding for the file can be found using: gst-typefind-1.0
from datetime import datetime
import socket
import sys
import gi
import signal
import os
import time
import shutil
from subprocess import PIPE, Popen

gi.require_version('Gst', '1.0')  # nopep8
from gi.repository import Gst, GLib

Gst.init(None)
if os.path.isfile("/proc/device-tree/model"):
    # Verify if the python program is running on an RPI or on an PC
    stream = Popen("cat /proc/device-tree/model", shell=True, stdout=PIPE, stderr=PIPE)
    stdout, stderr = stream.communicate()
    if len(stderr) == 0:
        ON_RPI = True
        DEV_ENV = False
        RPI_MODEL = stdout.decode('utf-8')
        if "Pi 4" in RPI_MODEL:
            RPI4 = True
        else: 
            RPI4 = False
    else:
        DEV_ENV = True
        ON_RPI = False  
        RPI4 = False  
else:
    DEV_ENV = True
    RPI4 = False
    ON_RPI = False


if RPI4 or DEV_ENV:
    # Program running on Unix PC or on RPI4. 
    Caps = 'image/jpeg,width=1280,height=720,framerate=15/1 '
else:
    # Program is running on RPI3 and lower. Decrease resolution and frame rate
    # due to ram limitation.
    Caps = 'image/jpeg,width=320,height=240,framerate=20/1 '

IP_Address = sys.argv[1]
PORT = int(sys.argv[2])
CAMERA = sys.argv[3]
DEVICE = sys.argv[4]
VIDEO_LENGTH = int(sys.argv[5])
VERTICAL_FLIP = int(sys.argv[6])
dirList = os.getcwd().split('/')

if dirList[len(dirList) - 1] == 'src':
    RAN_BY_NODE = False
else:
    RAN_BY_NODE = True


class WebcamRecord():
    def __init__(self):
        self.server_running = False
        self.started = False
        self.counter = 0
        self.prev_filename = ""
        self.new_filename = ""
        self.timeout_length = VIDEO_LENGTH
        self.timeoutid = None
        self.previous_filepath = ""

        # # register socket for main loop
        self.create_socket()
        GLib.io_add_watch(self.socket, GLib.IO_IN, self.socket_listener)

        # Example shell command for signaling PID
        # kill -s USR1 PID
        GLib.unix_signal_add(1, signal.SIGINT.value, self.exit_application)

        # Create pipeline components
        self.create_video_capture_bin()
        self.create_main_pipeline()
        self.create_tcp_server_pipeline()
        self.create_image_capture_pipeline()

        # Create bus to get events from GStreamer pipeline
        self.bus = self.pipeline.get_bus()
        self.bus.add_signal_watch()
        self.bus.connect("message::eos", self.on_eos)
        self.bus.connect("message::error", self.on_error)
        self.bus.unref()
        self.loop = GLib.MainLoop()

    def run(self):
        self.pipeline.set_state(Gst.State.PLAYING)
        self.add_jpegpipe()
        self.begin_recording()
        self.loop.run()

    def add_jpegpipe(self):
        self.jpegpipe.set_state(Gst.State.PLAYING)
        self.pipeline.add(self.jpegpipe)
        if not self.main_tee.link(self.jpegpipe):
            print("Could not link main tee to the jpegpipe")
            sys.stdout.flush()
            sys.exit(1)

    def create_main_pipeline(self):
        # Create GStreamer pipeline and elements
        self.pipeline = Gst.Pipeline.new("Main_Pipeline")
        self.vidsrc = Gst.ElementFactory.make("v4l2src", "vidsrc")
        self.caps_filter = Gst.ElementFactory.make("capsfilter", "caps_filter")
        self.caps = Gst.Caps.from_string(Caps)
        self.jpegdec = Gst.ElementFactory.make("jpegdec", "jpegdec")
        self.videoconvert = Gst.ElementFactory.make(
            "videoconvert", "videoconvert")
        self.videoflip = Gst.ElementFactory.make("videoflip", "videoflip")
        self.timeoverlay = Gst.ElementFactory.make(
            "timeoverlay", "timeoverlay")
        self.clockoverlay = Gst.ElementFactory.make(
            "clockoverlay", "clockoverlay")
        self.main_tee = Gst.ElementFactory.make("tee", "tee")
        self.queue = Gst.ElementFactory.make("queue", "queue")
        self.sink = Gst.ElementFactory.make("xvimagesink", "xvimagesink")
        self.jpegpipe = Gst.parse_bin_from_description(
            "queue name=jpegqueue ! jpegenc ! tee name=jpegtee", True)
        self.jpegtee = self.jpegpipe.get_by_name("jpegtee")

        # Set element properties
        self.vidsrc.set_property("device", DEVICE)
        self.caps_filter.set_property("caps", self.caps)
        self.videoflip.set_property("method", 2 if VERTICAL_FLIP else 0)
        self.timeoverlay.set_property("halignment", "right")
        self.timeoverlay.set_property("valignment", "bottom")
        self.clockoverlay.set_property("halignment", "left")
        self.clockoverlay.set_property("valignment", "bottom")
        self.clockoverlay.set_property("time-format", "%m/%d/%Y %I:%M:%S %p")

        self.pipeline.add(self.vidsrc)
        self.pipeline.add(self.caps_filter)
        self.pipeline.add(self.jpegdec)
        self.pipeline.add(self.videoconvert)
        self.pipeline.add(self.videoflip)
        self.pipeline.add(self.timeoverlay)
        self.pipeline.add(self.clockoverlay)
        self.pipeline.add(self.main_tee)

        # added for standalone testing
        # self.pipeline.add(self.queue)
        # self.pipeline.add(self.sink)

        # Link the elements in the pipeline
        if not self.vidsrc.link(self.caps_filter):
            print("Could not link video source to capsfilter")
            sys.stdout.flush()
            sys.exit(1)
        if not self.caps_filter.link(self.jpegdec):
            print("Could not link capsfilter to jpegdec")
            sys.stdout.flush()
            sys.exit(1)
        if not self.jpegdec.link(self.videoconvert):
            print("Could not link jpegdec to videoconvert")
            sys.stdout.flush()
            sys.exit(1)
        if not self.videoconvert.link(self.videoflip):
            print("Could not link videoconvert to videoflip")
            sys.stdout.flush()
            sys.exit(1)
        if not self.videoflip.link(self.timeoverlay):
            print("Could not link videoflip to timeoverlay")
            sys.stdout.flush()
            sys.exit(1)
        if not self.timeoverlay.link(self.clockoverlay):
            print("Could not link timeoverlay to clockoverlay")
            sys.stdout.flush()
            sys.exit(1)
        if not self.clockoverlay.link(self.main_tee):
            print("Could not link clockoverlay to tee")
            sys.stdout.flush()
            sys.exit(1)
        # added for testing
        # self.main_tee.link(self.queue)
        # self.queue.link(self.sink)

    def create_image_capture_pipeline(self):
        # self.capture_pipe = Gst.parse_bin_from_description(
        #     "queue name=capture_queue ! multifilesink name=jpegcapture " +
        #     "location=test.jpg", True)
        self.capture_pipe = Gst.parse_bin_from_description(
            "queue name=capture_queue ! filesink name=jpegcapture " +
            "location=initial.jpg", True)

        # Create objects
        self.capture_queue = self.capture_pipe.get_by_name("capture_queue")
        self.capture_sink = self.capture_pipe.get_by_name("jpegcapture")

    # CLI pipeline overview
    def create_tcp_server_pipeline(self):
        # Create recording bin
        self.server_pipe = Gst.parse_bin_from_description(
            "queue name=server_queue ! multipartmux boundary=" +
            "\"--videoboundary\" ! tcpserversink " +
            "host={} port={}".format(IP_Address, PORT), True)
        self.server_pipe.set_property("message_forward", "true")
        self.server_pipe.set_property("name", "server")

        # Create objects
        self.server_queue = self.server_pipe.get_by_name("server_queue")

    def create_video_capture_bin(self):

        # Running on RaspberryPi
        if ON_RPI:
            self.main_recordpipe = Gst.parse_bin_from_description(
                "queue name=filequeue ! deinterlace " +
                "! v4l2h264enc name=encoder " +
                "! h264parse config-interval=-1 !" +
                "mp4mux ! filesink name=filesink", True)

            self.temp_recordpipe = Gst.parse_bin_from_description(
                "queue name=filequeue ! deinterlace " +
                "! v4l2h264enc name=encoder " +
                "! h264parse config-interval=-1 !" +
                "mp4mux ! filesink name=filesink", True)
        # Running on PC
        else:
            self.main_recordpipe = Gst.parse_bin_from_description(
                "queue name=filequeue ! deinterlace " +
                "! x264enc tune=zerolatency bitrate=8000 name=encoder " +
                "! h264parse config-interval=-1 !" +
                "mp4mux ! filesink name=filesink", True)
            self.temp_recordpipe = Gst.parse_bin_from_description(
                "queue name=filequeue ! deinterlace " +
                "! x264enc tune=zerolatency bitrate=8000 name=encoder " +
                "! h264parse config-interval=-1 !" +
                "mp4mux ! filesink name=filesink", True)

        self.main_recordpipe.set_property("message_forward", "true")
        self.main_recordpipe.set_property("name", "recordbin1")

        self.temp_recordpipe.set_property("message_forward", "true")
        self.temp_recordpipe.set_property("name", "recordbin2")

    def create_socket(self):
        try:
            # Socket setup, allow only one connection
            self.socket = socket.socket()
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            self.socket.bind((IP_Address, 10000))
            self.socket.listen(1)
        except socket.error as serr:
            print(serr, file=sys.stderr)
            sys.stderr.flush()

        print("SocketCreated")
        sys.stdout.flush()

    def socket_listener(self, sock, *args):
        # Asynchronous connection listener. Set up handler for the connection.
        conn, addr = sock.accept()
        GLib.io_add_watch(conn, GLib.IO_IN, self.socket_handler)
        return True

    def socket_handler(self, connection, *args):
        # Asynchronous connection handler. Processes each line from the socket.
        line = connection.recv(4096)
        request = line.decode("utf-8").split()
        if len(request) == 1:
            if request[0] == "start":
                self.start_livestream_server()
                return True
            elif request[0] == "stop":
                self.stop_livestream_server()
                return True
            elif request[0] == "exit":
                self.exit_application()
                return False
            else:
                return True
        elif len(request) == 2:
            if request[0] == "newtime":
                self.timeout_length = int(request[1])
                return True
            elif request[0] == "flip":
                self.toggle_view(int(request[1]))
                return True
            else:
                return True

    def format_file_location(self):
        timestamp = datetime.now().strftime("%B_%d_%Y-%I.%M.%S.%p")
        return timestamp

    def move_files(self, videopath):
        try:
            if RAN_BY_NODE:
                shutil.move(videopath, "./data/Recordings/")  # for RPI
            else:
                shutil.move(videopath, "../data/Recordings/")  # for computer
        except Exception as e:
            print("file move error: {}".format(e))
            sys.stdout.flush()

    def move_lastfile(self):
        try:
            if RAN_BY_NODE:
                shutil.move(self.previous_filepath,
                            "./data/Recordings/")  # for RPI
            else:
                shutil.move(self.previous_filepath,
                            "../data/Recordings/")  # for computer
        except Exception as e:
            print("file move error: {}".format(e))
            sys.stdout.flush()

    def pause_pipes(self):
        self.pipeline.set_state(Gst.State.PAUSED)
        self.jpegpipe.set_state(Gst.State.PAUSED)
        self.server_pipe.set_state(Gst.State.PAUSED)

    def restart_pipes(self):
        self.pipeline.set_state(Gst.State.PLAYING)
        self.jpegpipe.set_state(Gst.State.PLAYING)
        self.server_pipe.set_state(Gst.State.PLAYING)

    def toggle_view(self, vertical_flip):
        # self.pause_pipes()
        if vertical_flip:
            self.videoflip.set_property("method", 2)

        else:
            self.videoflip.set_property("method", 0)
        # self.restart_pipes()

    def start_livestream_server(self):
        if not self.server_running:
            try:
                # Link to main pipeline
                self.jpegpipe.add(self.server_pipe)
                if not self.jpegtee.link(self.server_pipe):
                    print("could not link tcp pipe to pipeline")
                    sys.stdout.flush()

                # print("Webcam TCP Stream Started")
                self.server_running = True

                # Start Recording pipeline
                self.server_pipe.set_state(Gst.State.PLAYING)
            except Exception as e:
                print(e, file=sys.stderr)
                sys.stderr.flush()
                return

            print("ServerStarted")
            sys.stdout.flush()

    def begin_recording(self):
        self.counter = self.counter + 1
        timestamp = self.format_file_location()

        self.start_recording_bin(timestamp)
        self.capture_thumbnail(timestamp)

        if self.counter > 1:
            self.finalize_video(timestamp)
            self.move_files(self.previous_filepath)

        if RAN_BY_NODE:
            # Path to use when executed by node
            self.previous_filepath = "./data/In_Progress/" + timestamp + ".mp4"
        else:
            self.previous_filepath = "../data/In_Progress/" + \
                timestamp + ".mp4"  # for computer

        self.switch_recordingpipe()

        return False

    def start_recording_bin(self, timestamp):
        if RAN_BY_NODE:
            # File path when executed by node
            videopath = "./data/In_Progress/" + timestamp + ".mp4"
        else:
            # file path when executed by user
            videopath = "../data/In_Progress/"+timestamp + ".mp4"

        # Start change file name
        self.main_recordpipe.get_by_name("filesink").set_property(
            "location", videopath)
        # Start Recording pipeline
        self.main_recordpipe.set_state(Gst.State.PLAYING)
        self.pipeline.add(self.main_recordpipe)
        if not self.main_tee.link(self.main_recordpipe):
            print("cannot link the recording pipe to main pipe")
            sys.stdout.flush()

        GLib.timeout_add_seconds(self.timeout_length, self.begin_recording)

    def capture_thumbnail(self, timestamp):
        if RAN_BY_NODE:
            path = "./data/Thumbnail/" + timestamp + ".jpg"  # for RPI
        else:
            path = "../data/Thumbnail/" + timestamp + ".jpg"  # for computer

        # Set Screenshot path
        self.capture_sink.set_property("location", path)
        # Start the image capture
        self.capture_pipe.set_state(Gst.State.PLAYING)

        # Add capture pipe to main pipeline
        self.jpegpipe.add(self.capture_pipe)
        if not self.jpegtee.link(self.capture_pipe):
            print("could not link capture pipe to pipeline")
            sys.stdout.flush()

        # Start asynchronous timeout to allow for image generation
        self.timeoutid = GLib.timeout_add(1000, self.save_thumbnail)

    def save_thumbnail(self):
        # Block the capture pipe
        self.captureprobe = self.capture_queue.get_static_pad("src").add_probe(
            Gst.PadProbeType.BLOCK_DOWNSTREAM, self.probe_block)
        self.capture_pipe.send_event(Gst.Event.new_eos())

        # Remove from main pipeline
        self.jpegtee.unlink(self.capture_pipe)
        # self.pipeline.remove(self.capture_pipe)
        self.jpegpipe.remove(self.capture_pipe)

        # Reset the capture pipe
        self.capture_pipe.set_state(Gst.State.NULL)
        self.capture_queue.get_static_pad(
            "src").remove_probe(self.captureprobe)
        return False

    def finalize_video(self, filename):
        self.prev_filename = filename + ".mp4"
        self.temp_recordpipe.get_by_name(
            "encoder").send_event(Gst.Event.new_eos())
        self.temp_recordpipe.set_state(Gst.State.NULL)

        self.main_tee.unlink(self.temp_recordpipe)
        self.temp_recordpipe.ref()
        self.pipeline.remove(self.temp_recordpipe)

    def switch_recordingpipe(self):
        temp = self.main_recordpipe
        self.main_recordpipe = self.temp_recordpipe
        self.temp_recordpipe = temp

        # Create objects
        self.filequeue = self.temp_recordpipe.get_by_name("filequeue")
        self.encoder = self.temp_recordpipe.get_by_name("encoder")

    def finalize_lastvideo(self):
        self.main_recordpipe.get_by_name(
            "encoder").send_event(Gst.Event.new_eos())
        self.main_recordpipe.set_state(Gst.State.NULL)

        self.main_tee.unlink(self.main_recordpipe)
        self.main_recordpipe.ref()
        self.pipeline.remove(self.main_recordpipe)

    def timeout(self):
        self.save_thumbnail()
        return False

    def stop_livestream_server(self):
        if self.server_running:
            self.server_running = False

            # Block the recording stream and send EOS
            self.probe = self.server_queue.get_static_pad("src").add_probe(
                Gst.PadProbeType.BLOCK_DOWNSTREAM, self.probe_block)

            # disconnect tcp server pipe from jpeg pipe
            self.jpegtee.unlink(self.server_pipe)
            self.jpegpipe.remove(self.server_pipe)

            # reset the state of the server pipe for requests to stream
            self.server_pipe.set_state(Gst.State.NULL)
            self.server_queue.get_static_pad("src").remove_probe(self.probe)

    def exit_application(self):
        self.stop_livestream_server()
        self.pipeline.send_event(Gst.Event.new_eos())

        # add delay to let eos propagate
        time.sleep(1)
        self.move_lastfile()
        # self.socket.close()
        self.pipeline.set_state(Gst.State.NULL)
        self.socket.close()
        self.loop.quit()

    def on_eos(self, bus, msg):
        print('on_eos(): End of Stream Received')
        sys.stdout.flush()
        self.pipeline.seek_simple(
            Gst.Format.TIME,
            Gst.SeekFlags.FLUSH | Gst.SeekFlags.KEY_UNIT,
            0
        )

    def on_error(self, bus, msg):
        print('on_error():', msg.parse_error(),file=sys.stderr)
        sys.stderr.flush()

    def probe_block(self, pad, buf):
        return True


app = WebcamRecord()
app.run()
