import { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import WikiSearchBar from './components/WikiSearchBar';
import WikiSearchResult from './components/WikiSearchResult';
import { Layout, Menu } from 'antd';

const { Header, Content } = Layout;

class App extends Component {
  state = {
    data: {
      articles: [],
      links: []
    },
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
      this.setState({
        data: {articles: result[1], links: result[3]},
      })
    })
  }

  render() {
    return (
    <Layout>
      <Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Wiki Search</Menu.Item>
        </Menu>      
      </Header>
      <Content>
        <WikiSearchBar sendSearchQuery={this.handleSubmit}/>
        <WikiSearchResult searchResult={this.state.data}/>
      </Content>
    </Layout>
    )
  }
}

export default App;
