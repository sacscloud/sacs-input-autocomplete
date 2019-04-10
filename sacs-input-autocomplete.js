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
              value:null
          },

          dataAux:{
              type:Array,
              value:[]
          },

          result:{
              type:Object,
              value:[]
          }
      },

      listeners:{
       "check-scan.change":"__listenerCheck",
       "btn_count.click":"__listenerButton",
       "item-selected":"__listenerItemSelected"
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

          if(quantity > 0 && item.length > 0) {

          this.push('result', {quantity: parseInt(quantity), item});

          }

          this.$.input_filter.value = null;
          this.$.input_counter.value = null;
          this.$$("#list_items")._closeList();
          console.log("RESULT BUTTON", this.result);
      },

      __listenerItemSelected: function (e) {
              console.log("EVENT", e)

              this.$.input_filter.value = e.detail.name;
              this.$.input_counter.value = 1;
              this.$$("#list_items")._closeList(); 
      },

      _listenerInputFilter: function(e){

        const valueInput = this.$.input_filter.value;
          
          if(valueInput.length > 0){

            this.$.btn_count.disabled = false;  
            this._filterList(valueInput);

          } else {

            this.$.btn_count.disabled = true;  
            this.$$("#list_items")._closeList(); 
            this.$$("#list_items").dataList = this.data;
          }
      },

      _filterList: function (value) {

        const dataFiltered = this.data.filter( element => 
                             element.name.search(value) !== -1 || 
                             element.id.search(value) !== -1
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

                //console.log("RESULT SCAN", this.result);
                this.$$("#list_items")._closeList();
                this.$.counter.style.display = "none";

           }, 3000);
        }
      }
    });