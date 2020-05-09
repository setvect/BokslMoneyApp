// =======================================
// ======= 0. 모듈 개발           ========
// =======================================


// main process

import { ipcMain } from "electron";
import codeMain from "../../model/codeMain-vo";
import codeItem from "../../model/codeItem-vo";
import connSeque from "../../model/connSeque.js";
import { QueryTypes } from "sequelize";

export default {
  init() {
    // ================ 조회 ================
    // 메인 코드 목록
    ipcMain.handle("code/listMain", async (event) => {
      const result = await codeMain.findAll({
        where: {
          deleteF: false,
        },
        attributes: ["codeMainId", "name"],
        raw: true,
      });
      return result;
    });

    // 메인코드에 대한 코드 항목 목록
    ipcMain.handle("code/listItem", async (event, code) => {
      const result = await codeItem.findAll({
        where: {
          deleteF: false,
          codeMainId: code,
        },
        order: ["orderNo"],
        raw: true,
      });

      return result;
    });

    // ================ 등록 ================
    // 메인코드에 대한 코드 항목 목록
    ipcMain.handle("code/addItem", async (event, item) => {
      const records = await connSeque.query(
        "select ifnull(max(c.CODE_ITEM_SEQ), 0) + 1 as cnt from CB_CODE_ITEM c where c.CODE_MAIN_ID = $codeMainId",
        {
          bind: { codeMainId: item.codeMainId, },
          type: QueryTypes.SELECT,
        }
      );

      item.codeItemSeq = records[0].cnt;
      item.deleteF = false;
      const instance = await codeItem.create(item);
      return instance;
    });

    ipcMain.handle("account/addItem", async(event, item) => {
      item.deleteF = false;
      const instance = await account.create(item);
      return instance;
    });

    // ================ 수정 ================
    // 정보 수정
    ipcMain.handle("code/editItem", async (event, item) => {
      const saveItem = await codeItem.findOne({
        where: {
          codeMainId: item.codeMainId,
          codeItemSeq: item.codeItemSeq,
        },
      });
      saveItem.name = item.name;
      await saveItem.save();
    });

    ipcMain.handle("account/editItem", async(event, item) => {
      const saveItem = await account.findByPk(item.accountSeq);
      console.log('saveItem :>> ', saveItem);
      await saveItem.update(item);
    });

    // 정렬 변경
    ipcMain.handle("code/changeOrder", async (event, param) => {
      const downItem = await codeItem.findOne({
        where: {
          codeMainId: param.codeMainId,
          codeItemSeq: param.downCodeItemSeq,
        },
      });
      const upItem = await codeItem.findOne({
        where: {
          codeMainId: param.codeMainId,
          codeItemSeq: param.upCodeItemSeq,
        },
      });

      const temp = downItem.orderNo;
      downItem.orderNo = upItem.orderNo;
      upItem.orderNo = temp;
      await downItem.save();
      await upItem.save();
    });
    ipcMain.handle("category/changeOrder", async(event, param) => {
      console.log('param :>> ', param);
      const downItem = await category.findByPk(param.downCategorySeq);
      const upItem = await category.findByPk(param.upCategorySeq);

      const temp = downItem.orderNo;
      downItem.orderNo = upItem.orderNo;
      upItem.orderNo = temp;
      await downItem.save();
      await upItem.save();
    });

    // ================ 삭제 ================
    ipcMain.handle("code/deleteItem", async (event, item) => {
      const saveItem = await codeItem.findOne({
        where: {
          codeMainId: item.codeMainId,
          codeItemSeq: item.codeItemSeq,
        },
      });
      saveItem.deleteF = true;
      saveItem.save();
    });
  },
};



// renderer process
import ElectronUtil from "../../common/electron-util"

ElectronUtil.invoke('code/listItem', this.currentMainCode, result => {
  this.itemList = result;
})

// 등록 또는 수정
addAction() {
  this.$validator.validateAll().then(result => {
    if (!result) {
      return;
    }
    this.formItem.codeMainId = this.currentMainCode;
    if (this.actionType == "add") {
      ElectronUtil.invoke('code/addItem', this.formItem, () => {
        $("#addItem").modal("hide");
        this.list();
      });
    } else {
      ElectronUtil.invoke('code/editItem', this.formItem, () => {
        $("#addItem").modal("hide");
        this.list();
      });
    }
  });
},













