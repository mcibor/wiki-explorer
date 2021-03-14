import { Component } from "react";

class WikiSearchResult extends Component{
    render(){
        const {articles, links} = this.props.searchResult
        const result = articles.map((article, index) => {
          return <li key={index}><a href={links[index]} target="_blank" rel="noreferrer">{article}</a></li>
        })

        return (
            <ul>{result}</ul>
        )
    }
}

export default WikiSearchResult;