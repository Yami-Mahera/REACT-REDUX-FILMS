import React from 'react'
import VideoListItem from '../components/video-list-item'

const VideoList = (props) => {
    const {movieList} = props;                                                                                                     
    return (
        <div>
            <ul>
                {
                    movieList.map(movie => <VideoListItem key = {movie.id}  movie = {movie} callback = {onClickListItem} />)
                }
            </ul>
        </div>
    )

    function onClickListItem(movie) {
        props.callback(movie);
    }

}
export default VideoList;