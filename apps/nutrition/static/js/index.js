// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};

// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        plate: [],
        total: [],
        main_page_mode: true,
        add_food_mode: false,
        view_nutrition_mode: false,
        food_name: "",
        quantity: ""
    };    

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };
    
    app.edit_entry = function(row){
        //complete
        console.log('in entry');
    }
    
    app.remove_entry = function(row){
        //complete
        console.log('in remove');
    }
    
    app.main_page_button = function(){
        app.data.main_page_mode = true;
        app.data.add_food_mode = false;
        app.data.view_nutrition_mode = false;
    }
    
    app.add_entry_button = function(){
        app.data.main_page_mode = false;
        app.data.add_food_mode = true;
        app.data.view_nutrition_mode = false;
    }
    
    app.view_info_button = function(){
        app.data.main_page_mode = false;
        app.data.add_food_mode = false;
        app.data.view_nutrition_mode = true;
    }
    
    app.add_entry = function(food_name, quantity){
        //complete
        //convert quantity into an int before calculating
        console.log(food_name, quantity);
    }

    // This contains all the methods.
    app.methods = {
        edit_entry: app.edit_entry,
        remove_entry: app.remove_entry,
        main_page_button: app.main_page_button,
        add_entry_button: app.add_entry_button,
        view_info_button: app.view_info_button,
        add_entry: app.add_entry,
    };

    // This creates the Vue instance.
    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods
    });

    // And this initializes it.
    app.init = () => {
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code in it. 
init(app);