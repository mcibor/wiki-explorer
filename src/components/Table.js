import React, { Component } from 'react'

function TableHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Job</th>
      </tr>
    </thead>
  )
}

function TableBody(props) {
  const rows = props.characterData.map(
    (character, index) => (
      <tr key={index}>
        <td>{character.name}</td>
        <td>{character.job}</td>
        <td>
          <button onClick={()=>props.removeCharacter(index)}>Delete</button>
        </td>
      </tr>
    ))

  return <tbody>{rows}</tbody>
}

class Table extends Component {
  render() {
    const {characterData, removeCharacter} = this.props;
    return (
      <table>
        <TableHeader/>
        <TableBody characterData={characterData} removeCharacter={removeCharacter}/>
      </table>
    )
  }
}

export default Table