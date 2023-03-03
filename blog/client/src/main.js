import { createApp } from 'vue'
import './style.css'
import App from './App.vue'


import {router} from './common/router'
import {createPinia} from "pinia"
import axios from 'axios'
axios.defaults.baseURL="http://localhost:8080"
import { AdminStore } from './stores/AdminStore'
import naive from 'naive-ui'
import { createDiscreteApi } from 'naive-ui'

// 独立API
const { message, notification, dialog } = createDiscreteApi(["message", "dialog", "notification"])

const app = createApp(App)
app.provide("axios",axios)
app.provide("message", message)
app.provide("notification", notification)
app.provide("dialog", dialog)
app.provide("server_url", axios.defaults.baseURL )

app.use(naive)
app.use(createPinia())
app.use(router)

const adminStore = AdminStore()
// axios拦截器
axios.interceptors.request.use((config)=>{
    //每次请求都在headers中添加token
    config.headers.token = adminStore.token
    return config
})
app.mount('#app')
