<template>
  <el-dialog title="记录信息" :visible.sync="dialogVisable" :close="_close">
    <el-form :model="dialogItem">
      <el-form-item label="类型" :label-width="formLabelWidth">
        <el-select v-model="dialogItem.type" clearable filterable allow-create placeholder="请选择类型" style="width:100%">
          <el-option v-for="item in enumObj.typeList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数量" :label-width="formLabelWidth">
        <el-input v-model="dialogItem.quantity"></el-input>
      </el-form-item>
      <el-form-item label="单价" :label-width="formLabelWidth">
        <el-input v-model="dialogItem.tPrice"></el-input>
      </el-form-item>
      <el-form-item label="总价" :label-width="formLabelWidth">
        <el-input v-model="dialogItem.uPrice"></el-input>
      </el-form-item>
      <el-form-item label="付款人" :label-width="formLabelWidth">
        <el-input v-model="dialogItem.payer"></el-input>
      </el-form-item>
      <el-form-item label="状态" :label-width="formLabelWidth">
        <el-select v-model="dialogItem.state" placeholder="请选择类型" style="width:100%">
          <el-option v-for="item in enumObj.stateList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input v-model="dialogItem.describe"></el-input>
      </el-form-item>
      <el-form-item label="时间" :label-width="formLabelWidth">
        <!-- <el-input v-model="dialogItem.payerTime"></el-input> -->
        <el-date-picker v-model="dialogItem.payerTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width:100%">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="_close">取 消</el-button>
      <el-button type="primary" @click.native="_submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import ENUM from '@/utils/enum'
export default {
  name: 'dialob',
  props: ['isVisable', 'isEdit', 'item'],
  data() {
    return {
      formLabelWidth: '120px',
      dialogItem: { ...this.item },
      dialogVisable: this.isVisable,
      dialogEdit: this.isEdit
    }
  },
  computed: {
    enumObj() {
      return ENUM
    }
  },
  methods: {
    _close() {
      this.$emit('close')
    },
    _submit() {
      this.$emit('update', this.dialogItem)
    }
  },
  watch: {
    isVisable(nVal) {
      this.dialogVisable = nVal
    },
    isEdit(nVal) {
      this.dialogEdit = nVal
    },
    item(nVal) {
      this.dialogItem = nVal
    }
  }
}
</script>

