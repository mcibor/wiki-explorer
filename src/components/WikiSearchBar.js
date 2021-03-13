import React, { Component } from "react";
import { Button, Form, Input, Radio } from "antd";


class WikiSearchBar extends Component {
  form = React.createRef();

  initialState = {
    searchQuery: '',
    language: 'en'
  };

  state = this.initialState;
  
  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({
      [name]: value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.formIsInvalid()) 
      return;

    this.props.sendSearchQuery(this.state);
  }

  formIsInvalid = () => {
    const form = this.form.current;
    return !form.isFieldsTouched(true) || form.getFieldsError().filter(({ errors }) => errors.length).length
  }

  render() {
    const { query, language } = this.state;

    return (
      <Form ref={this.form}>
        <Form.Item label="Language">
          <Radio.Group onChange={this.handleChange} name="language" value={language}>
            <Radio value="en">en</Radio>
            <Radio value="pl">pl</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="searchQuery" label="Search for"
          rules={[{
            required: true,
            message: 'Please type in a query to search'
          }]}
        >
          <Input name="searchQuery" value={query} onChange={this.handleChange} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={this.handleSubmit} >Search</Button>
        </Form.Item>
      </Form>
    )
  }
};

export default WikiSearchBar;