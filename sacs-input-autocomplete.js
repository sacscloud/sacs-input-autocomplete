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

          result:{
              type:Object,
              value:{}
          }
      },
      _filterItem: function(e){
          console.log("ESCRIBIENDO", e)
      }
    });