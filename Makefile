buildimg:
	docker build -t gstcam-debian-buster:v1 .

runimgdefault:
	#docker run -it -v /dev:/dev -v /usr/bin/qemu-arm-static:/usr/bin/qemu-arm-static gstcam-debian-buster:v1
	docker run -it -v /dev:/dev gstcam-debian-buster:v1
runimgbash:
	#docker run -it --device-cgroup-rule='c 81:* rmw' -v /dev:/dev -v /usr/bin/qemu-arm-static:/usr/bin/qemu-arm-static gstcam-debian-buster:v1
	docker run -it --rm --device-cgroup-rule='c 81:* rmw' -p 50000:50000 -p 50003:50003 -v /dev:/dev gstcam-debian-buster:v1

runimgvolroot:
	# docker run -it --device-cgroup-rule='c 81:* rmw' -v /dev:/dev -v /usr/bin/qemu-arm-static:/usr/bin/qemu-arm-static -v `pwd`:/usr/src/app/home:Z gstcam-debian-buster:v1
	docker run -it --rm --device-cgroup-rule='c 81:* rmw' -p 50000:50000 -p 50003:50003  -v /dev:/dev -v `pwd`/data:/usr/src/app/data:Z gstcam-debian-buster:v1

exportimg:
	docker save gstcam-debian-buster:v1 > gstcam-debian-buster:v1.tar

loadimg:
	docker load -i gstcam-debian-buster:v1.tar
