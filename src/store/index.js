import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({


  state: {
    footprintData:[]
  },


  mutations: {


    //添加足迹

    addTrackCount(state,item) {
       item.isChecked = false
        
        
        state.footprintData.unshift(item)
        console.log(state.footprintData)
    },

    // 当个删除足迹

    removeOne(state,index) {
      state.footprintData.splice(index,1)
    },

    // 全删除足迹

    delAllTrack(state) {
      state.footprintData=[]
    }
   
  }
})
