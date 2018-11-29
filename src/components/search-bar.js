import React, { Component } from 'react'

class SearchBar extends Component {
    constructor (props) {
        super(props);
        this.state = { 
            searchText: "",
            placeHolder: "Tapez votre film...",
            intervalBeforeRequest: 1000,
            lockRequest:false
         }
    }

    render() {
        return (
            <div className = "row" >
                <div className = "col-md-8 input-group" >
                    <input type="text" className="form-control input-lg" placeholder = { this.state.placeHolder } onChange = { (event) => this.handleChange(event) } />
                    <span className = "input-group-btn">
                        <button className = "btn btn-secondary" onClick = { () => this.handleOnclick()} >Rechercher</button>
                    </span>
                </div>
            </div>
        )
    }

    handleChange(event) {
        this.setState({ searchText: event.target.value });
        if (!this.state.lockRequest) {
            this.setState({ lockRequest: true })
            setTimeout(() => this.seach(), this.state.intervalBeforeRequest);
        }
    }

    handleOnclick() {
        this.seach();
    }

    seach() {
        this.props.callback(this.state.searchText);
        this.setState({ lockRequest: false});
    }
}

export default SearchBar;