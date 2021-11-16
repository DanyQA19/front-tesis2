<template>
  <v-container grid-list-m>
    <v-layout wrap>
      <v-flex xs12 sm12 md12>
        <div class="ct-chart">
          <canvas id="myChart">

          </canvas>
        </div>
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
        valores: [],
        unidades: [],
        totales: []
      }
    },
    methods:{
        listar() {
        // se agrega el metodo
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
        let me = this;
        me.valores.map(function(x){
          me.unidades.push(x.nombreCliente);
          me.totales.push(x.count);
        });

        const ctx = document.getElementById('myChart');
        const myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: me.unidades,
            datasets: [{
              label: 'Número de Atenciones',
              data: me.totales,
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
