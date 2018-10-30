<template>
  <div class="record-container">
    <div class="filer-container">
      <el-select v-model="type" size="mini" clearable filterable allow-create placeholder="请选择类型">
        <el-option v-for="item in enumObj.typeList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="state" size="mini" clearable filterable allow-create placeholder="请选择状态">
        <el-option v-for="item in enumObj.stateList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" size="mini" @click.native="_submit">查询</el-button>
      <el-button type="primary" size="mini" @click.native="_recordAdd">添加</el-button>
      <div class="statistics-container">
        <p style="color:#67c23a">
          <span>已支付：</span>
          <span>{{payState.paid.count}}(条) {{payState.paid.sum}}(元)</span>
        </p>
        <p style="color:#e6a23c">
          <span>未支付：</span>
          <span>{{payState.unPaid.count}}(条) {{payState.unPaid.sum}}(元)</span>
        </p>
        <p style="color:#409eff">
          <span>总支出：</span>
          <span>{{payState.all.count}}(条) {{payState.all.sum}}(元)</span>
        </p>
      </div>
    </div>
    <div class="table-container" ref="tableContainer">
      <el-table :data="tableData" v-loading="isLoading" border stripe :height="tbHeight" style="width: 100%">
        <el-table-column prop="type" label="类别">
        </el-table-column>
        <el-table-column prop="quantity" label="数量">
        </el-table-column>
        <el-table-column prop="tPrice" label="单价">
        </el-table-column>
        <el-table-column prop="uPrice" label="总价">
        </el-table-column>
        <el-table-column prop="payer" label="付款人">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>
              {{_columState(scope.row.state)}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="describe" label="描述">
        </el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">
            <span>
              {{_columTime(scope.row.payerTime)}}
            </span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click.native="_recordUpdate(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click.native="_recordDel(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="btn-container">
      <el-pagination @size-change="_sizeChange" @current-change="_currentChange" :current-page="pageObj.page" :page-sizes="[5,10, 20, 30, 40]" :page-size="pageObj.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <record-dialog :isVisable="isVisable" :item="item" :isEdit="isEdit" @close="closeDialog" @update="updateDialog"></record-dialog>
  </div>
</template>

<script>
import ENUM from '@/utils/enum'
import * as RECORD_ACTION from '@/api/record'
import RecordDialog from './subpage/dialog'
export default {
  namd: 'Record',
  components: {
    RecordDialog
  },
  data() {
    return {
      // dialog
      isVisable: false,
      item: {},
      isEdit: false,
      //
      type: '',
      state: '',
      isLoading: false,
      // table
      tableData: [],
      tbHeight: 200,
      // 分页
      pageObj: {
        page: 1,
        pageSize: 40
      },
      total: 0
    }
  },
  computed: {
    enumObj() {
      return ENUM
    },
    // sum() {
    //   let ret = 0
    //   this.tableData.forEach(item => {
    //     ret = ret + item.uPrice
    //   })
    //   return ret
    // },
    payState() {
      let unPaid = this.tableData.filter(item => {
        return item.state == '0'
      })
      console.log('unPaid:', unPaid)
      let unPaidCount = 0
      unPaid.forEach(item => {
        unPaidCount = item.uPrice + unPaidCount
      })

      let paid = this.tableData.filter(item => {
        return item.state == '1'
      })
      let paidCount = 0
      paid.forEach(item => {
        paidCount = item.uPrice + paidCount
      })
      let ret = {
        unPaid: {
          count: unPaid.length,
          sum: unPaidCount
        },
        paid: {
          count: paid.length,
          sum: paidCount
        },
        all: {
          count: unPaid.length + paid.length,
          sum: unPaidCount + paidCount
        }
      }
      return ret
    }
  },
  created() {
    this._getData()
  },
  mounted() {
    this.$nextTick(() => {
      this.tbHeight = this.$refs.tableContainer.offsetHeight
    })
  },
  methods: {
    // table
    _getData() {
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      let params = {
        type: this.type,
        state: this.state,
        ...this.pageObj
      }
      RECORD_ACTION.recordList(params)
        .then(res => {
          let data = res.data
          this.tableData = data.list
          this.total = data.total
        })
        .finally(res => {
          this.isLoading = false
        })
    },
    _columState(state) {
      let ret = ''
      for (let item of this.enumObj.stateList) {
        if (item.value == state) {
          ret = item.label
          break
        }
      }
      return ret
    },
    _columTime(date) {
      let nDate = new Date(date)
      return (
        nDate.getFullYear() +
        '-' +
        (Number(nDate.getMonth()) + 1) +
        '-' +
        nDate.getDate()
      )
    },
    // add update del
    _recordAdd() {
      this.isVisable = true
      this.isEdit = false
      this.item = {}
    },
    _recordUpdate(row) {
      this.isVisable = true
      this.isEdit = true
      this.item = row
    },
    _recordDel(row) {
      if (this.isLoading) {
        return false
      }
      let params = {
        id: row._id
      }
      // this.isLoading = true
      RECORD_ACTION.recordDel(params)
        .then(res => {
          this.pageObj = {
            ...this.pageObj,
            page: 1
          }
          this._getData()
        })
        .finally(res => {
          // this.isLoading = false
        })
    },
    updateDialog(item) {
      if (this.isEdit) {
        this._updateItem(item)
      } else {
        this._addItem(item)
      }
    },
    _addItem(item) {
      console.log('add:', item)
      RECORD_ACTION.recordAdd(item)
        .then(res => {
          console.log('resaaa:', res)
          this._getData()
          this.closeDialog()
        })
        .finally(res => {})
    },
    _updateItem(item) {
      console.log('updateDialog:', item)
      RECORD_ACTION.recordUpdate(item)
        .then(res => {
          console.log('resaaa:', res)
          this._getData()
          this.closeDialog()
        })
        .finally(res => {})
    },
    closeDialog() {
      this.isVisable = false
    },
    // 分页
    _sizeChange(val) {
      this.pageObj.pageSize = val
      this.pageObj.page = 1
      this._getData()
    },
    _currentChange(val) {
      this.pageObj.page = val
      this._getData()
    },
    // filter
    _submit() {
      this.pageObj = {
        ...this.pageObj,
        page: 1
      }
      this._getData()
    }
  }
}
</script>
<style lang="scss" scoped>
.record-container {
  height: calc(100vh - 50px);
  padding: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: column;
  .filer-container {
    .statistics-container {
      p {
        padding: 0px;
        margin: 0;
        margin-top: 10px;
        margin-right: 20px;
        line-height: 25px;
        display: inline-block;
        span {
          // color: #409eff;
          font-weight: bold;
          letter-spacing: 2px;
        }
      }
      // :nth-child(even) {
      //   span {
      //     color: rgb(48, 65, 86);
      //   }
      // }
    }
  }
  .table-container {
    flex: 1;
    margin: 10px 0;
    overflow: hidden;
  }

  .btn-container {
    text-align: center;
  }
}
</style>

