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
          api:{
              type:String,
              value:null
          },

          itemresult:{
              type:Object,
              value:{}
          }
      },
      _filterItem: function(e){
          console.log("ESCRIBIENDO", e)
      }
    });