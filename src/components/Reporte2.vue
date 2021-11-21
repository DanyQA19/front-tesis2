<template>
  <v-layout align-start>
    <v-flex>
      <!-- :items="desserts" es arreglo -->
      <v-data-table
        :headers="headers"
        :items="incidencias"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Reporte</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <v-select v-model="responsable"
                :items="responsables"
                label="Responsable"
            ></v-select>

            <v-spacer></v-spacer>
            <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="fechaInicio"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="fechaInicio"
                        label="Fecha Inicio"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="fechaInicio"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="menu = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(fechaInicio)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>

            <v-spacer></v-spacer>

            <v-menu
                    ref="menu2"
                    v-model="menu2"
                    :close-on-content-click="false"
                    :return-value.sync="fechaTermino"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="fechaTermino"
                        label="Fecha Termino"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="fechaTermino"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="menu2 = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu2.save(fechaTermino)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>

                <v-spacer></v-spacer>

                <v-btn color="primary" outlined class="mb-2"  @click="buscar">Buscar<v-icon right dark>mdi-magnify</v-icon></v-btn>

                <v-spacer></v-spacer>

                <v-btn color="error" outlined class="mb-2"   @click="limpiar">Limpiar<v-icon right dark>mdi-eraser</v-icon></v-btn>

                <v-spacer></v-spacer>

                <v-btn color="success" class="mb-2"   @click="crearPDF">PDF<v-icon right dark>mdi-file-document</v-icon></v-btn>
          
          </v-toolbar>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="listar()">
            Reset
          </v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>

import axios from "axios";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default {
  data() {
    return {
      dialog: false,
      search: "",
      incidencias: [], // se agrega variable, se alamcena datos del back
      dialogDelete: false,
      headers: [
        { text: "Codigo", value: "codigo", sortable: false },
        { text: "Responsable", value: "responsable.nombre", sortable: true },
        { text: "Tipo", value: "tipo", sortable: true },
        { text: "Descripcion", value: "descripcion", sortable: false },
        { text: "Cliente", value: "nombreCliente", sortable: true },
        { text: "Prioridad", value: "prioridad", sortable: true },
        { text: "Atención", value: "medioAtencion", sortable: true },
        { text: "FechaIni", value: "fechaInicio", sortable: true },
        { text: "FechaTer", value: "fechaTermino", sortable: true },
      ],
      responsable: "",
      responsables: [],
      fechaInicio: "",
      fechaTermino: "",
      menu: false,
      modal: false,
      menu2: false,
      valida: 0,
      validaMensaje: []
    };
  },
  created() {
    this.listar();
    this.selectResponsable();
  },

  methods: {
    crearPDF(){
      var columns = [
        {title: "Codigo", dataKey: "codigo"},
        {title: "Responsable", dataKey: "responsable"},
        {title: "Tipo", dataKey: "tipo"},
        {title: "Descripcion", dataKey: "descripcion"},
        {title: "Cliente", dataKey: "cliente"},
        {title: "Prioridad", dataKey: "prioridad"},
        {title: "Atencion", dataKey: "atencion"},
        {title: "Fecha Inicio", dataKey: "fecha_inicio"},
        {title: "Fecha Termino", dataKey: "fecha_termino"},
      ];
      var rows = [];

      this.incidencias.map(function(x){
        rows.push({
          codigo: x.codigo,
          responsable: x.responsable.nombre,
          tipo: x.tipo,
          descripcion: x.descripcion,
          cliente: x.nombreCliente,
          prioridad: x.prioridad,
          atencion: x.medioAtencion,
          fecha_inicio: x.fechaInicio,
          fecha_termino: x.fechaTermino
        });
      });

      var doc = new jsPDF('l', 'pt');

      doc.autoTable(columns, rows, {
        margin: {top: 60},
        addPageContent: function(data) {
          doc.text("Reporte de incidencias", 40, 30);
        }
      });

      doc.save("Incidencias.pdf"); 
    },
    selectResponsable(){
      let me = this;
      let responsableArray = [];
      let header = {"token": this.$store.state.token};
      let configuracion = {headers: header};
      axios.get("usuario/listar", configuracion)
        .then(function(response) {
          responsableArray = response.data;
          responsableArray.map(function(x){
            if(x.rol == 'trabajador'){
              me.responsables.push({text: x.nombre, value: x._id});
            }
            
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    listar() {
      // se agrega el metodo
      let me = this;
      let header = {"token": this.$store.state.token};
      let configuracion = {headers: header};
      axios
        .get("reporte/filtrar1", configuracion)
        .then(function(response) {
          me.incidencias = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    limpiar() {
            this.fechaInicio = "";
            this.fechaTermino = "";
            this.responsable = "",
            this.valores = [];
    },
    validar(){
            this.valida = 0;
            this.validaMensaje = [];

            if(this.fechaInicio.length < 1){
                this.validaMensaje.push('Ingrese fecha inicio');
            }
            if(this.fechaTermino.length < 1){
                this.validaMensaje.push('Ingrese fecha termino');
            }
            if(this.validaMensaje.length){
                this.valida = 1;
            }

            return this.valida;
    },
    buscar(){
            let me = this;
            let header = {"token": this.$store.state.token};
            let configuracion = {headers: header};
            if(this.validar()){
                return;
            }
                
            axios.post("reporte/filtrar2", {fechaInicio: this.fechaInicio, fechaTermino: this.fechaTermino, responsable: this.responsable}, configuracion)
            .then(function(response) {
              me.incidencias = [];
              me.incidencias = response.data;
            })
            .catch(function(error) {
                console.log(error);
            });
    }
  },
  mounted(){
       this.listar();
    }
};
</script>
