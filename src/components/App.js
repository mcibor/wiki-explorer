import { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import WikiSearchBar from './WikiSearchBar';
import WikiSearchResult from './WikiSearchResult';
import { Layout, Menu } from 'antd';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  generatePath
} from "react-router-dom";

const { Header, Content } = Layout;

class App extends Component {

  initialQuery = {
    language: 'en',
    searchQuery: ''
  }

  state = {
    currentQueryData: this.initialQuery,
    currentQueryPath: '/',
    newResult: false,
    searchQueries: new Map()
  }

  handleSubmit = (query) => {
    const wikiUri = `https://${query.language}.wikipedia.org/w/api.php?` + new URLSearchParams({
      action: 'opensearch',
      search: query.searchQuery,
      format: 'json',
      origin: '*'
    });
    
    fetch(wikiUri).then((result) => result.json())
      .then((result) => {
        var newQueriesMap = new Map();
        for (const [k, v] of this.state.searchQueries) {
          newQueriesMap.set(k, v);
        }

        const queryPath = this.getQueryPath(query);

        newQueriesMap.set(this.getResultMapKey(query), {
          query: query,
          queryPath: queryPath,
          result: {
            articles: result[1],
            links: result[3]
          }
        });

        this.setState({
          currentQueryData: query,
          currentQueryPath: queryPath,
          searchQueries: newQueriesMap,
          newResult: true
        })
      })
  }

  getResultMapKey = (query) => query.language + '|' + query.searchQuery;

  getQueryPath = (query) => {
    return generatePath('/result/:lang/:query', { lang: query.language, query: query.searchQuery });
  }

  updateCurrentQueryPath = (event) => {
    const queryKey = event.target.attributes.querykey;
    const currentQueryData = this.state.searchQueries.get(queryKey?.value);
    
    this.setState({
      currentQueryPath: event.target.pathname, // target is an <a> element,
      currentQueryData: currentQueryData?.query || this.initialQuery
    })
  }

  render() {
    const menuItems = [];
    for (const [queryKey, queryResult] of this.state.searchQueries) {
      const { query, queryPath } = queryResult;
      menuItems.push((
        <Menu.Item key={queryPath}>
          <Link to={queryPath} querykey={queryKey} onClick={this.updateCurrentQueryPath}>
            {query.searchQuery} ({query.language})
          </Link>
        </Menu.Item>
      ));
    }

    return (
      <Router>
        <Layout className="layout">

          <Header>
            <Menu theme="dark" mode="horizontal" selectedKeys={[this.state.currentQueryPath]}>
              <Menu.Item key="/">
                <Link to="/" onClick={this.updateCurrentQueryPath}>
                  New Search
                </Link>
              </Menu.Item>
              {menuItems}
            </Menu>
          </Header>

          <Content>
            <div className="site-layout-content">
              <WikiSearchBar sendSearchQuery={this.handleSubmit} searchQuery={this.state.currentQueryData} />

              {this.state.newResult ? <Redirect to={this.state.currentQueryPath} /> : null}

              <Switch>

                <Route key="home" exact path="/">
                  <WikiSearchResult searchResult={{ articles: [], links: [] }} />
                </Route>

                <Route key="result" exact path="/result/:lang/:query"
                  render={(routeData) => {
                    const { lang, query } = routeData.match.params;
                    const queryKey = this.getResultMapKey({ language: lang, searchQuery: decodeURIComponent(query) });
                    const queryResult = this.state.searchQueries.get(queryKey)?.result;
                    return queryResult ? <WikiSearchResult searchResult={queryResult} /> : <Redirect to="/" />;
                  }
                  }
                />
              </Switch>

            </div>
          </Content>
        </Layout>

      </Router>

    )
  }

  componentDidUpdate() {
    if (this.state.newResult) {
      this.setState({ newResult: false });
    }
  }
}

export default App;
