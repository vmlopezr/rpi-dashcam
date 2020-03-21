#!/usr/bin/python3
# This program is licensed under GPLv3.
# Note the video encoding for the file can be found using: gst-typefind-1.0
from datetime import datetime
import socket
import sys
import gi
import signal
from os import path
import time
import shutil

gi.require_version('Gst', '1.0')  # nopep8
from gi.repository import Gst, GLib

try:
    import RPi.GPIO as gpio
    DEV_ENV = False
except (ImportError, RuntimeError):
    DEV_ENV = True

Gst.init(None)

if DEV_ENV:
    location = '/dev/video2'  # For Dev Computer
else:
    location = '/dev/video0'  # For RPI
# Caps = 'image/jpeg,width=800,height=600,framerate=20/1 '
Caps = 'image/jpeg,width=1280,height=720,framerate=15/1 '
IP_Address = sys.argv[1]
PORT = int(sys.argv[2])
CAMERA = sys.argv[3]
DEVICE = sys.argv[4]
videoLength = int(sys.argv[5])


class WebcamRecord():
    def __init__(self):
        self.server_running = False
        self.started = False
        self.counter = 0
        self.prev_filename = ""
        self.new_filename = ""
        self.timeout_length = 300
        self.timeoutid = None
        self.previous_filepath = ""
        self.toggle = False

        # # register socket for main loop
        self.Create_Socket()
        GLib.io_add_watch(self.socket, GLib.IO_IN, self.listener)

        # Example shell command for signaling PID
        # kill -s USR1 PID
        GLib.unix_signal_add(1, signal.SIGINT.value, self.quit)

        # GLib.io_add_watch(sys.stdin, GLib.IO_IN, self.on_stdin)
        self.Create_Record_Bin()
        self.Create_Main_Pipeline()
        self.Create_TCP_Server_Pipeline()
        self.Create_ImageCapture_Pipeline()

        # Create bus to get events from GStreamer pipeline
        self.bus = self.pipeline.get_bus()
        self.bus.add_signal_watch()
        self.bus.connect("message::eos", self.on_eos)
        self.bus.connect("message::error", self.on_error)
        self.bus.unref()
        self.loop = GLib.MainLoop()

    def Create_Socket(self):
        # Socket setup
        self.socket = socket.socket()
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.socket.bind((IP_Address, 10000))
        self.socket.listen(1)

    def Create_ImageCapture_Pipeline(self):
        self.capture_pipe = Gst.parse_bin_from_description(
            "queue name=capture_queue ! multifilesink name=jpegcapture " +
            "location=test.jpg", True)

        # Create objects
        self.capture_queue = self.capture_pipe.get_by_name("capture_queue")
        self.capture_sink = self.capture_pipe.get_by_name("jpegcapture")

    # CLI pipeline overview
    def Create_TCP_Server_Pipeline(self):
        # Create recording bin
        self.server_pipe = Gst.parse_bin_from_description(
            "queue name=server_queue ! multipartmux boundary=" +
            "\"--videoboundary\" ! tcpserversink " +
            "host={} port={}".format(IP_Address, PORT), True)
        self.server_pipe.set_property("message_forward", "true")
        self.server_pipe.set_property("name", "server")

        # Create objects
        self.server_queue = self.server_pipe.get_by_name("server_queue")

    def Create_Record_Bin(self):
        if DEV_ENV:
            self.main_recordpipe = Gst.parse_bin_from_description(
                "queue name=filequeue ! deinterlace " +
                "! x264enc tune=zerolatency bitrate=8000 name=encoder " +
                "! h264parse config-interval=-1 !" +
                "mp4mux ! filesink name=filesink", True)
            # For Dev Computer
            self.temp_recordpipe = Gst.parse_bin_from_description(
                "queue name=filequeue ! deinterlace " +
                "! x264enc tune=zerolatency bitrate=8000 name=encoder " +
                "! h264parse config-interval=-1 !" +
                "mp4mux ! filesink name=filesink", True)

        # Running on RaspberryPi
        else:
            self.main_recordpipe = Gst.parse_bin_from_description(
                "queue name=filequeue ! deinterlace " +
                "! v4l2h264enc tune=zerolatency name=encoder " +
                "! h264parse config-interval=-1 !" +
                "mp4mux ! filesink name=filesink", True)

            self.temp_recordpipe = Gst.parse_bin_from_description(
                "queue name=filequeue ! deinterlace " +
                "! v4l2h264enc tune=zerolatency name=encoder " +
                "! h264parse config-interval=-1 !" +
                "mp4mux ! filesink name=filesink", True)

        self.main_recordpipe.set_property("message_forward", "true")
        self.main_recordpipe.set_property("name", "recordbin1")

        self.temp_recordpipe.set_property("message_forward", "true")
        self.temp_recordpipe.set_property("name", "recordbin2")

    def Create_Main_Pipeline(self):
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
        self.vidsrc.set_property("device", location)
        self.caps_filter.set_property("caps", self.caps)
        self.videoflip.set_property("method", 0)
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

        # Link the elements in the pipeline
        if not self.vidsrc.link(self.caps_filter):
            print("Could not link video source to capsfilter")
            sys.exit(1)
        if not self.caps_filter.link(self.jpegdec):
            print("Could not link capsfilter to jpegdec")
            sys.exit(1)
        if not self.jpegdec.link(self.videoconvert):
            print("Could not link jpegdec to videoconvert")
            sys.exit(1)
        if not self.videoconvert.link(self.videoflip):
            print("Could not link videoconvert to videoflip")
            sys.exit(1)
        if not self.videoflip.link(self.timeoverlay):
            print("Could not link videoflip to timeoverlay")
            sys.exit(1)
        if not self.timeoverlay.link(self.clockoverlay):
            print("Could not link timeoverlay to clockoverlay")
            sys.exit(1)
        if not self.clockoverlay.link(self.main_tee):
            print("Could not link clockoverlay to tee")
            sys.exit(1)

    def listener(self, sock, *args):
        # Asynchronous connection listener.Starts a handler for the connection.
        conn, addr = sock.accept()
        GLib.io_add_watch(conn, GLib.IO_IN, self.handler)
        return True

    def format_location(self):
        timestamp = datetime.now().strftime("%B_%d_%Y-%I.%M.%S.%p")
        return timestamp

    def move_files(self, videopath):
        try:
            shutil.move(videopath, "./data/Recordings/")  # for RPI
            # shutil.move(videopath, "../data/Recordings/")  # for computer
        except Exception as e:
            print("file move error: {}".format(e))

    def move_lastfile(self):
        try:
            shutil.move(self.previous_filepath,
                        "./data/Recordings/")  # for RPI
            # shutil.move(self.previous_filepath,
            #             "../data/Recordings/")  # for computer
        except Exception as e:
            print("file move error: {}".format(e))

    def handler(self, connection, *args):
        # Asynchronous connection handler. Processes each line from the socket.
        line = connection.recv(4096)
        request = line.decode("utf-8").split()
        if len(request) == 1:
            if request[0] == "start":
                self.start_server()
                return True
            elif request[0] == "stop":
                self.stop_server()
                return True
            elif request[0] == "exit":
                self.quit()
                return False
            elif request[0] == "flip":
                self.toggle_view()
                return True
            else:
                connection.sendall(request[0])
                return True
        elif len(request) == 2:
            if request[0] == "newtime":
                self.timeout_length = int(request[1])
                return True
            return True

    def run(self):
        self.pipeline.set_state(Gst.State.PLAYING)
        self.add_jpegpipe()
        self.record_video()
        self.loop.run()

    def add_jpegpipe(self):
        self.jpegpipe.set_state(Gst.State.PLAYING)
        self.pipeline.add(self.jpegpipe)
        if not self.main_tee.link(self.jpegpipe):
            print("Could not link main tee to the jpegpipe")
            sys.exit(1)

    def capture_Thumbnail(self, timestamp):
        path = "./data/Thumbnail/" + timestamp + ".jpg"  # for RPI
        # path = "../data/Thumbnail/" + timestamp + ".jpg"  # for computer

        # Set Screenshot path
        self.capture_sink.set_property("location", path)
        # Start the image capture
        self.capture_pipe.set_state(Gst.State.PLAYING)

        # Add capture pipe to main pipeline
        self.jpegpipe.add(self.capture_pipe)
        if not self.jpegtee.link(self.capture_pipe):
            print("could not link capture pipe to pipeline")

        # Start asynchronous timeout to allow for image generation
        self.timeoutid = GLib.timeout_add(500, self.save_Thumbnail)

    def save_Thumbnail(self):
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

    def pause_pipes(self):
        self.pipeline.set_state(Gst.State.PAUSED)
        self.jpegpipe.set_state(Gst.State.PAUSED)
        # self.main_recordpipe.set_state(Gst.State.PAUSED)
        self.server_pipe.set_state(Gst.State.PAUSED)

    def restart_pipes(self):
        self.pipeline.set_state(Gst.State.PLAYING)
        self.jpegpipe.set_state(Gst.State.PLAYING)
        # self.main_recordpipe.set_state(Gst.State.PLAYING)
        self.server_pipe.set_state(Gst.State.PLAYING)

    def toggle_view(self):
        self.pause_pipes()
        if self.toggle:
            self.videoflip.set_property("method", 0)
            self.toggle = False
        else:
            self.videoflip.set_property("method", 2)
            self.toggle = True
        self.restart_pipes()

    def start_server(self):
        if not self.server_running:
            # Link to main pipeline
            self.jpegpipe.add(self.server_pipe)
            if not self.jpegtee.link(self.server_pipe):
                print("could not link tcp pipe to pipeline")

            # print("Webcam TCP Stream Started")
            self.server_running = True

            # Start Recording pipeline
            self.server_pipe.set_state(Gst.State.PLAYING)

    def record_video(self):
        self.counter = self.counter + 1
        timestamp = self.format_location()

        self.start_recordbin(timestamp)
        self.capture_Thumbnail(timestamp)

        if self.counter > 1:
            self.finalize(timestamp)
            self.move_files(self.previous_filepath)

        # self.previous_filepath = "../data/In_Progress/" + \
        #     timestamp + ".mp4"  # for computer

        # for RPI
        self.previous_filepath = "./data/In_Progress/" + timestamp + ".mp4"
        self.switch_recordingpipe()

        return False

    def start_recordbin(self, timestamp):
        videopath = "./data/In_Progress/" + timestamp + ".mp4"  # for RPI
        # videopath = "../data/In_Progress/"+timestamp + ".mp4"  # for computer

        # Start change file name
        self.main_recordpipe.get_by_name("filesink").set_property(
            "location", videopath)
        # Start Recording pipeline
        self.main_recordpipe.set_state(Gst.State.PLAYING)
        self.pipeline.add(self.main_recordpipe)
        if not self.main_tee.link(self.main_recordpipe):
            print("cannot link the recording pipe to main pipe")

        GLib.timeout_add_seconds(self.timeout_length, self.record_video)

    def finalize(self, filename):
        self.prev_filename = filename + ".mp4"
        self.temp_recordpipe.get_by_name(
            "encoder").send_event(Gst.Event.new_eos())
        self.temp_recordpipe.set_state(Gst.State.NULL)

        self.main_tee.unlink(self.temp_recordpipe)
        self.temp_recordpipe.ref()
        self.pipeline.remove(self.temp_recordpipe)
        # print("finished writing")

    def switch_recordingpipe(self):
        temp = self.main_recordpipe
        self.main_recordpipe = self.temp_recordpipe
        self.temp_recordpipe = temp

        # Create objects
        self.filequeue = self.temp_recordpipe.get_by_name("filequeue")
        self.encoder = self.temp_recordpipe.get_by_name("encoder")

    def finalize_recording(self):
        self.temp_recordpipe.get_by_name(
            "encoder").send_event(Gst.Event.new_eos())
        self.temp_recordpipe.set_state(Gst.State.NULL)

        self.main_tee.unlink(self.temp_recordpipe)
        self.temp_recordpipe.ref()
        self.pipeline.remove(self.temp_recordpipe)

    def finalize_lastvideo(self):
        self.main_recordpipe.get_by_name(
            "encoder").send_event(Gst.Event.new_eos())
        self.main_recordpipe.set_state(Gst.State.NULL)

        self.main_tee.unlink(self.main_recordpipe)
        self.main_recordpipe.ref()
        self.pipeline.remove(self.main_recordpipe)

    def timeout(self):
        self.save_Thumbnail()
        return False

    def stop_server(self):
        if self.server_running:
            self.server_running = False

            # Block the recording stream and send EOS
            self.probe = self.server_queue.get_static_pad("src").add_probe(
                Gst.PadProbeType.BLOCK_DOWNSTREAM, self.probe_block)

            # disconnect from main pipeline
            self.jpegtee.unlink(self.server_pipe)
            # self.pipeline.remove(self.server_pipe)
            self.jpegpipe.remove(self.server_pipe)

            # reset the recording pipeline
            self.server_pipe.set_state(Gst.State.NULL)
            self.server_queue.get_static_pad("src").remove_probe(self.probe)

    def quit(self):
        self.stop_server()
        self.pipeline.send_event(Gst.Event.new_eos())

        # add delay to let eos propagate
        time.sleep(1)
        self.move_lastfile()
        # self.socket.close()
        self.pipeline.set_state(Gst.State.NULL)
        self.loop.quit()

    def on_eos(self, bus, msg):
        print('on_eos(): End of Stream Received')
        self.pipeline.seek_simple(
            Gst.Format.TIME,
            Gst.SeekFlags.FLUSH | Gst.SeekFlags.KEY_UNIT,
            0
        )

    def on_error(self, bus, msg):
        print('on_error():', msg.parse_error())

    def probe_block(self, pad, buf):
        # print("blocked {}".format(pad))
        return True


app = WebcamRecord()
app.run()
