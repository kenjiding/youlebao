<template>
  <ych-page>
    <!-- <grid-layout
      :layout.sync="testLayout"
      :col-num="colNum"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="false"
      :is-mirrored="false"
      :vertical-compact="false"
      :margin="[25, 25]"
      :use-css-transforms="true"
      class="layout-one"
      @layout-updated="layoutUpdatedEvent1"
    >

      <grid-item
        v-for="item in testLayout"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i">
        {{ item.i }}
      </grid-item>
    </grid-layout>
    <grid-layout
      :layout.sync="testLayout2"
      :col-num="12"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="true"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[10, 10]"
      :use-css-transforms="true"
      @layout-updated="layoutUpdatedEvent2"
      @move-event="test2"
    >

      <grid-item
        v-for="item in testLayout2"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i">
        {{ item.i }}
      </grid-item>
    </grid-layout> -->
    <!-- <SlickList
      v-model="items"
      class="wrap"
      lock-axis="xy">
      <SlickItem
        v-for="(item, index) in items"
        :index="index"
        :key="index"
        class="item">
        {{ item }}
      </SlickItem>
    </SlickList> -->
    <!-- <div class="drag">
      <h2>List 1 Draggable</h2>
      <draggable
        v-model="list"
        :options="{group:{ name:'people', put:false }}"
        class="dragArea">
        <div
          v-for="(element, index) in list"
          :key="index">{{ element.name }}</div>
      </draggable>
      <h2>List 2 Draggable</h2>
      <draggable
        v-model="list2"
        :options="{group:'people'}"
        class="dragArea">
        <div
          v-for="(element, index) in list2"
          :key="index">{{ element.name }}</div>
      </draggable>
    </div>

    <div class="normal">
      <h2>List 1 v-for</h2>
      <div>
        <div
          v-for="element in list"
          :key="element">{{ element.name }}</div>
      </div>

      <h2>List 2 v-for</h2>
      <div>
        <div
          v-for="element in list2"
          :key="element">{{ element.name }}</div>
      </div>
    </div> -->

    <draggable
      v-model="list"
      :options="{group:'id' }"
      @update="datadragEnd1"
      @add="add1">
      <div
        v-for="item in list"
        :key="item.id"
        class="item">{{ item.name }}</div>
    </draggable>
    <!-- <draggable
      v-model="list"
      :options="{group:'test'}"
      element="ul"
      class="wrap"
      @update="datadragEnd1"
      @add="add1">
      <li
        v-for="item in list"
        :key="item.id"
        class="item">{{ item.name }}</li>
    </draggable> -->
    <draggable
      v-model="list2"
      :options="{group:'id',ghostClass: 'test'}"
      element="ul"
      class="wrap"
      @remove="getdata"
      @update="datadragEnd2">
      <li
        v-for="item in list2"
        :key="item.id"
        class="item">{{ item.name }}</li>
    </draggable>
  </ych-page>
</template>

<script>
import VueGridLayout from 'vue-grid-layout';
import { mapState } from 'vuex';
// import { SlickList, SlickItem, ContainerMixin, ElementMixin } from 'vue-slicksort';
import draggable from 'vuedraggable';

