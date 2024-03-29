import React, { Component } from 'react';
import {Icon,Dropdown, Menu} from 'tinper-bee';
import Button from 'components/Button';
import './index.less';
import 'styles/yl-public.less';
import {checkBillStatus} from "utils/service";


const { Item,Divider } = Menu;

class ButtonGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            power:props.BtnPower,          
         };
    }

    /**
     * 按钮权限
     */
    powerView = (param,name) => {
        //获取用户有权限的按钮,暂时写True,构建后台后再改。
        let power = false;

        if(param.powerButton && param.powerButton.length > 0){
            power = param.CalButton.includes(name);
        }
        return power;
    }

    /**
     * 控制按钮可见
     * 权限 && 列表界面
     */
    powerGridView = (param,name) =>{
        let ifPower = param.ifPowerBtn;
        let isCalGrid = param.isCalGrid;
        //过滤后台按钮权限
        if(ifPower){
            if(param.powerButton && param.powerButton.length > 0){
                power = param.CalButton.includes(name);
            } else {
                power = false;
            }
        }
        return power && isCalGrid;        
    }

    /**
     * 控制按钮可见
     * 权限 && Form界面
     */
    powerFormView = (param,name) =>{
        let power=true;
        let ifPower = param.ifPowerBtn;
        let isCalGrid = param.isCalGrid;
        //过滤后台按钮权限
        if(ifPower){
            if(isCalGrid){
                power = false;
            }else{
                if(param.mainButton && param.mainButton.length > 0){
                    power = param.CalButton.includes(name);
                } else {
                    power = false;
                }
            }
        }
        return power;        
    }

    /**
     * 编辑状态下 =>可用
     */
    powerDisabledEdit = (param) =>{
        let isCalEdit = param.isCalEdit;
        return !isCalEdit;
    }

    /**
     * 不可编辑状态 =>可用
     */
    powerDisabledUnEdit = (param) =>{
        let isCalEdit = param.isCalEdit;
        return isCalEdit;
    }

    /**
     * 不可编辑状态 && 单条数据 && 符合状态集合 =>可用
     */
    powerDisabledSingle = (param,status=[]) =>{
        let isCalGrid = param.isCalGrid;
        let isCalEdit = param.isCalEdit;
        let selectList = param.selectedList;
        if(selectList && selectList.length == 1){
            if(isCalGrid){
                return isCalGrid&&!checkBillStatus(selectList[0],status);
            }else{
                if(isCalEdit){
                    return true;
                }else{
                    return !checkBillStatus(selectList[0],status);
                }
            }
        } else {
            return true;
        }
    }

    /**
     * 个性化控制是否可用
     * 例如控制审批流中的权限等
     *  |修改按钮|
     */
    powerDisabledForSubmit = (param) => {
        

    }

    render() {
        console.log('加载 Button 组建');
        let _props = this.props;
        let _this = this;
        const tableMenu = (
            <Menu className='tab-menu' onSelect={this.handleSelect} itemIcon={<Icon type='uf-setting-c-o'/>}>
                <Divider />
                <Item key="1">导出选中数据</Item>
                <Divider />
                <Item key="2">导出全部数据</Item>
                <Divider />
                <Item key="3">导出当前页 </Item>
                <Divider />
            </Menu>
        );
        
        return (
            
            <div className='table-header'>
                <Button visible={_props.isCalGrid} className="ml8" colors="primary" onClick={_props.Query}><Icon type='uf-search'/>查询</Button>
                <Dropdown trigger={['click']} overlay={tableMenu} animation="slide-up">
                    <Button visible={_this.powerView(_props,'Export') && _props.isCalGrid} className="ml8" colors="primary"><Icon type='uf-symlist'/>导出</Button>
                </Dropdown>
                <Button visible={_props.isCalEdit} disabled={_this.powerDisabledEdit(_props)} className="ml8" colors="primary" onClick={_props.Save}><Icon type='uf-search'/>保存</Button>
                <Button visible={_this.powerFormView(_props,'Return')} disabled={_this.powerDisabledUnEdit(_props)} className="ml8" colors="primary" onClick={_props.Return}><Icon type='uf-search'/>返回</Button>
                <Button visible={_this.powerView(_props,'ViewFlow')} disabled={_this.powerDisabledSingle(_props,[204,9])} className="ml8 yl-r-b" colors="primary" onClick={_props.ViewFlow}><Icon type='uf-setting-c-o'/>查看流程图</Button>
                <Button visible={_this.powerView(_props,'Check')} disabled={_this.powerDisabledSingle(_props,[204])} className="ml8 yl-r-b" colors="primary" onClick={_props.Check}><Icon type='uf-seal'/>审核</Button>
                <Button visible={_this.powerView(_props,'Submit')} disabled={_this.powerDisabledSingle(_props,[20,99])} className="ml8 yl-r-b" colors="primary" onClick={_props.Submit}><Icon type='uf-flow-o'/>提交</Button>
                <Button visible={_this.powerView(_props,'Edit')} disabled={_this.powerDisabledUnEdit(_props)} className="ml8 yl-r-b" colors="primary" onClick={_props.Edit}><Icon type='uf-pencil-s'/>修改</Button>
                <Button visible={_this.powerFormView(_props,'Add')} disabled={_this.powerDisabledUnEdit(_props)} className="ml8 yl-r-b" colors="primary" onClick={_props.Add}><Icon type='uf-add-c-o'/>新增</Button>
                <Button visible={_props.isCalGrid} className="ml8 yl-r-b" colors="primary" onClick={_props.View}><Icon type='uf-files-o'/>查看</Button>
            </div>
            
        );
    }
}

export default ButtonGroup;