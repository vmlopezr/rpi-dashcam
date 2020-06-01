buildimg:
	docker build -t vmlopezr/rpi-cam-gstreamer:latest .

runimgdefault:
	docker run -it -e TIMEZONE="America/Chicago" \
		-v /dev:/dev vmlopezr/rpi-cam-gstreamer:latest

runimgbash:
	docker run -it --rm --name rpi-dashcam \
		--device-cgroup-rule='c 81:* rmw' \
		-e TIMEZONE="America/Chicago" \
		-p 50000:50000 -p 50003:50003 \
		-v /dev:/dev \
		-v `pwd`/data:/usr/src/app/data:Z \
		vmlopezr/rpi-cam-gstreamer:latest bash

runimgvolroot:
	docker run -it --rm --name rpi-dashcam \
		--device-cgroup-rule='c 81:* rmw' \
		-e TIMEZONE="America/Chicago" \
		-p 50000:50000 \
		-p 50003:50003  \
		-v /dev:/dev \
		-v `pwd`/data:/usr/src/app/data:Z \
		vmlopezr/rpi-cam-gstreamer:latest

exportimg:
	docker save vmlopezr/rpi-cam-gstreamer:latest \
		> vmlopezr-rpi-cam-gstreamer.tar

loadimg:
	docker load -i vmlopezr-rpi-cam-gstreamer.tar
