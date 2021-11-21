<template>
  <v-container>
    <v-layout wrap>
      <v-flex xs12>
        <v-toolbar flat>
          <v-toolbar-title>Grafico</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
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

              
                  <v-btn color="primary" outlined class="mb-2"  @click="guardar">Buscar<v-icon right dark>mdi-magnify</v-icon></v-btn>
              <v-spacer></v-spacer>
                
              
                  <v-btn color="error" outlined class="mb-2"   @click="limpiar">Limpiar<v-icon right dark>mdi-eraser</v-icon></v-btn>
              <v-spacer></v-spacer>
            
            <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
          
        </v-toolbar>
      </v-flex>
        
       <v-flex>
        <v-card>
          <div class="ct-chart">
            <canvas id="myChart">

            </canvas>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>   
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';

export default {
    data(){
        return{
             fechaInicio: "",
             fechaTermino: "",
             menu: false,
             modal: false,
             menu2: false,
             valida: 0,
             validaMensaje: [],
             valores: [],
             myChart: null 
        }
    },
    methods:{
        limpiar(){
            this.fechaInicio = "";
            this.fechaTermino = "";
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
        guardar(){
            let me = this;
            let header = {"token": this.$store.state.token};
            let configuracion = {headers: header};
            if(this.validar()){
                return;
            }
                
                axios.post("grafico/enviar", {fechaInicio: this.fechaInicio, fechaTermino: this.fechaTermino}, configuracion)
                .then(function(response) {
                  me.valores = [];
                  me.$nextTick(()=>{
                    me.valores = response.data;
                    
                    console.log(response.data);
                    me.graficar();
                  })
                    
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        listar(){
          let me = this;
          let header = {"token": this.$store.state.token};
          let configuracion = {headers: header};
          axios
            .get("grafico/enviarData", configuracion)
            .then(function(response) {
              
              me.valores = response.data;
              me.graficar();
            })
            .catch(function(error) {
            console.log(error);
            });
        }, 
        graficar(){
          
          let unidades = [];
          let totales = [];
          let me = this;
          me.valores.map(function(x){
            unidades.push(x.nombreCliente);
            totales.push(x.count);
          });

          let ctx = document.getElementById('myChart');

          if (me.myChart) {
            me.myChart.destroy();
          }

           me.myChart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: unidades,
                datasets: [{
                  label: 'Número de Atenciones',
                  data: totales,
                  backgroundColor: [
                    'rgba(93, 173, 226)'
                  ],
                  borderColor: [
                    'rgba(27, 79, 114)'
                  ],
                  borderWidth: 2
              }]
            },
            options: {
              indexAxis: 'y',
              scales: {
                        y: {
                              beginAtZero: true
                        }
                      }
              }
          });
          
        }
    },
    mounted(){
       this.listar();
    }
}
</script>