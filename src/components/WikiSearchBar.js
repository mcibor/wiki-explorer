import React, { Component } from "react";
import { Button, Form, Input, Radio } from "antd";


class WikiSearchBar extends Component {
  formRef = React.createRef();

  handleSubmit = (value) => {
    this.props.sendSearchQuery(value);
  }

  componentDidUpdate(){
    this.formRef.current.setFieldsValue(this.props.searchQuery);
  }

  render() {
    return (
      <Form ref={this.formRef} initialValues={{language:'en',searchQuery:''}} onFinish={this.handleSubmit}>
        <Form.Item name="language" label="Language">
          <Radio.Group>
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
          <Input/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Search</Button>
        </Form.Item>
      </Form>
    )
  }
};

export default WikiSearchBar;