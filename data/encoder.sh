export VIDEO_FILE=$1

mkdir hls-${VIDEO_FILE}

cd hls-${VIDEO_FILE}

ffmpeg -i ../${VIDEO_FILE}.mp4 -profile:v baseline -level 3.0 -start_number 0 -hls_time 2 -hls_list_size 0 -f hls master.m3u8
