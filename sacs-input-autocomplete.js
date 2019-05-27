    /**
     * `sacs-input-autocomplete`
     * autocomplete the search
     *
     * @customElement
     * @polymer
     * @demo demo/index.html
     */
    'use strict';

    Polymer({
      is:'sacs-input-autocomplete',
      properties:{
          data:{
              type:Array,
              value:[]
          },

          dataFilter:{
              type:Array,
              value:[]
          },

          dataAux:{
              type:Array,
              value:[]
          },

          result:{
              type:Object,
              value:[]
          },

          name:{
              type:String,
              value:null
          },

          key:{
              type:String,
              value:null
          },

          selected:{
              type:Object,
              value:{}
          }
      },

      listeners:{
       "check-scan.change":"__listenerCheck",
       "btn_count.click":"__listenerButton",
       "item-selected":"__listenerItemSelected"
      },

      observers:[
        'handleData(data.*)'
    ],

    handleData: function(data){
        
        if(data.value.length > 0){
            this.__createObject();
        }
    
    },

      __listenerCheck: function (e) {

          if(e.target.checked) {
              this.$.counter.style.display = "none";
          }else{
            this.$.counter.style.display = "flex";
            this.$.input_filter.value = null;
          }
      },

      __listenerButton: function (e) {
          const quantity = this.$.input_counter.value;
          const item = this.$.input_filter.value;
          this.set('result', []);
             
          if(quantity > 0 && item.length > 0) {

          this.push('result', {quantity: parseInt(quantity), item});

            this.__updateCountFirebase(quantity);
          }

          this.$.input_filter.value = null;
          this.$.input_counter.value = null;
          this.$$("#list_items")._closeList();
      },

      __listenerItemSelected: function (e) {
             this.set('selected', e.detail);
              this.$.input_filter.value = e.detail.name;
              this.$.input_counter.value = 1;
              this.$$("#list_items")._closeList(); 
      },

      _listenerInputFilter: function(e){

        const valueInput = this.$.input_filter.value;
          
          if(valueInput.length > 0){

            this.$.btn_count.disabled = false;  
            this.__filterList(valueInput);

          } else {

            this.$.btn_count.disabled = true;  
            this.$$("#list_items")._closeList(); 
            this.$$("#list_items").dataList = this.data;
          }
      },
      __createObject : function (){
           
           this.data.map( obj => {

            const dataList = new Object();
            for (let key in obj){
                if(key === this.name){
                  dataList.name = obj[key];
                }
                
                if(key === this.key){
                    dataList.id = obj[key];

                }
              
            }

      
            this.push('dataFilter', dataList);
        });
      },

      __filterList: function (value) {
        const dataFiltered = this.dataFilter
                            .filter( element => {
                                   
                               if(typeof element.id === 'number'){
                                   element.id = element.id.toString();

                               }

                                return element.name.toLowerCase().search(value.toLowerCase()) !== -1 || 
                                element.id.toLowerCase().search(value.toLowerCase()) !== -1

                            }
                             );
        

        this.$$("#list_items").dataList = dataFiltered;

        if(dataFiltered.length > 0){
            this.$$("#list_items")._openList();
        }else{
            this.$$("#list_items")._closeList();

        }

        if(dataFiltered.length === 1 && this.$$("#check-scan").checked) {
               
           this.debounce('action', ()=>{

            this.$.input_filter.value = dataFiltered[0].name;

            this.push('result', 
            {
                quantity: 1, 
                item: this.$.input_filter.value
            });

            this.$$("#list_items")._closeList();
            this.$.counter.style.display = "none";

            const quantity = 1;
            this.__updateCountFirebase(quantity);                

           }, 3000);
        }
      },

      __updateCountFirebase: function(quantity){
     
        const filterData = this.data.filter(element => element.$key === this.selected.itemSelected);


        const {$key} = filterData[0];


        const dataToFirebase = {
             counted: parseInt(quantity)
        }

       //insertar a firebase
       const db = firebase.database().ref(`/accounts/sacsretailpruebas/performinventorycount`).child($key);
       db.update(dataToFirebase);
          
      }
    });