///<reference path="isOldIOS.ts"/>
///<reference path="emptyVideo.ts"/>
module zanejs {

    export class NoSleep {

        private static timer: number;
        private static video: HTMLVideoElement;

        public static enable(): void {
            NoSleep.initVideo();
            if (isOldIOS) {
                NoSleep.disable();
                NoSleep.timer = window.setInterval(
                    () => {
                        window.location.href = '/';
                        window.setTimeout(window.stop, 0);
                    },
                    15000);
            } else {
                NoSleep.video.play();
            }
        }

        public static disable(): void {
            NoSleep.initVideo();
            if (isOldIOS) {
                if (NoSleep.timer) {
                    window.clearInterval(NoSleep.timer);
                    NoSleep.timer = null;
                }
            } else {
                NoSleep.video.pause();
            }
        }

        private static initVideo(): void {
            if (!NoSleep.video) {
                let video: HTMLVideoElement = document.createElement('video');
                video.setAttribute('playsinline', 'true');
                video.setAttribute('type', 'video/mp4');
                video.setAttribute('x5-video-player-type', 'h5');
                video.setAttribute('src', emptyVideoData);
                video.addEventListener('timeupdate', () => {
                    if (video.currentTime > 0.5) {
                        video.currentTime = Math.random();
                    }
                });
                NoSleep.video = video;
            }
        }
    }
}
