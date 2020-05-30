buildimg:
	docker build -t vmlopezr/rpi-cam:gstreamer .

runimgdefault:
	#docker run -it -v /dev:/dev -v /usr/bin/qemu-arm-static:/usr/bin/qemu-arm-static vmlopezr/rpi-cam:gstreamer
	docker run -it -v /dev:/dev vmlopezr/rpi-cam:gstreamer
runimgbash:
	#docker run -it --device-cgroup-rule='c 81:* rmw' -v /dev:/dev -v /usr/bin/qemu-arm-static:/usr/bin/qemu-arm-static vmlopezr/rpi-cam:gstreamer
	docker run -it --rm --device-cgroup-rule='c 81:* rmw' -p 50000:50000 -p 50003:50003 -v /dev:/dev -v `pwd`/data:/usr/src/app/data:Z vmlopezr/rpi-cam:gstreamer bash

runimgvolroot:
	# docker run -it --device-cgroup-rule='c 81:* rmw' -v /dev:/dev -v /usr/bin/qemu-arm-static:/usr/bin/qemu-arm-static -v `pwd`:/usr/src/app/home:Z vmlopezr/rpi-cam:gstreamer
	docker run -it --rm --device-cgroup-rule='c 81:* rmw' -p 50000:50000 -p 50003:50003  -v /dev:/dev -v `pwd`/data:/usr/src/app/data:Z vmlopezr/rpi-cam:gstreamer

exportimg:
	docker save vmlopezr/rpi-cam:gstreamer > vmlopezr/rpi-cam:gstreamer.tar

loadimg:
	docker load -i vmlopezr/rpi-cam:gstreamer.tar
