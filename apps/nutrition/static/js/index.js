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
        edit_food_mode: false,
        view_nutrition_mode: false,
        food_name: "",
        quantity: "",
        edit_id: "",
        searchResults: [],
        all_foods: []
    };    

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };
    
    app.edit_entry = function(food_name, quantity, edit_entry){
        console.log('in edit entry');
        axios.post("../edit_entry", {food: food_name, quantity: quantity, edit_entry: edit_entry}).then(function(response){
            app.data.plate = response.data.plate_rows;
        })
        
        // Redirects to main page
        app.main_page_button();
    }
    
    app.remove_entry = function(entry_id){
        console.log('in remove');
        axios.post("../remove_entry", {entry_id: entry_id}).then(function(response){
            app.data.plate = response.data.plate_rows;
        })
    }
    
    app.main_page_button = function(){
        app.data.main_page_mode = true;
        app.data.add_food_mode = false;
        app.data.edit_food_mode = false;
        app.data.view_nutrition_mode = false;
    }
    
    app.add_entry_button = function(){
        app.data.main_page_mode = false;
        app.data.add_food_mode = true;
        app.data.edit_food_mode = false;
        app.data.view_nutrition_mode = false;
    }
    
    app.edit_entry_button = function(entry_id){
        app.data.main_page_mode = false;
        app.data.add_food_mode = false;
        app.data.edit_food_mode = true;
        app.data.view_nutrition_mode = false;
        
        app.data.edit_id = entry_id;
    }
    
    app.view_info_button = function(){
        app.data.main_page_mode = false;
        app.data.add_food_mode = false;
        app.data.edit_food_mode = false;
        app.data.view_nutrition_mode = true;
    }
    
    app.add_entry = function(food_name, quantity){
        //convert quantity into an int before calculating for total table
        console.log(food_name, quantity);
        console.log(app.data.food_name, app.data.quantity);
        
        axios.post("../add_food", {food: food_name, quantity: quantity}).then(function(response) {
            app.data.plate = response.data.plate_rows;
        });
        
        // Redirects to main page
        app.main_page_button();
    }
    
    app.get_nutritional_info = function(food_name){
        //complete
    }

    app.searchFoods = function() {
        if (app.data.food_name === "") {
            app.data.searchResults = []; // Clear search results if search bar is empty
        } else {
            // Filter foods based on the description matching the search query
            app.data.searchResults = app.data.all_foods.SurveyFoods.filter(function(food) {
                return food.description.toLowerCase().includes(app.data.food_name.toLowerCase());
            });
        }
    }

    // This contains all the methods.
    app.methods = {
        edit_entry: app.edit_entry,
        remove_entry: app.remove_entry,
        main_page_button: app.main_page_button,
        add_entry_button: app.add_entry_button,
        edit_entry_button: app.edit_entry_button,
        view_info_button: app.view_info_button,
        add_entry: app.add_entry,
        get_nutritional_info: app.get_nutritional_info,
        searchFoods: app.searchFoods
    };

    // This creates the Vue instance.
    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods
    });

    // And this initializes it.
    app.init = () => {
        
        // Updates plate with any pre-existing entries
        axios.get('../get_plate').then(function (response) {
            app.vue.plate = response.data.rows;
        });

        axios.get('../get_food_data').then(function (response) {
            console.log(response.data.SurveyFoods[0].description);
            app.data.all_foods = response.data;
        });
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code in it. 
init(app);