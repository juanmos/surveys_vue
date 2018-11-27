s<template>
  <div class="fluid container">
      <!-- este es la cabecera
    <div class="form-group form-group-lg panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Sortable control</h3>
      </div>
      <div class="panel-body">
        <div class="checkbox">
          <label><input type="checkbox" v-model="editable">Enable drag and drop</label>
        </div>
        <button type="button" class="btn btn-default" @click="orderList">Sort by original order</button>
      </div>
    </div>-->
<!-- este es el menu que se  va a mover -->
    <div class="col-md-3">
        <ul class="list-group">
            <li class="list-group2" >
               <v-card>
                   <v-toolbar color="indigo" dark>
                    <v-toolbar-title>Ordenar menu</v-toolbar-title>
                    <v-spacer></v-spacer>
                        <v-btn icon @click="saveData">
                            <v-icon>save</v-icon>
                        </v-btn>
                   </v-toolbar>
               </v-card>
            </li>
        </ul>
      <draggable class="list-group" element="ul" v-model="menus" :options="dragOptions" :move="onMove"
      @start="isDragging=true" @end="isDragging=false">
        <transition-group type="transition" :name="'flip-list'">
        <li class="list-group2" v-for="element in menus" :key="element.order">
            <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click=" element.fixed=! element.fixed"
             aria-hidden="true"></i>
                <v-list>
                    <v-list-tile>
                        <v-list-tile-action>
                        <v-icon>{{element.menuitem.icon}}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                        <v-list-tile-title >{{element.menuitem.name}}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
          </li>
        </transition-group>
      </draggable>
    </div>

   <!-- <div class="col-md-3">
      <draggable element="span" v-model="list2" :options="dragOptions" :move="onMove">
        <transition-group name="no" class="list-group" tag="ul">
          <li class="list-group-item" v-for="element in list2" :key="element.order">
            <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click=" element.fixed=! element.fixed"
             aria-hidden="true"></i>
            {{element.name}}
            <span class="badge">{{element.order}}</span>
          </li>
        </transition-group>
      </draggable>
    </div>-->
<!-- esto presenta el json -->
   <!--<div class="list-group col-md-3">
      <pre>{{listString}}</pre>
    </div> -->
    <v-btn
                absolute
                dark
                fab
                small
                top
                right
                color="pink"
                @click="goToList"
                >
                    <v-icon>list</v-icon>
                </v-btn>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
// import {mapState, mapGetters, mapActions} from 'vuex'
import {mapGetters, mapActions} from 'vuex'
const message = [
  'vue.draggable ',
  'draggable ',
  'component ',
  'for ',
  'vue.js 2.0 ',
  'based ',
  'on ',
  'Sortablejs '
]

export default {
  name: 'hello',
  components: {
    draggable
  },
  data () {
    return {
      list: message.map((name, index) => {
        return { name, order: index + 1, fixed: false }
      }),
      list2: [],
      editable: true,
      isDragging: false,
      delayedDragging: false,
      // para e table
      menus: [],
      menus2: [],
      menus3: [],
      query: {},
      nivel: '',
      id: ''
    }
  },
  methods: {
    ...mapActions('menus', { findMenus: 'find' }),
    ...mapActions(['setSnackMessage', 'setShowSnack', 'setSnackColor']),
    orderList () {
      this.list = this.list.sort((one, two) => {
        return one.order - two.order
      })
    },
    onMove ({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      )
    },
    saveData () {
      // console.log('mi configuracion ', this.menus[0])
      for (let i = 0; i < this.menus.length; i++) {
        const {Menu} = this.$FeathersVuex
        let menu = new Menu(this.menus[i])
        menu['order'] = (i + 1)
        menu.patch().then((result) => {
          this.findMenus({ query: {removed: false, level: this.nivel} }).then(response => {
            // const menu = response.data || response
            // console.log('edit ', menu)
            // this.alertConfig('Registro Modificado', 'success')
            this.setSnackMessage('Registro modificado')
            this.setSnackColor('success')
            this.setShowSnack(true)
            this.goToList()
          })
        }, (err) => {
          this.setSnackMessage('Error al guardar')
          this.setShowSnack(true)
          this.setSnackColor('error')
          console.log(err)
        })
      }
    },
    goToList () {
      this.$router.push('/menu')
    }
  },
  computed: {
    ...mapGetters('menus', {findMenuInStore: 'find'}),
    dragOptions () {
      return {
        animation: 0,
        group: 'description',
        disabled: !this.editable,
        ghostClass: 'ghost'
      }
    },
    listString () {
      return JSON.stringify(this.menus, null, 2)
    },
    list2String () {
      return JSON.stringify(this.list2, null, 2)
    }
  },
  created () {
    this.id = this.$route.params.id
    this.findMenus({query: {removed: false, _id: this.id, ...this.query}}).then(response => {
      if (response.data[0].level === 1) {
        // console.log(response.data[0].level)
        this.findMenus({query: {removed: false, level: '1', ...this.query}}).then(response2 => {
          this.menus = response2.data
        })
      } else {
        this.findMenus({query: {removed: false, _menu_id: response.data[0]._menu_id, $sort: { order: '1' }, ...this.query}}).then(response2 => {
          this.menus = response2.data
        })
      }
    })
  },
  watch: {
    isDragging (newValue) {
      if (newValue) {
        this.delayedDragging = true
        return
      }
      this.$nextTick(() => {
        this.delayedDragging = false
      })
    }
  }
}
</script>

<style>
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s ;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  min-height: 20px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}
/*==========================*/
.list-group2 {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
}

.list-group-item.active {
    z-index: 2;
    color: #fff;
    background-color: #b3d4fc;
    border-color: #b3d4fc;
}
</style>
