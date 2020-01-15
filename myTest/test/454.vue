<template>
  <div class="vip-price">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item label="菜品名称:">
        <el-input placeholder="菜品名称" v-model="searchForm.fsItemName" />
      </el-form-item>
      <el-form-item label="菜品编号:">
        <el-input placeholder="菜品编号" v-model="searchForm.fsItemId" />
      </el-form-item>
      <el-form-item label="菜品分类:">
        <el-cascader
          expand-trigger="hover"
          :options="classifyList"
          :props="defaultProps"
          v-model="searchForm.fsMenuClsId"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="会员卡:">
        <el-select placeholder="请选择" v-model="searchForm.csId" @change="getLevelList">
          <el-option
            v-for="item in cardList"
            :key="item.csId"
            :label="item.cardName"
            :value="item.csId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="价格范围:">
        <el-select placeholder="会员等级" v-model="searchForm.LevelValue">
          <el-option :value="999" label="原价"></el-option>
          <el-option
            v-for="item in cardLevel"
            :key="item.level"
            :label="item.title"
            :value="item.level"
          ></el-option>
        </el-select>
        <input-price
          minType="MenuPriceMin"
          :priceMin="searchForm.MenuPriceMin"
          maxType="MenuPriceMax"
          :priceMax="searchForm.MenuPriceMax"
          @change-price="onChangePrice"
        />
      </el-form-item>
    </el-form>
    <div class="btn-wrapper">
      <el-button class="btn-search" @click="onClickSearch">搜索</el-button>
      <el-button class="btn-reset" @click="onClickReset">重置</el-button>
    </div>
    <div class="division-line"></div>
    <el-row class="operation-button">
      <!-- 美易点 3.7.1需求暂时隐藏 批量设置 按钮-->
      <!-- <el-button class="btn-primary" :disabled="isMaintain" @click="batchSet">批量设置</el-button> -->
      <div class="select-copy">
        <el-select v-model="copyVIPPrice.parent" placeholder="请选择" class="select-copy-parent">
          <el-option value="1" class="select-copy-parent-option">
            <h3>会员等级</h3>
            <el-radio-group v-model="copyVIPPrice.parent">
              <el-radio v-for="item in realCardsLevel" :key="item.id" :label="item.title"></el-radio>
            </el-radio-group>
            <h3>黑卡权益</h3>
            <el-radio-group v-model="copyVIPPrice.parent">
              <el-radio v-for="item in realCardsLevel" :key="item.id" :label="item.title"></el-radio>
            </el-radio-group>
          </el-option>
        </el-select>

        <span>复制到</span>

        <el-select
          multiple
          value
          :placeholder="copyVIPPrice.children.length > 0 ? `已选择${copyVIPPrice.children.length}个会员等级`: '请选择'"
          :class="`select-copy-parent ${copyVIPPrice.children.length > 0? 'select-copy-child ':''}`"
        >
          <el-option value="1" class="select-copy-parent-option">
            <h3>会员等级</h3>
            <el-checkbox-group v-model="copyVIPPrice.children">
              <el-checkbox v-for="item in realCardsLevel" :key="item.id" :label="item.title"></el-checkbox>
            </el-checkbox-group>
            <h3>黑卡权益</h3>
            <el-checkbox-group v-model="copyVIPPrice.children">
              <el-checkbox v-for="item in realCardsLevel" :key="item.id" :label="item.title"></el-checkbox>
            </el-checkbox-group>
          </el-option>
        </el-select>

        <el-button>复制会员价信息</el-button>
      </div>
      <div class="right-btn">
        <el-button>会员价信息导入</el-button>
        <a>
          <el-button>会员价信息导出</el-button>
        </a>
      </div>
    </el-row>
    <el-table
      :data="viplist.list"
      ref="tablelist"
      border
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <el-table-column type="selection" min-width="50px" />
      <el-table-column prop="itemId" align="center" label="菜品编码" />
      <el-table-column prop="itemName" align="center" label="菜品名称" />
      <el-table-column prop="salePrice" align="center" label="售价" />
      <el-table-column prop="orderUint" align="center" label="规格" />
      <el-table-column prop="menuClsName" align="center" label="分类" />
      <el-table-column
        v-for="item in viplist.vipColumns"
        :key="item.level"
        :label="item.vipPrice"
        align="center"
      >
        <template slot-scope="scope">{{ getProperty(item.level,scope.row, viplist.vipColumns) }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <mw-button
            class="btn-manage"
            content="设置"
            :disabled="isMaintain"
            @click.stop="handleView(scope.$index, scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeSize="onChangeSize"
      :onChangeCurrent="onChangeCurrent"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :totalCount="viplist.recordCount"
      layout="slot, ->, prev, pager, next, sizes"
    ></pagination>
    <popup
      ref="vipSetting"
      type="submit"
      size="small"
      :title="`会员价设置（${cardObj.typeName}）`"
      :handleOk="onSubmit"
    >
      <div slot="content">
        <el-form label-width="90px" :model="collectForm" class="collect-form" ref="collectForm">
          <el-form-item label="菜品编号:" prop="fsItemId">{{ collectForm.fsItemId }}</el-form-item>
          <el-form-item label="菜品名称:" prop="fsItemName">{{ collectForm.fsItemName }}</el-form-item>
          <el-form-item
            label="原价:"
            prop="salePrice"
          >{{ `${collectForm.salePrice}/${collectForm.orderUint}` }}</el-form-item>
          <p
            class="warn-text"
          >说明：会员价“是否”赠送功能为新功能。安卓为V3.0.1（windows V2.8.1）及以上版本设置后生效；老版本设置“赠送”后，执行菜品原价。</p>
          <el-table :data="vipPrices">
            <el-table-column prop="title" align="center" label="会员等级" />
            <el-table-column prop="true" align="center" label="是否赠送">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.switch"
                  @change="(event) => switchChange(event,scope.row)"
                  active-text="是"
                  inactive-text="否"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column align="center" label="价格">
              <template slot-scope="scope">
                <el-input
                  class="price"
                  v-model="scope.row.price"
                  placeholder="价格"
                  :maxlength="8"
                  @blur="(event) => onBlurVipPrice(event, scope.row)"
                  :disabled="scope.row.switch"
                />
                {{ ` / ${collectForm.orderUint}` }}
              </template>
            </el-table-column>
          </el-table>
          <div style="height: 24px;"></div>
          <el-table :data="blackCardList">
            <el-table-column prop="plusName" align="center" label="黑卡权益" />
            <el-table-column prop="true" align="center" label="是否赠送">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.switch"
                  @change="(event) => switchBlackCardChange(event,scope.row)"
                  active-text="是"
                  inactive-text="否"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column align="center" label="价格">
              <template slot-scope="scope">
                <el-input
                  class="price"
                  v-model="scope.row.cpPrice"
                  placeholder="价格"
                  :maxlength="8"
                  @blur="(event) => onBlurBlackCardPrice(event, scope.row)"
                  :disabled="scope.row.switch"
                />
                {{ ` / ${collectForm.orderUint}` }}
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </popup>
    <Toast ref="toast" content="请选择要操作的数据!" :timeout="2000" type="warning" />
    <popup
      ref="batchSetting"
      type="submit"
      size="small"
      :title="`会员价批量设置（${cardObj.typeName}）`"
      :handleOk="() => submitBatchSet()"
    >
      <div slot="content">
        <div>已选择{{ batchForm.menucount }}菜品</div>
        <el-row class="row-setting">
          <el-col :span="8">
            <el-select
              placeholder="会员等级"
              v-model="batchForm.levelValue"
              style="display: inline-block"
            >
              <el-option
                v-for="item in realCardsLevel"
                :key="item.level"
                :label="item.title"
                :value="item.level"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4" style="line-height: 35px;text-align: right; margin-right: 10px">设置为原价</el-col>
          <el-col :span="6">
            <el-input-number
              style="width: 120px;"
              v-model="batchForm.ratio"
              :min="1"
              :max="100"
              :precision="0"
              controls-position="right"
            />
            <span style="line-height: 35px; margin-left: 10px">%</span>
          </el-col>
        </el-row>
      </div>
    </popup>
    <Toast ref="toastVipSetting" :content="vipGiftToastText" :timeout="2000" type="warning" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { Pagination, Popup, MwButton, Toast, InputPrice } from 'components'
import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination'
import { INPUT_MAX_LENGTH } from 'constant/constants'
import cloneDeep from 'lodash/cloneDeep'
import { checkMaintainRight } from 'utils/permissionUtil'
import { cloneObj } from 'utils/someUsefulUtil'
import { REGEX_PRICE } from 'constant/regex'

export default {
  name: 'VipPriceManagerMain',
  components: {
    Toast,
    MwButton,
    InputPrice,
    Popup,
    Pagination,
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      selectedDate: '',
      DEFAULT_PAGE,
      DEFAULT_PAGES,
      INPUT_MAX_LENGTH,
      brandCsId: '',
      searchForm: {},
      defaultProps: {
        value: 'menuClsId',
        label: 'menuClsName',
        children: 'children',
      },
      multipleSelection: [],
      collectForm: {
        fsItemId: null,
        fsItemName: null,
        salePrice: null,
        orderUint: null,
        itemCd: null,
        orderUnitCd: null,
        requestData: [],
      },
      alert_message: '',
      batchForm: {
        menucount: 0,
        levelValue: null,
        cardType: null,
        ratio: 100,
        requestData: [],
      },
      isMaintain: !checkMaintainRight(this),
      vipGiftToastText: '', //会员价表单弹框
      realCardsLevel: [],
      blackCardList: [], //用于接收贺卡权益列表
      vipPrices: [],
      realCsId: '',
      copyVIPPrice: {
        parent: [],
        children: [],
      },
      selectText: '',
    }
  },
  computed: {
    ...mapState({
      errorStatus: state => state.error.errorStatus,
      viplist: state => state.preferential.viplist,
      cardList: state => state.preferential.cardList,
      cardLevel: state => state.preferential.cardLevel,
      vipPriceItem: state => state.preferential.vipItem,
      blackCardItem: state => state.preferential.blackVipItem, //新增黑卡权益列表
      //        vipPrices () {
      //          var result = cloneDeep(this.realCardsLevel);
      //          result = result.map((item,index) => {
      //            item.switch = item.price === 0 ? true : false
      //            if(item.price === null){
      //              item.price = this.collectForm.salePrice
      //            }
      //
      //            return item
      //          })
      //          return result;
      //        },

      classifyList: state => {
        let levelItems = cloneDeep(state.dishes.classify.allClassify)
        levelItems.unshift({ menuClsId: '0', menuClsName: '全部分类' })
        return levelItems
      },
    }),
    //      blackCardList(){
    //        var list = this.blackCardItem.slice() || []
    //        list = list.map((item,index) => {
    //          item.switch = item.cpPrice === 0 ? true : false
    //          if(item.cpPrice === null){
    //            item.cpPrice = this.collectForm.salePrice
    //          }
    //          return item
    //        })
    //        return list
    //      },
    cardObj: function() {
      const obj = (this.cardList || []).find(item => item.csId === this.realCsId) || {}
      let typeName = ''
      if (obj.bindType == 0) {
        typeName = '品牌卡'
      } else if (obj.bindType == 1) {
        typeName = '区域卡'
      } else if (obj.bindType == 2) {
        typeName = '黑卡'
      }
      obj.typeName = typeName
      return obj
    },
  },
  async created() {
    await this.fetchAllClassify()
    // await this.getVIPLevels();
    await this.getCardList()
    this.setDefaultCsId()
    this.initSearchForm()
    await this.getLevelByCard({ csId: this.searchForm.csId })
    this.realCsId = this.searchForm.csId
    this.realCardsLevel = (this.cardLevel || []).slice()
    this.blackCardListCopy = []
    this.getVipList(this.getFormParams())
    console.log(typeof this.realCardsLevel)
    console.log(this.realCardsLevel)
    this.batchForm.levelValue = this.realCardsLevel && this.realCardsLevel.length ? this.realCardsLevel[0].level : null
  },
  mounted() {
    //this.$refs['vipSetting'].isShow = true;
  },
  methods: {
    ...mapActions(['fetchAllClassify', 'getVIPLevels', 'getVipList', 'updateOneVIPBargain', 'bashSetVIPBargains', 'getVipItemDetail', 'getCardList', 'getLevelByCard']),
    initSearchForm() {
      this.searchForm = {
        fsItemName: null,
        fsItemId: null,
        LevelValue: 999,
        MenuPriceMin: null,
        MenuPriceMax: null,
        fsMenuClsId: ['0'],
        csId: this.brandCsId,
      }
    },
    cliackisfe() {
      console.log(this.copyVIPPrice)
    },
    getBindType(csId) {
      let bindType = 0
      if (csId) {
        const obj = this.cardList.find(item => item.csId == csId) || {}
        bindType = obj.bindType
      }
      return bindType
    },
    getLevelList() {
      this.searchForm.LevelValue = 999
      this.pageIndex = 1
      this.getLevelByCard({ csId: this.searchForm.csId })
    },
    setDefaultCsId() {
      const brandCard = (this.cardList || []).find(item => item.bindType == 0) || {}
      this.brandCsId = brandCard.csId || ''
    },
    getFormParams() {
      const { pageIndex, pageSize } = this
      const { fsItemName, fsItemId, LevelValue, MenuPriceMin, MenuPriceMax, fsMenuClsId, csId } = this.searchForm
      return {
        csId: csId,
        bindType: this.getBindType(csId),
        s_level: LevelValue,
        s_lowPrice: MenuPriceMin || null,
        s_highPrice: MenuPriceMax || null,
        s_itemName: fsItemName,
        s_itemId: fsItemId || null,
        s_menuClsId: fsMenuClsId.toString() === '0' || fsMenuClsId.toString() === '' ? null : fsMenuClsId[fsMenuClsId.length - 1],
        pageIndex,
        pageSize,
      }
    },
    switchChange(event, row) {
      //console.log(event)
      console.log(row)
      console.log(process)

      row['switch'] = event
      if (event) {
        row['price'] = 0
      } else {
        row['price'] = this.collectForm.salePrice
      }
    },
    switchBlackCardChange(event, row) {
      //黑卡设置
      console.log(row)
      row['switch'] = event
      if (event) {
        row['cpPrice'] = 0
      } else {
        row['cpPrice'] = this.collectForm.salePrice
      }
    },
    async onClickSearch() {
      this.realCardsLevel = (this.cardLevel || []).slice()
      this.realCsId = this.searchForm.csId
      this.batchForm.levelValue = this.realCardsLevel && this.realCardsLevel.length ? this.realCardsLevel[0].level : null
      await this.getVipList(this.getFormParams())
    },
    async onClickReset() {
      this.initSearchForm()
      this.realCsId = this.searchForm.csId
      await this.getLevelByCard({ csId: this.searchForm.csId })
      this.realCardsLevel = (this.cardLevel || []).slice()
      this.batchForm.levelValue = this.realCardsLevel && this.realCardsLevel.length ? this.realCardsLevel[0].level : null
      await this.getVipList(this.getFormParams())
    },
    async onChangeSize(pageSize) {
      this.pageIndex = 1
      this.pageSize = pageSize
      let postParameter = this.getFormParams()
      await this.getVipList(postParameter)
    },
    async onChangeCurrent(pageIndex) {
      this.pageIndex = pageIndex
      let postParameter = this.getFormParams()
      await this.getVipList(postParameter)
    },
    onChangePrice(value, type) {
      this.searchForm[type] = value
    },
    onBlurVipPrice(event, row) {
      const { value } = event.target
      row['price'] = REGEX_PRICE.test(value) ? value : this.collectForm.salePrice
    },
    onBlurBlackCardPrice(event, row) {
      //黑卡设置
      const { value } = event.target
      row['cpPrice'] = REGEX_PRICE.test(value) ? value : this.collectForm.salePrice
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleRowClick(row, event, column) {
      this.$refs.tablelist.toggleRowSelection(row)
    },
    async handleView(index, row) {
      const { itemId, itemName, salePrice, orderUint, itemCd, orderUintCd } = row
      const csId = this.realCsId
      await this.getVipItemDetail({
        itemCd,
        orderUnitCd: orderUintCd,
        csId,
        bindType: this.getBindType(csId),
      })
      this.collectForm = {
        ...this.collectForm,
        fsItemId: itemId,
        fsItemName: itemName,
        orderUnitCd: orderUintCd,
        salePrice,
        orderUint,
        itemCd,
      }
      //console.log(this.vipPrices)
      //        this.vipPrices.map(item => {
      //          const vipItem = (this.vipPriceItem || []).find(data => data.title === item.title);
      //          //item.price = vipItem ? vipItem.vipprice : null;
      //          item.price = vipItem.vipprice;
      //          item.switch = vipItem.vipprice === 0 ? true : false
      //          if(item.price === '' || item.price === null){
      //            item.price = this.collectForm.salePrice
      //          }
      //        });

      this.vipPrices = cloneObj(this.vipPriceItem || []).map(item => {
        item.price = item.vipprice
        item.switch = item.vipprice === 0 ? true : false
        if (item.price === '' || item.price === null) {
          item.price = this.collectForm.salePrice
        }
        return item
      })

      this.blackCardList = cloneObj(this.blackCardItem || []).map((item, index) => {
        item.switch = item.cpPrice === 0 ? true : false
        if (item.cpPrice === null) {
          item.cpPrice = this.collectForm.salePrice
        }
        return item
      })

      this.$refs['vipSetting'].isShow = true
    },
    getProperty(type, row, test) {
      //console.log(type,row)
      if (!row.vipList) {
        return ''
      }

      let result = row.vipList.filter(x => x.level == type)
      if (result && result.length) {
        return result[0].vipPrice
      }
      //        else{
      //          return row.salePrice;
      //        }
      return ''
    },
    async onSubmit() {
      let itemCd = this.collectForm.itemCd
      let orderUintCd = this.collectForm.orderUnitCd
      let requestData = []
      let cpRequestData = [] //黑卡
      for (var i = 0; i < this.vipPrices.length; i++) {
        const { level, price } = this.vipPrices[i]
        if (price === '' || price === null || price === undefined) {
          this.vipGiftToastText = '会员价不允许为空'
          this.$refs.toastVipSetting.isShow = true
          return
        }
        //console.log(typeof price)
        //          if(typeof price !== 'number'){
        //            this.vipGiftToastText = "请输入正确的会员价"
        //            this.$refs.toastVipSetting.isShow = true;
        //            return
        //          }
        if (!this.vipPrices[i].switch && price <= 0) {
          this.vipGiftToastText = '菜品非赠送时价格不允许为0'
          this.$refs.toastVipSetting.isShow = true
          return
        }

        requestData.push({ level, vipprice: price })
      }

      for (var i = 0; i < this.blackCardList.length; i++) {
        const { cpPrice, cpId } = this.blackCardList[i]
        if (cpPrice === '' || cpPrice === null || cpPrice === undefined) {
          this.vipGiftToastText = '黑卡权益出售价格不允许为空'
          this.$refs.toastVipSetting.isShow = true
          return
        }
        if (!this.blackCardList[i].switch && cpPrice <= 0) {
          this.vipGiftToastText = '菜品非赠送时价格不允许为0'
          this.$refs.toastVipSetting.isShow = true
          return
        }

        cpRequestData.push({ cpId, cpPrice })
      }

      const { csId } = this.searchForm
      await this.updateOneVIPBargain({
        itemCd,
        orderUintCd,
        requestData,
        cpRequestData,
        csId,
        bindType: this.getBindType(csId),
      })
      await this.getVipList(this.getFormParams())
      this.$refs['vipSetting'].isShow = false
    },
    batchSet() {
      if (!this.multipleSelection.length) {
        this.$refs.toast.isShow = true
        return
      }
      this.batchForm.menucount = this.multipleSelection.length
      this.$refs['batchSetting'].isShow = true
    },
    async submitBatchSet() {
      if (!this.multipleSelection.length) {
        this.$refs.toast.isShow = true
        return
      }
      const requestData = []
      this.multipleSelection.map(item => {
        requestData.push({
          itemCd: item.itemCd,
          orderUintCd: item.orderUintCd,
          srcPrice: item.salePrice,
        })
      })
      const { levelValue, ratio } = this.batchForm
      const { csId } = this.searchForm
      await this.bashSetVIPBargains({
        csId,
        bindType: this.getBindType(csId),
        level: levelValue,
        rate: ratio / 100,
        requestData,
      })
      await this.getVipList(this.getFormParams())
      this.$refs['batchSetting'].isShow = false
      this.batchForm = { levelValue: this.cardLevel[0].level, ratio: 100 }
    },
  },
}
</script>

<style lang="scss">
.select-copy-parent-option {
  height: auto;
  // }
}
.vip-price {
  padding: 15px;

  .btn-wrapper {
    margin: 15px 0;
    text-align: center;
  }

  .input-price {
    width: 225px;
  }

  .collect-form {
    .el-form-item {
      margin-bottom: 0;
    }

    .el-table .el-table__body .cell {
      display: flow-root;
    }
  }

  .search-bar {
    .el-form-item {
      margin-bottom: 10px;
    }
  }

  .price {
    width: 80px;
  }

  .operation-button {
    padding: 10px 0;
    .select-copy {
      float: left;
      display: block;
      .select-copy-child {
        input::-webkit-input-placeholder {
          color: #606266;
        }
        input::-moz-placeholder {
          color: #606266;
        }
        input::-moz-placeholder {
          color: #606266;
        }
        input::-ms-input-placeholder {
          color: #606266;
        }
      }
      span {
        padding-left: 10px;
        padding-right: 10px;
      }
      button {
        margin-left: 10px;
      }
    }
    .right-btn {
      float: right;
      display: block;
    }
  }

  .base-modal .el-dialog--small {
    padding: 0 30px;

    .row-setting {
      margin: 20px 0;
    }
  }
}
.warn-text {
  padding: 6px 12px;
  color: red;
  line-height: 24px;
}
</style>
