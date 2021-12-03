import Vue from "vue";
import VueRouter from "vue-router";
import store from '../store/index';
import Home from "../views/Home.vue";
import Incidencia from "../components/Incidencia.vue";
import Reincidencia from "../components/Reincidencia.vue";
import Usuario from '../components/Usuario.vue'
import Reporte from '../components/Reporte.vue'
import Reporte2 from '../components/Reporte2.vue'
import ReporteRein from '../components/ReporteRein.vue'
import Login from '../components/Login.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      administrador: true,
      gerente: true,
      trabajador: true
    }
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      libre: true
    }
  },
  {
    path: "/incidencia",
    name: "incidencia",
    component: Incidencia,
    meta: {
      administrador: true,
      trabajador: true
    }
  },
  {
    path: "/reincidencia",
    name: "reincidencia",
    component: Reincidencia,
    meta: {
      administrador: true,
      trabajador: true
    }
  },
  {
    path: "/usuario",
    name: "usuario",
    component: Usuario,
    meta: {
      administrador: true
    }
  },
  {
    path: "/reporte",
    name: "reporte",
    component: Reporte,
    meta: {
      administrador: true,
      gerente: true
    }
  },
  {
    path: "/reporte2",
    name: "reporte2",
    component: Reporte2,
    meta: {
      administrador: true,
      gerente: true,
      trabajador: true
    }
  },
  {
    path: "/reporte3",
    name: "reporteRein",
    component: ReporteRein,
    meta: {
      administrador: true,
      gerente: true,
      trabajador: true
    }
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.libre)){
    next();
  } else if(store.state.usuario && store.state.usuario.rol == "administrador"){
    if(to.matched.some(record => record.meta.administrador)){
      next();
    }
  } else if(store.state.usuario && store.state.usuario.rol == "gerente"){
    if(to.matched.some(record => record.meta.gerente)){
      next();
    }
  } else if(store.state.usuario && store.state.usuario.rol == "trabajador"){
    if(to.matched.some(record => record.meta.trabajador)){
      next();
    }
  } else{
    next({name: 'login'});
  }
})

export default router;
