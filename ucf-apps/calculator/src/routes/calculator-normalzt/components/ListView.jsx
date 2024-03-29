import React, {Component} from 'react';
import {actions} from 'mirrorx';
import Grid from 'components/Grid';
import { Tabs } from 'tinper-bee';
import {deepClone, getHeight} from "utils";
import {genGridColumn,checkListSelect} from "utils/service";
import GridMain from 'components/GridMain';

const { TabPane } = Tabs;
import './index.less';

class ListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHeight: 0,
            tableHeight2: 0, //字表高度
            filterable: false,
            record: {}, // 存储关联数据信息
            isGrid:true,//是否列表界面 true:列表界面 false:卡片界面
            formView:'none',
            listView:'',
            selectList:[],
        }
    }
    

    //组件生命周期方法-在渲染前调用,在客户端也在服务端
    componentWillMount() {
        //主表过滤显示字段
        const gridMain = this.getShowColumn(this.props.gridColumn,this.grid,true);
        //计算表格滚动条高度
        this.resetTableHeight(false);
        this.gridColumn = [...genGridColumn(gridMain)];
        this.gridColumnOnTheLoan = [...genGridColumn(this.gridOnTheLoan)];
        this.gridColumnMarginLoan = [...genGridColumn(this.gridMarginLoan)];
        this.gridColumnCommissionLoan = [...genGridColumn(this.gridCommissionLoan)];
        this.gridColumnMiddleCostLoan = [...genGridColumn(this.gridMiddleCostLoan)];
        this.gridColumnOtherLoan = [...genGridColumn(this.gridOtherLoan)];
        this.gridColumnRentLoan = [...genGridColumn(this.gridRentLoan)];
    }

    //组件生命周期方法-在第一次渲染后调用，只在客户端
    componentDidMount() {
        actions.calculatorNormalzt.loadList(this.props.queryParam);
    }

    //组件生命周期方法-在组件接收到一个新的 prop (更新后)时被调用
    componentWillReceiveProps(nextProps) {
        console.log("11");
    }

    /**
     * 跳转到指定页数据
     * @param {Number} pageIndex 跳转指定页数
     */
    freshData = (pageIndex) => {
        let queryParam = deepClone(this.props.queryParam); // 深拷贝查询条件从 action 里
        queryParam['pageIndex'] = pageIndex;
        actions.calculatorNormalzt.loadList(queryParam);
    }

    /**
     * 设置每页显示行数
     * @param {Number} index 跳转指定页数
     * @param {Number} value 设置一页数据条数
     */
    onDataNumSelect = (index, value) => {
        let queryParam = deepClone(this.props.queryParam); // 深拷贝查询条件从 action 里
        queryParam['pageSize'] = value;
        queryParam['pageIndex'] = 0;
        if (value && value.toString().toLowerCase() === "all") { // 对分页 pageSize 为 all 进行处理，前后端约定
            pageSize = 1;
        }
        actions.calculatorNormalzt.loadList(queryParam);
    }

    /**
     * 行单击事件,同步行首checkbox
     * 可能会有性能问题,暂时实现功能,待后期再取舍
     * #关闭功能,如果有页面特殊要求再打开#
     */
    // onRowSelect = (record, index, event) => {
    //     console.log('行点击事件');
    //     let _record = deepClone(record);
    //     _record._checked = _record._checked ? false : true;
    //     let param = {
    //         record:_record,
    //         index:index,
    //     }
    //     let _selectedList = deepClone(this.props.selectedList);
    //     if(_record._checked){
    //         _selectedList.push(_record);
    //     } else {
    //         _selectedList.splice(_selectedList.findIndex(item => item.pk === record.pk), 1)
    //     }
    //     actions.calculatorNormalzt.updateRowData(param,index);
    //     actions.calculatorNormalzt.updateState({ selectedList : _selectedList });
        
        
        
    // }

    /**
     * 点击row选择框触发绑定数据对象
     * 绑定选中数据数组到数据模型中
     */
    getSelectedDataFunc = (selectedList,record,index) => {
        let { list } = this.props;
        let _list = deepClone(list);
        let _selectedList = deepClone(selectedList);
        let _formObj = {};
        if (index != undefined) {
            _list[index]['_checked'] = !_list[index]['_checked'];
        } else {
            if(_selectedList && _selectedList.length > 0){
                _list.map(item => {
                    if (!item['_disabled']) {
                        item['_checked'] = true;
                    }
                });
            } else {
                _list.map(item => {
                    if (!item['_disabled']) {
                        item['_checked'] = false;
                    }
                });
            }            
        }
        if(_selectedList && _selectedList.length == 1){
            _formObj = deepClone(_selectedList[0]);
            this.childList(_formObj);
        }else{
            actions.calculatorNormalzt.updateState({ list2 : []});
        }
        console.log('let me list');
        console.log(_list);
        console.log(_formObj);
        console.log(list);
        console.log(_selectedList);
        
        actions.calculatorNormalzt.updateState({ list : _list,selectedList : _selectedList,formObject : _formObj});
        
    }

    childList = (obj) => {
        console.log("进入" + obj);
        //加载子组件列表
        actions.calculatorNormalzt.loadChildList(this.props.queryParam);
    }

    /**
     * 重置表格高度计算回调
     *
     * @param {Boolean} isopen 是否展开
     */
    resetTableHeight = (isopen) => {
        let tableHeight = 0;
        tableHeight = getHeight() - 430;
        this.setState({ tableHeight });

        let tableHeight2 = 0;
        tableHeight2 = getHeight() - 480;
        this.setState({ tableHeight2 });

    }

    /**
     * 过滤需要处理的字段
     * @param gridColumn 需要处理的字段 
     * @param grid 全部的字段 
     * @param show show==true gridColumn为需要显示的字段  show==false  gridColumn为隐藏的字段
     */
    getShowColumn = (gridColumn,grid,show) =>{
        if(show){
            grid.map((item,index)=>{
                grid[index] = Object.assign(item, {ifshow:false});
            })
        }
        gridColumn.map((item,index)=>{
            grid.map((itemGrid,indexGrid)=>{
                if(item == itemGrid.key){
                    const obj = Object.assign(itemGrid, {ifshow:show?true:false})
                    grid[indexGrid] = obj;
                }
            })
        });
        return grid;
    }

    //gridColumn 需要显示的字段  grid全部的字段
    getColumnByShow = (gridColumn,grid) =>{
        
    }

    //主表  列属性定义 ifshow:false 不显示该列  默认全显示 true
    grid = [
        {title:'操作日期',key:'operate_date',type:'0'},
        {title:'测算方案名称',key:'quot_name',type:'0'},
        {title:'投放日期',key:'plan_date_loan',type:'0'},
        {title:'计划投放金额(元)',key:'plan_cash_loan',type:'0'},
        {title:'租赁方式',key:'lease_method',type:'0'},
        {title:'租赁期限(月)',key:'lease_times',type:'0'},
        {title:'租赁本金',key:'fact_cash_loan',type:'0'},
        {title:'保证金金额(元)',key:'deposit_cash',type:'0'},
        {title:'手续费总金额(元)',key:'srvfee_cash_in',type:'0'},
        {title:'会计IRR按最新算法',key:'finace_irr_method',type:'0'},
        {title:'会计IRR算法启用年份',key:'finace_irr_year',type:'0'},
        {title:'市场IRR',key:'project_irr',type:'0'},
        {title:'会计IRR',key:'finance_irr',type:'0'},
    ]
    //主表 列属性定义=>通过前端service工具类自动生成
    gridColumn = [];

    // 投放计划 列属性定义
    gridOnTheLoan = [
        {title:'计划投放日期',key:'plan_date_loan',type:'0'},
        {title:'投放金额(元)',key:'plan_cash_loan',type:'0'},
        {title:'不含税投放金额(元)',key:'plan_cash_corpus',type:'0'},
        {title:'税率',key:'tax_rate',type:'0'},
        {title:'税额(元)',key:'tax_cash',type:'0'},
        {title:'投放付款方式',key:'pay_method_loan',type:'0'},
        {title:'银票开票日期',key:'make_date_draft',type:'0'},
        {title:'银票到期日期',key:'end_date_loan',type:'0'},
        {title:'银票保证金比例',key:'deposit_ratio4draft',type:'0'},
        {title:'银票保证金利率',key:'interrate_ratio4draft',type:'0'},
        {title:'计息金额计算方式',key:'calinter_amount_style',type:'0'},
    ]
    // 投放计划 列属性定义=>通过前端service工具类自动生成
    gridColumnOnTheLoan = [];

    //保证金计划  列属性定义
    gridMarginLoan = [
        {title:'收取期次',key:'lease_time',type:'0'},
        {title:'计划收取日期',key:'plan_date',type:'0'},
        {title:'交易类别',key:'trans_type',type:'0'},
        {title:'发生金额(元)',key:'lease_cash',type:'0'},
        {title:'备注',key:'memo',type:'0'},
    ]
    //保证金计划 列属性定义=>通过前端service工具类自动生成
    gridColumnMarginLoan = [];

    //手续费计划  列属性定义
    gridCommissionLoan = [
        {title:'收取期次',key:'lease_time',type:'0'},
        {title:'计划收取日期',key:'plan_date',type:'0'},
        {title:'交易类别',key:'trans_type',type:'0'},
        {title:'不含税(元)',key:'lease_cash_corpus',type:'0'},
        {title:'税额(元)',key:'lease_cash_tax',type:'0'},
        {title:'发生金额(元)',key:'lease_cash',type:'0'},
        {title:'备注',key:'memo',type:'0'},
    ]
    //手续费计划 列属性定义=>通过前端service工具类自动生成
    gridColumnCommissionLoan = [];

    //中间费用支出计划  列属性定义
    gridMiddleCostLoan = [
        {title:'支出期次',key:'lease_time',type:'0'},
        {title:'计划支出日期',key:'plan_date',type:'0'},
        {title:'交易类别',key:'trans_type',type:'0'},
        {title:'不含税(元)',key:'lease_cash_corpus',type:'0'},
        {title:'税额(元)',key:'lease_cash_tax',type:'0'},
        {title:'发生金额(元)',key:'lease_cash',type:'0'},
        {title:'备注',key:'memo',type:'0'},
    ]
    //中间费用支出计划 列属性定义=>通过前端service工具类自动生成
    gridColumnMiddleCostLoan = [];

    //其他收支计划  列属性定义
    gridOtherLoan = [
        {title:'收取期次',key:'lease_time',type:'0'},
        {title:'计划收取日期',key:'plan_date',type:'0'},
        {title:'交易类别',key:'trans_type',type:'0'},
        {title:'不含税(元)',key:'lease_cash_corpus',type:'0'},
        {title:'税额(元)',key:'lease_cash_tax',type:'0'},
        {title:'发生金额(元)',key:'lease_cash',type:'0'},
        {title:'税率',key:'tax_rate',type:'0'},
        {title:'备注',key:'memo',type:'0'},
    ]
    //其他收支计划 列属性定义=>通过前端service工具类自动生成
    gridColumnOtherLoan = [];

    //租金计划  列属性定义
    gridRentLoan = [
        {title:'计划收取日期',key:'plan_date',type:'0'},
        {title:'收取期次',key:'lease_time',type:'0'},
        {title:'交易类别',key:'trans_type',type:'0'},
        {title:'租金(元)',key:'lease_cash',type:'0'},
        {title:'本金(元)',key:'lease_corpus',type:'0'},
        {title:'利息(元)',key:'lease_interest',type:'0'},
    ]
    //租金计划 列属性定义=>通过前端service工具类自动生成
    gridColumnRentLoan = [];

    onChange = (activeKey) => {
        console.log(`onChange ${activeKey} o-^-o`);
        this.setState({
            activeKey,
        });
    }

    // afterFilter = (optData,columns)=>{
    //     columns.map((item,index)=>{
    //         item.ifshow=false;
    //     });
    //     this.gridColumn = columns;
    // }

    render() {
        let { tableHeight,  tableHeight2} = this.state;
        return (            
            <div className="grid-parent" style={{display:this.state.listView}}>
                <div>
                <GridMain
                        ref={(el) => this.grid = el} //存模版
                        columns={this.gridColumn} //字段定义
                        data={this.props.list} //数据数组                     
                        tableHeight={1} //表格高度 1主表 2字表
                        
                        //分页对象
                        paginationObj = {{
                            activePage : this.props.queryParam.pageIndex,//活动页
                            total : this.props.list.length,//总条数
                            items: this.props.queryObj.totalPages,//总页数
                            freshData: this.freshData, //活动页改变,跳转指定页数据
                            onDataNumSelect: this.onDataNumSelect, //每页行数改变,跳转首页
                        }}
                        //onRowClick={this.onRowSelect}
                        getSelectedDataFunc={this.getSelectedDataFunc}
                        //afterFilter={this.afterFilter}

                    />
                </div>
                <div>
                    <Tabs
                    defaultActiveKey="1"
                    onChange={this.onChange}
                    className="list-tabs"
                >
                    
                    <TabPane tab='投放计划' key="1">
                    <div>
                <GridMain
                        ref={(el) => this.gridOnTheLoan = el} //存模版
                        columns={this.gridColumnOnTheLoan} //字段定义
                        data={this.props.list2} //数据数组
                        //分页对象
                        paginationObj = {{
                            verticalPosition:'none'
                        }}
                        onRowClick={this.onRowSelect}
                        // getSelectedDataFunc={this.getSelectedDataFunc}

                    />
                </div>
                    </TabPane>
                    <TabPane tab='保证金计划' key="2">
                    <div>
                <GridMain
                        ref={(el) => this.gridMarginLoan = el} //存模版
                        columns={this.gridColumnMarginLoan} //字段定义
                        data={this.props.list2} //数据数组                  
                        //分页对象
                        paginationObj = {{
                            verticalPosition:'none'
                        }}
                        onRowClick={this.onRowSelect}

                    />
                </div>
                    </TabPane>
                    <TabPane tab='手续费计划' key="3">
                    <div>
                <GridMain
                        ref={(el) => this.gridCommissionLoan = el} //存模版
                        columns={this.gridColumnCommissionLoan} //字段定义
                        data={this.props.list2} //数据数组                   
                        //分页对象
                        paginationObj = {{
                            
                            verticalPosition:'none'
                        }}
                        
                        onRowClick={this.onRowSelect}

                    />
                </div>

                
                    </TabPane>

                    <TabPane tab='中间费用支出计划' key="4">
                    <div>
                <GridMain
                        ref={(el) => this.gridMiddleCostLoan = el} //存模版
                        columns={this.gridColumnMiddleCostLoan} //字段定义
                        data={this.props.list2} //数据数组
                        //分页对象
                        paginationObj = {{
                            verticalPosition:'none'
                        }}
                        onRowClick={this.onRowSelect}

                    />
                </div>

                
                    </TabPane>

                    <TabPane tab='其他收支计划' key="5">
                    <div>
                <GridMain
                        ref={(el) => this.gridOtherLoan = el} //存模版
                        columns={this.gridColumnOtherLoan} //字段定义
                        data={this.props.list2} //数据数组                       
                        tableHeight={2} //滚动轴高度
                        //分页对象
                        paginationObj = {{
                            verticalPosition:'none'
                        }}
                        onRowClick={this.onRowSelect}

                    />
                </div>

                
                    </TabPane>

                    <TabPane tab='租金计划表' key="6">
                    <div>
                <GridMain
                        ref={(el) => this.gridRentLoan = el} //存模版
                        columns={this.gridColumnRentLoan} //字段定义
                        data={this.props.list2} //数据数组
                        //分页对象
                        paginationObj = {{
                            verticalPosition:'none'
                        }}
                        onRowClick={this.onRowSelect}
                    />
                </div>

                
                    </TabPane>
                    </Tabs>
                </div>
            </div>
                     
        );
    }
}

export default ListView;