export default {
  name: 'Layout',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    draggable,
    // SlickList,
    // SlickItem,
    // ContainerMixin,
    // ElementMixin,
  },
  data() {
    return {
      list: [{
        name: 'John',
      }, {
        name: 'Joao',
      }, {
        name: 'Jean',
      }],
      list2: [{
        name: 'Juan',
      }, {
        name: 'Edgard',
      }, {
        name: 'Johnson',
      }],
      // list: [
      //   {
      //     id: 1,
      //     name: '会员入会',
      //   },
      //   {
      //     id: 2,
      //     name: '套票查询',
      //   },
      //   {
      //     id: 3,
      //     name: '提币',
      //   },
      //   {
      //     id: 4,
      //     name: '村彩票',
      //   },
      //   {
      //     id: 5,
      //     name: '主副卡',
      //   },
      //   {
      //     id: 6,
      //     name: '验票',
      //   },
      // ],
      // list2: [
      //   {
      //     id: 11,
      //     name: '退单',
      //   },
      //   {
      //     id: 12,
      //     name: '储值冻结',
      //   },
      //   {
      //     id: 13,
      //     name: '游乐扣费',
      //   },
      //   {
      //     id: 14,
      //     name: '手工清场',
      //   },
      //   {
      //     id: 15,
      //     name: 'a哈哈乐',
      //   },
      //   {
      //     id: 16,
      //     name: '哇哇哇哈哈哈',
      //   },
      // ],
      items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8'],
      testLayout: [
        {
          x: 0, y: 0, w: 1, h: 1, i: '0',
        },
        {
          x: 0, y: 1, w: 1, h: 1, i: '1',
        },
        {
          x: 0, y: 2, w: 1, h: 1, i: '2',
        },
        {
          x: 0, y: 3, w: 1, h: 1, i: '3',
        },
        {
          x: 1, y: 0, w: 1, h: 1, i: '4',
        },
        {
          x: 1, y: 1, w: 1, h: 1, i: '5',
        },
        {
          x: 1, y: 2, w: 1, h: 1, i: '6',
        },
        {
          x: 1, y: 3, w: 1, h: 1, i: '7',
        },
        {
          x: 2, y: 0, w: 1, h: 1, i: '8',
        },
        {
          x: 2, y: 1, w: 1, h: 1, i: '9',
        },
        {
          x: 2, y: 2, w: 1, h: 1, i: '10',
        },
        {
          x: 2, y: 3, w: 1, h: 1, i: '11',
        },

      ],
      testLayout2: [
        {
          x: 0, y: 10, w: 2, h: 5, i: '12',
        },
        {
          x: 2, y: 10, w: 2, h: 5, i: '13',
        },
        {
          x: 4, y: 8, w: 2, h: 4, i: '14',
        },
        {
          x: 6, y: 8, w: 2, h: 4, i: '15',
        },
        {
          x: 8, y: 10, w: 2, h: 5, i: '16',
        },
        {
          x: 10, y: 4, w: 2, h: 2, i: '17',
        },
        {
          x: 0, y: 9, w: 2, h: 3, i: '18',
        },
        {
          x: 2, y: 6, w: 2, h: 2, i: '19',
        },
      ],
    };
  },
  computed: {
    ...mapState({
      pageHeight: state => state.client.pageHeight,
      pageWidth: state => state.client.pageWidth,
    }),
    colNum() {
      return this.pageWidth / 100;
    },
  },
  mounted() {
  },
  methods: {
    getdata(evt) {
      console.log(2222);
      console.log(this.list2);
      console.log(evt);
    },
    add1(evt) {
      console.log(evt);
      console.log(`添加前的索引1:${evt.oldIndex}`);
      console.log(`添加后的索引1:${evt.newIndex}`);
    },
    datadragEnd1(evt) {
      console.log(`拖动前的索引1:${evt.oldIndex}`);
      console.log(`拖动后的索引1:${evt.newIndex}`);
    },
    datadragEnd2(evt) {
      console.log(`拖动前的索引2:${evt.oldIndex}`);
      console.log(`拖动后的索引2:${evt.newIndex}`);
    },
    layoutUpdatedEvent1(newLayout) {
      console.log(newLayout);
    },
    layoutUpdatedEvent2(newLayout) {
      console.log(newLayout);
    },
    test2(i) {
      console.log('---移动的下标----');
      console.log(i);
    },
  },
};
</script>
<style lang='scss' scoped>
@import "@/styles/theme.scss";
.layout-one {
  height: 400px;
}
/deep/ .vue-grid-item {
  background-color: $color-white;
  color: $color-black;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px!important;
  width: 90px!important;
}
/deep/ .vue-grid-layout {
  margin-bottom: 50px;
}
.wrap {
  width: 500px;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 50px;
}
.item {
  height: 90px;
  width: 120px;
  margin: 10px;
  line-height: 90px;
  text-align: center;
  background-color: $color-white;
}
</style>

