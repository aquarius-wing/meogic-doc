import React from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ url, controls = true, light = false }) => {
    return (
        <div className='player-wrapper'>
            <ReactPlayer
                className='react-player'
                url={url}
                controls={controls}
                light={light}
                width='100%'
                height='100%'
            />
        </div>
    );
};

export default VideoPlayer;
