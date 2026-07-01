import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Vant 组件按需引入
import {
  NavBar,
  Tabbar,
  TabbarItem,
  Form,
  Field,
  Button,
  Popup,
  ActionSheet,
  Cell,
  CellGroup,
  Image as VanImage,
  Uploader,
  Calendar,
  Picker,
  DatePicker,
  Swipe,
  SwipeItem,
  Progress,
  Tag,
  Empty,
  Loading,
  Toast,
  Dialog,
  Notify,
  Divider,
  Icon,
  Skeleton,
  List,
  Search,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Switch,
  Stepper,
  Grid,
  GridItem,
  Collapse,
  CollapseItem,
  Badge,
  Circle,
  Overlay,
  Step, 
  Steps
} from 'vant'

// Vant 样式
import 'vant/lib/index.css'

// 全局样式
import './styles/global.scss'

const app = createApp(App)
const pinia = createPinia()

// 注册 Vant 组件
const vantComponents = [
  NavBar, Tabbar, TabbarItem, Form, Field, Button, Popup,
  ActionSheet, Cell, CellGroup, VanImage, Uploader, Calendar,
  Picker, DatePicker, Swipe, SwipeItem, Progress, Tag, Empty,
  Loading, Divider, Icon, Skeleton, List, Search, Checkbox,
  CheckboxGroup, Radio, RadioGroup, Switch, Stepper, Grid, GridItem,
  Collapse, CollapseItem, Badge, Circle, Overlay,Step,Steps
]

vantComponents.forEach(comp => {
  app.component(comp.name || '', comp)
})

app.use(pinia)
app.use(router)
app.mount('#app')

// 全局挂载 Toast/Dialog
app.config.globalProperties.$toast = Toast
app.config.globalProperties.$dialog = Dialog