<template>
  <v-layout align-start>
    <v-flex>
      <!-- :items="desserts" es arreglo -->
      <v-data-table
        :headers="headers"
        :items="usuarios"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Usuarios</v-toolbar-title>
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
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="nombre"
                          label="Nombre"
                        ></v-text-field>
                      </v-col> 

                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="apePat"
                          label="Ape. Paterno"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="apeMat"
                          label="Ape. Materno"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="dni"
                          label="DNI"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="email"
                          label="Email"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          type="password"
                          v-model="password"
                          label="Password"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-select v-model="rol"
                          :items="roles"
                           label="Rol"
                        ></v-select>
                      </v-col>

                       <v-col cols="12" sm="6" md="4">
                        <v-select v-model="estado"
                          :items="estados"
                           label="Estado"
                        ></v-select>
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
      usuarios: [], // se agrega variable, se alamcena datos del back
      dialogDelete: false,
      headers: [
        { text: "Rol", value: "rol", sortable: true },
        { text: "Nombre", value: "nombre", sortable: true },
        { text: "ApePaterno", value: "apePat", sortable: true },
        { text: "ApeMaterno", value: "apeMat", sortable: true },
        { text: "DNI", value: "dni", sortable: true },
        { text: "Email", value: "email", sortable: true },
        { text: "Estado", value: "estado", sortable: true },
        { text: "Opciones", value: "actions", sortable: false },
      ],
      editedIndex: -1,
      _id: "",
      nombre: "",
      rol: "",
      roles: ['administrador', 'gerente', 'trabajador'],
      apePat: "",
      apeMat: "",
      dni: "",
      email: "",
      password: "",
      estado: 1,
      estados: ['Activo', 'Inactivo'],
      codigo: "",
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
  },

  methods: {
    listar() {
      // se agrega el metodo
      let me = this;
      let header = {"token": this.$store.state.token};
      let configuracion = {headers: header};
      axios
        .get("usuario/listar", configuracion)
        .then(function(response) {
          me.usuarios = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    limpiar() {
      this._id = "";
      this.rol = "";
      this.nombre = "";
      this.apePat = "";
      this.apeMat = "";
      this.apePat = "";
      this.dni = "";
      this.email = "";
      this.password = "";
      this.estado = 0;
      this.valida = 0;
      this.validaMensaje = [];
      this.editedIndex = -1;
    },
    validar(){
        this.valida = 0;
        this.validaMensaje = [];

        if(!this.rol){
            this.validaMensaje.push('Seleccione Rol');
        }

        if(this.nombre.length < 1 || this.nombre.length > 50){
            this.validaMensaje.push('Ingrese Nombre');
        }
        if(this.apePat.length < 1 || this.apePat.length > 50){
            this.validaMensaje.push('Ingrese Apellido Paterno');
        }
        if(!this.dni){
            this.validaMensaje.push('Ingrese DNI');
        }
        if(this.email.length < 1 || this.email.length > 50){
            this.validaMensaje.push('Ingrese Email');
        }
         if(this.password.length < 1 || this.password.length > 64){
            this.validaMensaje.push('Ingrese Password');
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

        if(this.estado == 'Activo'){
          this.estado = 1;
        }else{
          this.estado = 0;
        }

        axios.put("usuario/editar", { _id: this._id,
            nombre: this.nombre,
            apePat: this.apePat,
            apeMat: this.apeMat,
            rol: this.rol,
            dni: this.dni,
            email: this.email,
            password: this.password,
            estado: this.estado,
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
          .post("usuario/agregar", {
            rol: this.rol,
            nombre: this.nombre,
            apePat: this.apePat,
            apeMat: this.apeMat,
            dni: this.dni,
            email: this.email,
            password: this.password,
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
      this.nombre = item.nombre;
      this.apePat = item.apePat;
      this.apeMat = item.apeMat;
      this.rol = item.rol;
      this.dni = item.dni;
      this.email = item.email;
      this.password = item.password;
      this.estado = item.estado;

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
