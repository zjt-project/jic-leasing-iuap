/**
 *字表列标配 保证金计划
 */
import React, { Component } from "react";
import {  } from 'tinper-bee';
import { Form, Table } from "tinper-bee";
import StringEditCell from 'components/ChildListRef/StringEditCell';
import TableFormRef from 'components/ChildListRef/TableFormRefChild';
import NumberEditCell from 'components/ChildListRef/NumberEditCell';
import DatePickerEditCell from 'components/ChildListRef/DatePickerEditCell';

import { deepClone } from "utils";
  class ChildListView2 extends Component {
    constructor(props, context) {
      super(props);
      this.state = {
        //表数据
        dataSource: [
            
        ],
        //不可编辑
        isEditArray: [
          []
        ],
        //表头
        columns: [
          {
            title: "序号",
            dataIndex: "index",
            key: "index"
          },
          {
            title: "收取期次",
            dataIndex: "lease_time",
            key: "lease_time",
            width: 215,
            render: (text, record, index) => (
              <StringEditCell
              value={text}
              type = "email"
              editable = {this.props.props.isEdit}
              onChange={this.onCellChange(index, "lease_time").bind(this)}
            />
            )
          },
          {
            title: "计划收取日期",
            dataIndex: "plan_date",
            key: "plan_date",
            width: 215,
            render: (text, record, index) => (
              <DatePickerEditCell
              format = {"YYYY-MM-DD"} //默认可自定义
              value={text}
              editable = {this.props.props.isEdit}
              onChange={this.onCellChange(index, "plan_date").bind(this)}
            />
            )
          },
          {
            title: "交易类别",
            dataIndex: "trans_type",
            key: "trans_type",
            width: 215,
            render: (text, record, index) => (
              <TableFormRef
                value={text}
                editable = {this.props.props.isEdit} //是否可编辑
                title={"交易类别"} 
                onChange={this.onCellChange(index, "trans_type")}
              />
            )
          },
          {
            title: "发生金额(元)",
            dataIndex: "lease_cash",
            key: "lease_cash",
            width: 215,
            render: (text, record, index) => (
              <NumberEditCell
              value={text}
              editable = {this.props.props.isEdit}
              onChange={this.onCellChange(index, "lease_cash").bind(this)}
            />
            )
              
          },
          {
            title: "备注",
            dataIndex: "memo",
            key: "memo",
            width: 215,
            render: (text, record, index) => (
              <StringEditCell
                value={text}
                editable = {this.props.props.isEdit} //是否可编辑
                onChange={this.onCellChange(index, "memo")}
              />
            )
          }
          
        ]
      };
    }

    //组件生命周期方法-在第一次渲染后调用，只在客户端
    componentDidMount() {
      this.props.onRef(this); //绑定子组件
      //修改时 限定某个字段不可编辑
      
    }

    //绑定子组件2
    onRef2 = (ref) => {
      this.child2 = ref;        
    }
  
    //输入框变化事件
    onCellChange = (index, key) => {
      return value => {
        let dataSource = this.state.dataSource;
        dataSource[index][key] = value;
        this.setState({ dataSource }, () => console.dir(this.state.dataSource));
      };
      
    };

    //构造字表
    // childFromList=()=>{ 
    //    if(this.props.props.formObject != undefined && this.props.props.formObject != ""){
    //      //项目批次等于 次期的时候 字表限额方案不可修改
    //     if("次期" == this.props.props.formObject.adjust_time){
    //        let dataSource = this.state.dataSource;
    //        dataSource[0].editable = false; 
    //        this.setState({dataSource});
    //     }
    //   }
     
    // }
  
    render() { 
        return (
          <div className="demo0502 u-editable-table">
            <Table data={this.state.dataSource} columns={this.state.columns} headerHeight={40} height={40}
            emptyText = {()=>{return "";}} //无数据时显示内容
            />
          </div>
        );
      
    }
  }
  export default Form.createForm()(ChildListView2);