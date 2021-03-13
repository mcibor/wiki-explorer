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
  Redirect
} from "react-router-dom";

const { Header, Content } = Layout;

class App extends Component {
  state = {
    currentQuery: '/',
    lastQuery: '',
    searchQueries: new Map()
  }

  handleSubmit = (query) => {
    fetch(`https://${query.language}.wikipedia.org/w/api.php?` + new URLSearchParams({
      action:'opensearch',
      search:query.searchQuery,
      format:'json',
      origin:'*'
    }))
    .then((result) => result.json())
    .then((result) => {
      var newQueriesMap = new Map();
      for (const [k,v] of this.state.searchQueries) {
        newQueriesMap.set(k,v);
      }

      const currentQuery = this.getQueryPath(query);
      newQueriesMap.set(currentQuery, {
        query: query,
        result: {
          articles: result[1], 
          links: result[3]
        }
      });

      this.setState({ 
        currentQuery: currentQuery,
        lastQuery: this.state.currentQuery,
        searchQueries: newQueriesMap
      })
    })
  }

  getQueryPath = (query) => {
    return '/' + query.language + '/' + encodeURI(query.searchQuery);
  }

  render() {

    const menuItems = [];
    const routes = [];
    for (const [queryPath, queryResult] of this.state.searchQueries) {

      const {query, result} = queryResult;
      menuItems.push((
        <Menu.Item key={queryPath}>
          <Link to={queryPath}> 
            {query.searchQuery} ({query.language})
          </Link>          
        </Menu.Item>
      ));

      routes.push((
        <Route key={queryPath} path={queryPath} render={()=> (
            <WikiSearchResult searchResult={result}/>
          )}/>
      ))
    }

    console.log(routes);

    return (
      <Router>
        <Layout className="layout">

        <Header>
          <Menu theme="dark" mode="horizontal" selectedKeys={[this.state.currentQuery]}>
            <Menu.Item key="/">
              <Link to="/">
                New Search
              </Link>
            </Menu.Item>
            {menuItems}
          </Menu>      
        </Header>

        <Content>
          <div className="site-layout-content">
            {this.state.currentQuery !== this.state.lastQuery ? <Redirect to={this.state.currentQuery}/> : null}
            
            <WikiSearchBar sendSearchQuery={this.handleSubmit}/>

            <Switch>
              <Route key="/" exact path="/">
                <WikiSearchResult searchResult={{articles:[],links:[]}}/>
              </Route>
              {routes}
            </Switch>
          </div>
        </Content>
        </Layout>

      </Router>

    )
  }
}

export default App;
