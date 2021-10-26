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

                <v-card-text>
                  <!-- cuadro de dialogo editar y agrega ********************* -->
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="codigo"
                          label="Codigo"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="responsable"
                          label="Responsable"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="tipo"
                          label="Tipo"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="descripcion"
                          label="Descripcion"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="nombreCliente"
                          label="Nombre Cliente"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="prioridad"
                          label="Prioridad"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="medioAtencion"
                          label="Medio de Atencion"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="fechaInicio"
                          label="Fecha Inicio"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="fechaTermino"
                          label="Fecha Fin"
                        ></v-text-field>
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
                  >Are you sure you want to delete this item?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
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
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
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
        { text: "Codigo", value: "codigo", sortable: true },
        { text: "Responsable", value: "responsable.nombre", sortable: true },
        { text: "Tipo", value: "tipo", sortable: true },
        { text: "Descripcion", value: "descripcion", sortable: false },
        { text: "Cliente", value: "nombreCliente", sortable: true },
        { text: "Prioridad", value: "prioridad", sortable: true },
        { text: "Atención", value: "medioAtencion", sortable: true },
        { text: "FechaIni", value: "fechaInicio", sortable: true },
        { text: "FechaTer", value: "fechaTermino", sortable: true },
        { text: "Opciones", value: "actions", sortable: false },
      ],
      editedIndex: -1,
      _id: "",
      codigo: "",
      responsable: "",
      tipo: "",
      descripcion: "",
      nombreCliente: "",
      prioridad: "",
      medioAtencion: "",
      fechaInicio: "",
      fechaTermino: "",
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
  },

  methods: {
    listar() {
      // se agrega el metodo
      let me = this;
      axios
        .get("incidencia/listar")
        .then(function(response) {
          me.incidencias = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    limpiar() {
      this._id = "";
      this.codigo = "";
      this.responsable = "";
      this.tipo = "";
      this.descripcion = "";
      this.nombreCliente = "";
      this.prioridad = "";
      this.medioAtencion = "";
      this.fechaInicio = "";
      this.fechaTermino = "";
    },
    guardar() {
      let me = this;
      if (this.editedIndex > -1) {
        // codigo para editar
      } else {
        // codigo para guardar
        axios
          .post("incidencia/agregar", {
            codigo: this.codigo,
            responsable: this.responsable,
            tipo: this.tipo,
            descripcion: this.descripcion,
            nombreCliente: this.nombreCliente,
            prioridad: this.prioridad,
            medioAtencion: this.medioAtencion,
            fechaInicio: this.fechaInicio,
            fechaTermino: this.fechaTermino,
          })
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
      this.editedIndex = this.incidencias.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
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
