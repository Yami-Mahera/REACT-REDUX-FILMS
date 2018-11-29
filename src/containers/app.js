import React, { Component } from 'react'
import axios from 'axios'
import SearchBar from '../components/search-bar'
import VideoList from './video-list'
import VideoDetail from '../components/video-detail'
import Video from '../components/video'


const API_END_POINT = "https://api.themoviedb.org/3/";
const POPULAR_MOVIES_URL = "discover/movie?language=fr&sort_by=popularity.desc&include_adult=false&append_to_response=images";
const SEARCH_URL = "search/movie?language=fr&include_adult=false";
const API_KEY = "api_key=16f24f1f55f50e86fcc922c55e78b1db";

class App extends Component {
    constructor (props) {
        super (props);
        this.state = { movieList: {}, currentMovie: {}};
    }

    componentWillMount() {
        this.initMovies();
    }

    initMovies() {
        axios.get(`${API_END_POINT}${POPULAR_MOVIES_URL}&${API_KEY}`)
            .then(res => {
            this.setState({ movieList: res.data.results.slice(1,6), currentMovie: res.data.results[0]}, () => 
                this.applyVideoTOCurrentMovie());
        });
    }

    applyVideoTOCurrentMovie() {
        axios.get(`${API_END_POINT}movie/${this.state.currentMovie.id}?${API_KEY}&append_to_response=videos&include_adult=false`)
            .then(res => {
            const youtubeKey = res.data.videos.results[0].key;
            let newCurrentMovieState = this.state.currentMovie;
            newCurrentMovieState.videoId = youtubeKey;
            this.setState({ currentMovie: newCurrentMovieState })
        });
    }
    
    render() {                                                                                                                                                                 
        return (
            <div>
                <div className="seach_bar">
                    <SearchBar callback = {(searchText) => this.onClickSearch(searchText)} />
                </div>
                <div className="row" >
                    <div className="col-md-8" >
                        {<Video videoId = {this.state.currentMovie.videoId}/>}
                        <VideoDetail title = { this.state.currentMovie.title } description = { this.state.currentMovie.overview }/>
                    </div>
                    <div className="col-md-4" >
                        {this.renderVideoList()}
                    </div>
                </div>
            </div>
        )
    }

    renderVideoList () {
        if( this.state.movieList.length >= 5 ) {
            return <VideoList movieList = {this.state.movieList} callback = {(movie) => this.onClickListItem(movie)}/>
        }  
    }

    onClickListItem (movie) {
        this.setState({currentMovie: movie}, () => {
            this.applyVideoTOCurrentMovie();
            this.setRecommendation();
        });
    }

    onClickSearch (searchText) {
        searchText && axios.get(`${API_END_POINT}${SEARCH_URL}&${API_KEY}&query=${searchText}`)
            .then(res => {
            (res.data && res.data.results[0]) && (res.data.results[0].id !== this.state.currentMovie.id) 
                && this.setState({currentMovie: res.data.results[0]}, () => {
                    this.applyVideoTOCurrentMovie();
                    this.setRecommendation();
                });        
        }); 
    }

    setRecommendation () {
        axios.get(`${API_END_POINT}movie/${this.state.currentMovie.id}/recommendations?${API_KEY}&language=fr`)
            .then(res => 
                this.setState({ movieList: res.data.results.slice(0,5)})
            );
    }
}

export default App;