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
            <v-toolbar-title>Incidencias</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
              class="text-xs-center"
              v-model="search"
              append-icon="search"
              label="Búsqueda"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Nuevo
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text >
                  <!-- cuadro de dialogo editar y agrega ********************* -->
                  <v-container >
                    <v-row>
                      <!-- <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="codigo"
                          label="Codigo"
                        ></v-text-field>
                      </v-col> -->
                      <v-col cols="12" sm="6" md="4">
                        <v-select v-model="responsable"
                          :items="responsables"
                           label="Responsable"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        
                        <v-select v-model="tipo"
                          :items="tipoIncidencia"
                           label="Tipo"
                        ></v-select>

                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="descripcion"
                          label="Descripcion"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        
                          <v-autocomplete
                            v-model="nombreCliente"
                            :items="clientes"
                            label="Cliente"
                          ></v-autocomplete>

                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        
                        <v-select v-model="prioridad"
                          :items="tipoPrioridad"
                           label="Prioridad"
                        ></v-select>

                      </v-col>
                      <v-col cols="12" sm="6" md="4">

                        <v-select v-model="medioAtencion"
                          :items="tipoMedioAtencion"
                           label="Med. Atención"
                        ></v-select>

                      </v-col>

                      <v-col cols="12" sm="6" md="4" >
                       
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

                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                       
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

                      </v-col>

                      <v-col cols="12" sm="6" md="4" v-show="valida">
                        <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                        </div>
                      </v-col>

                    </v-row>
                  </v-container>
                  <!-- cuadro de dialogo editar y agregar ********************* -->
                </v-card-text>

                <v-card-actions>
                  <!-- botones de editar y eliminar ********************* -->
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="guardar">
                    Guardar
                  </v-btn>
                  <!-- botones de editar y eliminar ********************* -->
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <!-- Cuadro de confirmacion para eliminar ********************* -->
              <v-card>
                <v-card-title class="text-h5"
                  >¿Desea eliminar esta incidencia?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancelar</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >Si</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
              <!-- Cuadro de confirmacion para eliminar ********************** -->
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <!-- Iconos de Acciones ********************** -->
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <!-- <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon> -->
          <!-- Iconos de Acciones ********************** -->
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
// hasta acaaaaaaaaaa marca
// verrrrrt
import axios from "axios";
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
        { text: "Editar", value: "actions", sortable: false },
      ],
      editedIndex: -1,
      _id: "",
      codigo: "",
      responsable: "",
      responsables: [],
      tipo: "",
      tipoIncidencia: ['SGD', 'CD', 'MAT', 'SGT', 'ATD', 'OTROS'],
      descripcion: "",
      nombreCliente: "",
      clientes: ['FM', 'FFB', 'FO', 'FMV', 'FPSI', 'FLCH', 'FE', 'FDCP', 'FCCSS', 'FQIQ', 'FCB', 'FCF', 'FCM', 'FIGMMG', 'FII', 'FIEE', 'FISI', 'FCA', 'FCC', 'FCE', 'OGAL', 'VRAP', 'SG', 'OGCRI', 'VRIP', 'UTYC', 'DGA', 'OGAL', 'OGBU', 'OGRRHH', 'DGEP', 'R'],
      prioridad: "",
      tipoPrioridad: ['Baja', 'Media', 'Alta'],
      medioAtencion: "",
      tipoMedioAtencion: ['Correo electrónico', 'Llamada', 'Remota'],
      fechaInicio: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      fechaTermino: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
      valida: 0,
      validaMensaje: []
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo registro" : "Editar registro";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.listar();
    this.selectResponsable();
  },

  methods: {
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
        .get("incidencia/listar", configuracion)
        .then(function(response) {
          me.incidencias = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    limpiar() {
      this._id = "";
      this.responsable = "";
      this.tipo = "";
      this.descripcion = "";
      this.nombreCliente = "";
      this.prioridad = "";
      this.medioAtencion = "";
      this.fechaInicio = "";
      this.fechaTermino = "";
      this.valida = 0;
      this.validaMensaje = [];
      this.editedIndex = -1;
    },
    validar(){
        this.valida = 0;
        this.validaMensaje = [];

        if(this.tipo.length < 1){
            this.validaMensaje.push('Ingrese tipo');
        }
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
    guardar() {
      let me = this;
      let header = {"token": this.$store.state.token};
      let configuracion = {headers: header};
      if(this.validar()){
        return;
      }
      if (this.editedIndex > -1) {
        // codigo para editar
        axios.put("incidencia/editar", { _id: this._id,
            codigo: this.codigo,
            responsable: this.responsable,
            tipo: this.tipo,
            descripcion: this.descripcion,
            nombreCliente: this.nombreCliente,
            prioridad: this.prioridad,
            medioAtencion: this.medioAtencion,
            fechaInicio: this.fechaInicio,
            fechaTermino: this.fechaTermino,
          }, configuracion)
          .then(function(response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function(error) {
            console.log(error);
          });

      } else {
        // codigo para guardar
        axios
          .post("incidencia/agregar", {
            codigo: "",
            responsable: this.responsable,
            tipo: this.tipo,
            descripcion: this.descripcion,
            nombreCliente: this.nombreCliente,
            prioridad: this.prioridad,
            medioAtencion: this.medioAtencion,
            fechaInicio: this.fechaInicio,
            fechaTermino: this.fechaTermino,
          }, configuracion)
          .then(function(response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    editItem(item) {
      this._id = item._id;
      this.codigo = item.codigo;
      this.responsable = item.responsable._id;
      this.tipo = item.tipo;
      this.descripcion = item.descripcion;
      this.nombreCliente = item.nombreCliente;
      this.prioridad = item.prioridad;
      this.medioAtencion = item.medioAtencion;
      this.fechaInicio = item.fechaInicio;
      this.fechaTermino = item.fechaTermino;

      this.dialog = true;
      this.editedIndex = 1;
    },

    deleteItem(item) {
      this.editedIndex = this.incidencias.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.incidencias.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.limpiar();
      this.dialog = false;
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
</script>
