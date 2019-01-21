import React, {Component} from 'react';
import './Main.css';
import Results from '../components/Results';
import axios from 'axios';

class Main extends Component {
    state = {
        searchTerm: "",
        results: {},
        clear: false
    }

    onClearedHandler = (e) => {
        if(e.target.value == "") {
            this.setState({
                clear: true
            });
        }
    }

    onStarHandler = (event, index, id) => {
        var newResults = this.state.results;
        newResults.map((entry, i) => {
            if(id == i) {
                newResults[i].favourite = !newResults[i].favourite;
            }
        })
        this.setState({
            results: newResults
        });
    }

    onSearchHandler = (e, btn) => {
        const searchTerm = e.target.value;
        if(e.key == 'Enter' && e.target.value != "") {
            console.log('dsfd');
            console.log(searchTerm);
            axios.get('https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000')
            .then(response => {
                var res = response.data.map(item => ({...item, favourite: false})); // now objects have a favourites field
                res = res.filter((eachObj) => {
                    return eachObj.keywords.includes(searchTerm);
                });
                this.setState({
                    clear: false,
                    results: res
                });
            })
            .catch(response => {
                console.log("error");
            });
        }
    }

    render() {
        var results = <p></p>
        if(this.state.results.length > 0) {
            results = (
                this.state.results.map((res, index) => {
                    var body = res.body.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;nbsp;/g, " ");
                    return <Results 
                                key={res.title + res.body} 
                                clicked={(e) => this.onStarHandler(e, index, index)} 
                                title={res.title} 
                                description={body}
                                fave={res.favourite}/>
            }));
        }

        var favourites = <p>Your favourite waste materials will appear here</p>
        if(this.state.results.length > 0) {
            favourites = (this.state.results.filter((entry) => {
                return entry.favourite;
            }).map((res, index) => {
                var body = res.body.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;nbsp;/g, " ");
                return <Results 
                            key={index} clicked={(e) => this.onStarHandler(e, res, index, res.id)} 
                            title={res.title} 
                            description={body}
                            fave={res.favourite}/>
            }));
        }

        var displayStyle = this.state.clear ? {display: 'none'} : {};

        return(
            <div className="main">
                <div className="pageTitle">
                    <h1>Toronto Waste Lookup</h1>
                </div>

                {/* TODO: invert the search icon */}
                <div className="search">
                    <div className="searchContainer">
                        <input onChange={this.onClearedHandler} onKeyUp={this.onSearchHandler} id="searchBar" type="text" placeholder="Search..."></input>
                        <div className="searchIconContainer"><button onClick={(e) => this.onSearchHandler(e)}><i className="fas fa-search fa-flip-horizontal"></i></button></div>
                    </div>
                </div>

                <div style={displayStyle} className="searchResults">
                    {results}
                    <h2 style={{color: '#24995c'}} >Favourites</h2>
                    {favourites}
                </div>

            </div>
        );
    }
}

export default Main;