// =======================================
// ======= 1. 일반적인 자바스크립 ========
// =======================================

// === map iterator
var m = new Map();
m.set(1, "black");
m.set(2, "red");
m.set("colors", 2);
m.set({x:1}, 3);

m.forEach(function (item, key, mapObj) {
    document.write(item.toString() + "<br />");
});



var obj = {
  "flammable": "inflammable",
  "duh": "no duh"
};
$.each( obj, function( key, value ) {
  alert( key + ": " + value );
});

// keys = ['a', 'b', 'c']
$.each( keys, function(idx, key) {
  console.log(key);
});

// === object에서 map 함수 사용
// json 객체는 안 됨
var a = Object.keys(this.mergeInstance).map(function(uri){
  return uri;
}).join("<br/>");
console.log(a);

// jquery 활용
var roleName = $.map(userRole, function(value){
  return value.role;
});

var keys = $.map(statData, function(value,key) {return key});


// reduce 사용 #1
var allLink = this.menuList.reduce(function(acc, menu){
  var m = menu.submenu.map(function(submenu){return submenu.link;})
  return acc.concat(m);
}, []);

// reduce 사용 #2
var baseProperty = ['rdf:type','rdf:type'];
var rtnValue = this.item.statements.reduce(function(acc, property){
  var m = Object.keys(property)[0]; // object값에서 key를 가져옴
  return acc.concat(m);
}, baseProperty);
return rtnValue;

// array map join
[
  {name: "Joe", age: 22},
  {name: "Kevin", age: 24},
  {name: "Peter", age: 21}
].map(e => e.name).join(",");

// FormData 로그 찍는 방법
var formData = new FormData();
formData.append('key1', 'value1');
formData.append('key2', 'value2');

// Display the key/value pairs
for (var pair of formData.entries()) {
  console.log(pair[0]+ ', ' + pair[1]);
}

// FormData에 항목 하나를 array로 넘기고 싶을 때
var formData = new FormData();
$.each(this.mergeInstance, function(key, value){
  formdata.append("mergeUri", key);
});

// Object Size
var size = Object.keys(myObj).length;

// object를 querystring 변경
var param = 	projectSeq : this.$route.query.searchProjectSeq, targetUri: this.removeUri})

