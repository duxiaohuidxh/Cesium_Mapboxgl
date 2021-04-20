import Vue from 'vue'
import Router from 'vue-router'
import logIn from "../components/login/logins"
import CesiumMap from '../components/CesiumContainer'
import mapboxgl from '../components/mapboxgl/MapboxContainer'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/log-in',
    name: 'logIn',
    // component: () => import('@/components/log-in/logIn')//路由懒加载方式
    component: logIn
    },{
    path: '/mapboxgl',
    name: 'mapboxgl',
    component: mapboxgl
  },
    {
    path: '/',
    name: 'CesiumMap',
    component: CesiumMap
  }
  ]
})

