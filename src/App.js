import { Component } from 'react';
import './App.css';
import Table from './components/Table';
import Form from './components/Form';

class App extends Component {
  state = {
    characters: []
  }

  removeCharacter = (index) => {
    const { characters } = this.state

    this.setState({
      characters: characters.filter((c, i) => i !== index)
    });
  }

  handleSubmit = (character) => {
    this.setState({characters:[...this.state.characters, character]});
  }

  render() {

    return <div className="container">
      <Form handleSubmit={this.handleSubmit}/>
      <Table characterData={this.state.characters} removeCharacter={this.removeCharacter} />
    </div>
  }
}

export default App;