var formdata = $.param(self.item, true);
axios.post(CommonUtil.getContextRoot() + url, formdata).then(function(result){
  ...
}

axios.get(CommonUtil.getContextRoot() + '/kbcuration/stat/statCurator.json?' + $.param(param, true)).then(function(result){
  ...
}
\
// object 속성 제거. 삭제
delete object.property
delete object['property']

// deep copy, 깊은 복사
var bar = $.extend(true, {}, foo);

// javascript timestamp to date
var date = new Date(unix_timestamp*1000);

// javascript parseLong
var d = new Date(Number(key));

// javascript array element position
var fruits = ["Banana", "Orange", "Apple", "Mango"];
var a = fruits.indexOf("Apple");

// stream map 사용하기
self.typeList = result.data.map(function(typeUri){
return {uri: typeUri, label: ""};
});

// IE11는 prototype에 정의 되어야 함.
"aaa".startsWith("a");
"12345".endsWith("45");


setTimeout(function(){ alert("Hello"); }, 3000);


// filter와 map의 조합
var targetInstnaceSeqList = this.listCuratorInstance.list.filter(function(item){
// contains
return item.status == "COMPLETE" &&  self.selectInstance.includes(item.instanceSeq);
}).map(function(item){
return item.instanceSeq;
});



// ---------- 시간 계산 ----------

// 두 시간 차이 계산
var diffTime = new Date(endDate - startDate) ;
// GMT 0에 맞추어서 계산
diffTime = new Date(diffTime.valueOf() + diffTime.getTimezoneOffset() * 60000)
return diffTime.format("HH시mm분ss초").replace("00시", "").replace("00분", "").replace("00초", "");

// 배열 삭제
배열.splice(인덱스,1);
var array = [0, 1, 2, 3, 4, 5];
array.splice(2, 1);
//array에는 세번째 요소가 빠진 상태가 된다.
[0, 1, 3, 4, 5]

Number.MAX_VALUE


// =======================================
// ========= 2. vue.js와 관련된 ==========
// =======================================



// json 구조로 데이터 보내기
var json = JSON.stringify(self.item);
waitingDialog.show('처리 중입니다.', {dialogSize: 'sm'});
axios.post(CommonUtil.getContextRoot() + url, json, { headers: {
  'Content-type': 'application/json; charset=utf-8',
}}).then(function(result){
  var param = $.extend(true, {}, self.$route.query);
  if(self.$route.query.mode == 'add'){
    // 새로운 등록이면 첫 페이지 부터
    param["startCursor"] = 0;
  }
  self.$router.push({path: "/list", query: param});
}).catch(function (err) {
  CommonUtil.alertDialogDetail(err);
}).finally (function(){
  waitingDialog.hide();
});

  -- 자바에서 받을 때
  @RequestMapping(value = "/updateProject.do", method = RequestMethod.POST)
  @ResponseBody
  public ResponseEntity<Boolean> updateProject(@RequestBody final ProjectVo project) {
    ..
  }

// 일반적인 get 호출

var projectSeq = CommonUtil.getCurrentProject();
var param = {searchProjectSeq: projectSeq, dateType: this.period, baseDate: baseDate};
waitingDialog.show('조회 중입니다.', {dialogSize: 'sm'});
axios.get(CommonUtil.getContextRoot() + '/kbcuration/stat/statInstance.json', {params:param}).then(function(result){
  var statData = result.data;
  // 처리 ....
}).catch(function (err) {
  CommonUtil.alertDialogDetail(err);
}).finally (function(){
  waitingDialog.hide();
});



// promise 처리 ajax chain
axios.get(CommonUtil.getContextRoot() + '/user/listRole.json').then(function(result){
  self.roleList = result.data;
  // 모든 프로젝트 목록 불러 오기
  return axios.get(CommonUtil.getContextRoot() + '/project/listProject.json', {params: {returnCount: 99999}});
}).then(function(result){
  self.projectList = result.data.list;
  callback();
}).catch(function (err) {
  CommonUtil.alertDialogDetail(err);
});


// 복잡한 promise 처리
var validation;
// RESOURCE 타입인경우 입력가능한 URI인지 체크함.
if(self.item.datatype == DATATYPE_RESOURCE){
  validation = axios.get(CommonUtil.getContextRoot() + '/kbcuration/build/validateUri.do', {params:{projectSeq : self.$route.query.searchProjectSeq, uri: self.item.object}});
}
else{
  // skip 통과
  validation = new Promise(function(resolve, reject) { resolve({data: true}); });
}
waitingDialog.show('처리 중입니다.', {dialogSize: 'sm'});

validation.then(function(result){
  if(!result.data){
    alert("입력가능한 URI가 아닙니다.");
    return Promise.reject('user cancelled');
  }
  return axios.post(CommonUtil.getContextRoot() + '/kbcuration/build/addTriple.do', formdata);
}).then(function(result){
  $('._addTripleForm').off('hidden.bs.modal');
  $('._addTripleForm').modal('hide');
  self.$route.query.reload = true;
  self.$router.push({path: '/edit', query: $.extend(true, {}, self.$route.query)});
}).catch(function (err) {
  if(err === "user cancelled"){
    return;
  }
  CommonUtil.alertDialogDetail(err);
}).finally (function(){
  waitingDialog.hide();
});


// 새창
var routeData = this.$router.resolve({ path: '/read', query: this.$route.query});
window.open(routeData.href, '_blank');


// disabled 처리 readonly
<input type="text" :disabled="validated == 1">
// checkbox bind
<input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
// radio bind
<input type="radio" id="one" value="One" v-model="picked">


//v-for를 이용한 동적 옵션 렌더링
<select v-model="selected">
  <option v-for="option in options" v-bind:value="option.value">
    {{ option.text }}
  </option>
</select>
<span>Selected: {{ selected }}</span>

<select style="width: 200px;" v-model="mySparql">
  <option :value="{}">==SPARQL 쿼리문==</option>
  <option v-for="option in mySparqlList" :value="option">
    {{ option.name }}
  </option>
</select>



// loop
<tr v-for="(item, index) in page.list">
  <td>{{getSeq(index)}}</td>
  ...
</tr>

<tr v-for="(item, key, index) in mapData">
</tr>

// disabled 처리
<input type="text" :disabled="validated == 1">


// checkbox boolean 처리
<input type="checkbox" id="checkbox" v-model="checked">
<label for="checkbox">{{ checked }}</label>

// 숫자 타입으로 입력
<input v-model.number="age" type="number">
// boolean 타입
<input type="checkbox" value="true" class="no-margin" v-model.boolean="inferred" >


// components 설정 컴포넌트
const instanceSearchComponent = Vue.component("instanceSearchForm", { template: '#instance-search',
  data : function(){
    return {
      ...
    }
  },
  methods: {
    // object 값 변경 이벤트
    setObject: function(value){
      this.$emit('@change-object', value)  // 꼭 하이픈(-)으로 처리
    },
  },
});
// 사용하는 쪽
const addTripleComponent = Vue.component("addTripleForm", { template: '#kbcuration_build_edit_trple_add',
  data: function(){
    ...
  }
  },
  components: {
    'instance-search': instanceSearchComponent
  },
  methods: {
    // object 값 대입
    setObject: function(value){
      ...
    },
  }
}

<instance-search v-show="isResourceInput()" v-on:@change-object="setObject"/>

<detail-search-form :open="dtlPopupOpen" v-on:option="detailSearchOption" v-on:close="closeDtlPopup" ></detail-search-form>
 - open -> pros

  const app = new Vue({
    components: {
      'schemaEdit': schemaEditComponent  <= 카멜케이스
    },
    ...
  });

 이런식으로 kebab case를 사용해야됨. => <schema-edit type='property'>

  // 아래 두개 차이 있음
  props: {
    type: String,
    load: Boolean,
  },
  <schema-edit type='property' :load.boolean='true'> <== 됨
  <schema-edit type='property' load.boolean='true'>  <== 안됨


  // props에 데이터 type에 맞추어 값 대입하기
  props: {
    // 스키마 편집 모드 여부
    schema: {
      default: false,
      type: Boolean,
    }
  }

  <!-- integer 없음 -->
  props: {
    totalCount: Number
  },


  방법1:
    <router-view :schemaMode="true"/>

  방법2:
    <router-view :schemaMode="schemaMode"/>
    data: function(){
      return {
        ...
        schemaMode: true,
        ...
      };
    },

  참고로
  <router-view schemaMode.boolean="true"/>
  이렇게 하면 안된다. 에러도 안 난다.

 // props 전달, 받기
const addComponent = Vue.component("addForm", { template: '#board-add',
  props: ['type'],
  ...
});
// 컴포넌트 사용하는 쪽에서 props 전달
<router-view type="<%=request.getAttribute("type")%>"></router-view>


// 부모 컴포넌트에서 자식 컴포넌트에 있는 메소드 호출
<schema-edit ref="propertyEditor" type='Property'>
this.$refs.propertyEditor.loadSchema();



// 라우터에서 이벤트 전달 및 처리
// 1. 이벤트 받는 쪽
addTriple: function(property){
  this.$router.push({ path: '/edit/addTriple', query: this.$route.query});

  var self = this;

  // 이벤트 처리
  this.$on('addTriple', function(tripleData){
    var formdata = $.param(tripleData, true);
    waitingDialog.show('처리 중입니다.', {dialogSize: 'sm'});
    axios.post(CommonUtil.getContextRoot() + '/kbcuration/build/addTriple.do', formdata).then(function(result){
      $('._addTripleForm').off('hidden.bs.modal');
      $('._addTripleForm').modal('hide');
      self.readInstance();
    }).catch(function (err) {
      CommonUtil.alertDialogDetail(err);
    }).finally (function(){
      waitingDialog.hide();
    });
  });
},

// 2. 이벤트 보내는 쪽
onSubmit: function(){
  var self = this;
  this.$validator.validateAll().then(function(result){
    if(!result){
      return;
    }

    // .. 생략 ..

    self.$parent.$emit('addTriple', self.item);  <==  $parent 빼먹지 말자
  });
}


// 이벤트버스 이용
const EventBus = new Vue();
// 이벤트 받아들이는 곳
EventBus.$on("addInstanceItem", function(instanceData){
  // ...
})
// 이벤트 발생시키는 곳
EventBus.$emit('addInstanceItem', self.targetInstance);


// 값과 모델을 따로 관리
<input type="checkbox" v-bind:value="item" v-model="page1InstanceSelect"/>


// click하고 change 차이
<input type="checkbox" v-model="page1InstanceAllSelect" @click="allSelect(this)"/> //page1InstanceAllSelect 값이 변경 전에 이벤트 발생
<input type="checkbox" v-model="page1InstanceAllSelect" @change="allSelect(this)"/> //page1InstanceAllSelect 값이 변경 후 이벤트 발생



// checkbox 전체 선택
<input type="checkbox" v-model="page1InstanceAllSelect" @change="allSelect()"/>
watch: {
  // 검색된 항목 선택 여부에 따라 전체 선택 체크 박스 표시 여부 결정
  page1InstanceSelect(newVal, oldVal){
    if(this.page1InstanceSelect.length == 0){
      return;
    }
    this.page1InstanceAllSelect = this.page1Instance.list.length === this.page1InstanceSelect.length;
  }
},

// 프로퍼티 변경사항 감지
watch: {
  item: {
    handler(newVal, oldVal){
      // do stuff
      console.log("old: %s, new :%s", oldVal, newVal);
    },
    deep: true
  }
},

// object 속성값 감지
watch: {
  'item.datatype': function (newVal, oldVal){
    console.log("old: %s, new :%s", oldVal, newVal);
  }
},
※ 반드시 해당 속성은 초기값이 있어야 함. item: {object:"", datatype:""},

// 아래처럼 속성값 변경사항도 watch로 감시할 수 있음
<schema-edit type='property' :load='propertyLoad'>




// 검색된 전체 항목 선택 또는 취소
allSelect: function(v){
  this.page1InstanceSelect = this.page1InstanceAllSelect ? this.page1Instance.list : [];
},

// computed 사용
computed: {
  displayValue: function(){
    return this.show ? 'block' : 'none';
  }
},


// native event object 넘기기 => $event 사용
<input type="radio" name="datatype" value="http://www.w3.org/2000/01/rdf-schema#Resource" v-model="item.datatype" @click="setting($event)">


// 검색 파라미터 초기화
beforeMount: function(){
  this.$route.query.searchLabel = "";
  this.$route.query.orderField = "Uri";
  this.$route.query.orderAsc = true;
},


// validation 처리
this.$validator.validateAll().then(function(result){
  if(!result){
    return;
  }
  waitingDialog.show('처리 중입니다.', {dialogSize: 'sm'});
  var formData = new FormData();
  formData.append('content', self.editor.getValue());
  formData.append('name', self.mySparqlName);
  axios.post(CommonUtil.getContextRoot() + "/sparql/addMySparql.do", formData).then(function(result){
    self.loadMySparql();
  }).catch(function (err) {
    CommonUtil.alertDialogDetail(err);
  }).finally (function(){
    waitingDialog.hide();
    $("#mySparqlSave").modal("hide");
  });
});

// enter key 엔터키 때문에 validation check 하는 거 방지
<input type="text" class="form-control" placeholder="label search..." v-model="searchWord"  v-on:keyup.13="search()" @keydown.enter.prevent="">


// custom validation 커스텀. 열라 복잡해 보이지만 생각보다 단순함.
// 1. 선언
created() {
  // 커스텀 validation
  this.$validator.extend('notEquals', {
    getMessage: function (field, args) {
      return '같은 계좌를 지정할 수 없습니다.';
    },
    validate: function (value, args) {
      return value != args[0];
    }
  });
},

//2. 사용
<select class="form-control" v-model="item.receiveAccount" name="receiveAccount" v-validate="{ required: true, notEquals: this.item.payAccount }" data-vv-as="수입계좌 " :disabled="disableReceive">


// 디렉티브
directives: {
  'multi-select': {
    componentUpdated: function(el){
      $('.selectpicker').selectpicker('refresh');
    }
  }
},
<select v-multi-select class="selectpicker _select-curator" multiple title="큐레이터 선택" data-width="auto" data-actions-box="true" v-model="curatorStatUser">
  <option v-for="curator in curators" v-bind:value="curator.userId">
  {{curator.userId}}({{curator.name}})
  </option>
</select>


// DOM 갱신 이후 발생한 이벤트. v-for loop last event. 이해 안되면 nextTick로 구글링해봐.
this.$nextTick(() => {
  let selectIdx = $("._mainItemSelect").prop('selectedIndex');
  if (selectIdx == -1) {
    $("._mainItemSelect option:eq(0)").prop("selected", true);
    this.selectMainItem = this.mainList[0];
    this.reset();
  }
})


// 이벤트 전파 취소
@click.prevent="handleClick"



// 컴포넌트(component)
// 선언
Vue.component('datepicker', {
  template: '<input/>',
  mounted: function () {
    var self = this;
    $(this.$el).datepicker({
      dateFormat: "yy-mm-dd",
      onSelect: function (d) { self.$emit('update-date', d) }
    });
  },
  beforeDestroy: function () { $(this.$el).datepicker('hide').datepicker('destroy') }
});

// 사용
<datepicker @update-date="updateDate" class="form-control" name="name" v-model="item.name"
  v-validate="'required'" data-vv-as="이름 " readonly="readonly" v-once></datepicker>

// 외부에서 vue.js data 객체 접근
app.$data.checkedHealths



// axios.get에서 arrayList parameter 보내기
axiosMethod = axios.get;
let paramParsing = option.paramParsing || false;
if (paramParsing) {
  let searchParams = new URLSearchParams($.param(param, true));
  sendParam = { params: searchParams };
  console.log('sendParam :', sendParam);
} else {
  sendParam = { params: param };
}\





// ================== vuex ==================
import Vuex from 'vuex'

Vue.use(Vuex)

const store1 = new Vuex.Store({
state: {
  count: 0
},
mutations: {
  increment(state) {
    state.count++;
    console.log('state.count :', state.count);
  }
}
});
new Vue({
el: "#app",
store: store1,
components: {
  list: listComponent,
  add: addComponent,
  read: readComponent
}
});






//=======================================
//========= 3. 라이브러리 사용 ==========
//=======================================

// moment.js 포메팅
var date = moment("2014-02-27T10:00:00").format('DD-MM-YYYY');
var dateMonthAsWord = moment("2014-02-27T10:00:00").format('DD-MMM-YYYY');

// Date로 변환
moment().toDate();

// bootstrap-datetimepicker객체 가져오기
$('#datetimepicker6').data("DateTimePicker")
baseDate = $("#datetimepicker1").data("datetimepicker").getDate(); ==> 안 됨
// 포기하고 다른 방법
$("#datetimepicker1").find("input").val();

// 날짜 포맷 체크
alert(moment("05/22/2012", 'MM/DD/YYYY',true).isValid()); //true


// moment를 초기화 한다
var m = moment();
var output = m.format("YYYY년MM월DD일 HH:mm:ss dddd");
console.log(output);  // => 2016년07월12일 12:34:56 Wednesday

// 현재시각
moment();

// 밀리 초로 지정
moment(1368543600000);
// 타임스탬프(초)로 지정
moment.unix(1368543600);
// Date.parse에서 해석 가능한 문자열로 지정
moment("June 12, 2016");
// Date오브젝트로부터 초기화
moment(new Date(2016, 7, 12));
// 배열로부터 초기화
moment([2016, 7, 12]); // ※month는 -1한 값을 지정
// 다른 moment오브젝트로부터 초기화
moment(moment([2016, 7, 12]));

// 제2 인수로 입력값 포맷을 지정하여 초기화
moment("12-07-2016", "DD-MM-YYYY");
moment("20160712", "YYYYMMDD");
moment("2016년07월12일", "YYYY년MM월DD일"); // 실제로는"YYYYMMDD"만으로 지정해도 된다.
moment(1368543600 + "", "X");

var m = moment();

// format을 지정하여 출력
m.format("YYYY년MM월DD일 ddd");

// 각 단위 메소드
m.year();    // 년
m.month();   // 월 ※ 0〜11의 값
m.date();   // 일
m.day();    // 요일
m.hours();    // 시
m.minutes();  // 분
m.seconds();  // 초
m.milliseconds();  // 밀리 초

//moment 오브젝트의 클론 생성

var baseMoment = moment();
var cloneMoment = baseMoment.clone();

// ▷ 날짜A가 날짜B보다 미래인지 체크
var momentA = moment([2016, 3, 1]);
var momentB = moment([2016, 5, 1]);
momentA.isAfter(momentB); // => false

// ▷ 지정한 날이 존재하는지 확인
moment("2016-02-30", "YYYY-MM-DD").isValid(); // => false

// ▷ 오늘부터 30일 후의 날짜 취득
moment().add(30, "days").format("YYYY년MM월DD일"); // => 2016년08월11일

// set function
moment().set('year', 2013);
moment().set('month', 3);  // April
moment().set('date', 1);
moment().set('hour', 13);
moment().set('minute', 20);
moment().set('second', 30);
moment().set('millisecond', 123);

moment().set({'year': 2013, 'month': 3});

// 타임스탬프, timestamp
moment().valueOf()

moment().toDate();








// chartjs destory
if(self.instanceChart.destroy != null){
  self.instanceChart.destroy();
}
var ctx = document.getElementById("statistics-recent-canvas").getContext("2d");
self.instanceChart = new Chart(ctx, {
  type: 'bar',
  data: chartData,
  options: {
  }
});




// 쿠키
$.cookie('name', 'value');
$.cookie('name', 'value', { expires: 7, path: '/' });

$.cookie('name'); // => "value"
$.cookie('nothing'); // => undefined
$.cookie(); // => { "name": "value" }

$.removeCookie('name'); // => true     <-- 잘 안됨
$.removeCookie('nothing'); // => false


// data 값으로 셀렉트
$("ul[data-group='Companies'] li[data-company='Microsoft']") //Get all elements with data-company="Microsoft" below "Companies"

// 선택된 node로 스크롤 위치 이동
$(window).scrollTop($('a#captchaAnchor').position().top);

node.css("backgroundColor", "pink");
node.animate({ backgroundColor: "none" }, 1000);

// 백그라운드 색 변경 -> 다시 원래대로
node.css("backgroundColor", "pink");
node.animate({ backgroundColor: "rgb(255, 255, 255, 0);" }, 1000); // <--- 흰색으로 변하지만 투명도가 0이기 때문에 배경이 없는 효과


// jquery input checkbox 체크 여부
$("._newWindow").is(":checked")
checkbox 선택된 갯수 : $('input:checkbox[name="checkbox_name"]:checked').length


VueUtil.post(url, this.item, (result) => {
  $("#addItem").modal('hide');
  EventBus.$emit('listEvent');
});

VueUtil.get("/hab/account/list.json", {}, (result) => {
  this.accountList = result.data;
});


// ===========================================
// lodash.js
// ===========================================

// 2중 group by
let transactionGroupDate = _.chain(transactionSet)
.groupBy('date')
.map(
  (list, date) => {
    var list = _.map(list, function (c) {
      return _.omit(c, ['date']);
    });
    list = _.chain(list)
      .groupBy("kind")
      .map(
        (kindList, kind) => ({kindList, kind})
      ).value();

    return { list, date };
  }
)
.value();
// 이렇게 나옴
[
     {
        "list":[
           {
              "kindList":[
                 {
                    "kind":"SPENDING",
                    "money":100000
                 },
                 {
                    "kind":"SPENDING",
                    "money":2900
                 }
              ],
              "kind":"SPENDING"
           },
           {
              "kindList":[
                 {
                    "kind":"TRANSFER",
                    "money":2000000
                 },
                 {
                    "kind":"TRANSFER",
                    "money":1500000
                 }
              ],
              "kind":"TRANSFER"
           }
        ],
        "date":"Sat Dec 01 2018 00:00:00 GMT+0900"
     },
     {
        "list":[
           {
              "kindList":[
                 {
                    "kind":"SPENDING",
                    "money":1765
                 },
                 {
                    "kind":"SPENDING",
                    "money":7000
                 }
              ],
              "kind":"SPENDING"
           }
        ],
        "date":"Sun Dec 02 2018 00:00:00 GMT+0900"
     }
  ]

// 2중 group by 그리고 sum
let transactionGroupDate = _.chain(transactionSet)
.groupBy('date')
.map(
  (listGroupByDate, date) => {
    var listGroupByDate = _.map(listGroupByDate, function (c) {
      return _.omit(c, ['date']);
    });
    listGroupByDate = _.chain(listGroupByDate)
      .groupBy("kind")
      .map(
        (listGroupByKind, kind) => {
          return (
            { money: _.sumBy(listGroupByKind, 'money'), kind }
          );
        }
      ).value();
    return { listGroupByDate, date };
  }
)
.value();





//=======================================
//========= 4. 기타            ==========
//=======================================
// 파일 다운로드 시
window.open(CommonUtil.getContextRoot() + '/evaluationReport/downloadAnalysisReport.do?analysisSeq=' + this.$route.query.analysisSeq, '_self');



import {TransactionMixin, AppUtil} from "../../js/bokslmoney.js";

import Vue from "vue";
import VeeValidate from "vee-validate";
import VueUtil from "../../js/vue-util.js";
import { TransactionMixin, AppUtil, TYPE_VALUE } from "../../js/bokslmoney.js";
import "../../js/vue-common.js";
import CommonUtil from "../../js/common-util.js";