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
        calories: "",
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
    
    

    // This contains all the methods.
    app.methods = {
        main_page_button: function(){
            app.data.main_page_mode = true;
            app.data.add_food_mode = false;
            app.data.edit_food_mode = false;
            app.data.view_nutrition_mode = false;
        },
        
        add_entry_button: function(){
            app.data.main_page_mode = false;
            app.data.add_food_mode = true;
            app.data.edit_food_mode = false;
            app.data.view_nutrition_mode = false;
        },
        
        edit_entry_button: function(entry_id){
            app.data.main_page_mode = false;
            app.data.add_food_mode = false;
            app.data.edit_food_mode = true;
            app.data.view_nutrition_mode = false;
            
            app.data.edit_id = entry_id;
        },
        
        view_info_button: function(){
            app.data.main_page_mode = false;
            app.data.add_food_mode = false;
            app.data.edit_food_mode = false;
            app.data.view_nutrition_mode = true;
        },

        edit_entry: function(food_name, quantity, edit_entry) {
            // Validates quantity input
            if (quantity % 1 != 0 || quantity < 0) {
              alert("Quantity is not valid.\nReturning to main page.")
              app.vue.quantity = ""; // Update the quantity using app.vue.quantity instead of app.data.quantity
            } else {
              axios.post("../edit_entry", { food: food_name, quantity: quantity, edit_entry: edit_entry }).then(function(response) {
                app.vue.plate = response.data.plate_rows;
          
                // Updates totals table
                axios.get("../update_total").then(function(response) {
                  var dict = { "quantity": response.data.quantity, "calories": response.data.calories };
                  app.vue.total = dict; // Update the total using app.vue.total instead of app.data.total
                });
              });
            }
          
            // Redirects to main page
            app.methods.main_page_button();
        },
        
        remove_entry: function(index) {
            const entry = app.data.plate[index];
            const entry_id = entry.id;
            console.log("Entry ID to be deleted:", entry_id);
            console.log("Plate entries:", app.data.plate);
            
            app.data.plate.splice(index, 1); // Remove the entry from the plate array
            localStorage.setItem('plateData', JSON.stringify(app.data.plate));
        
            // Updates totals table
            axios.get("../update_total").then(function(response) {
                var dict = { "quantity": response.data.quantity, "calories": response.data.calories };
                app.data.total = dict;
            });
        },
        
        add_entry: function(food_name, quantity, calories) {
            // Validates quantity input
            if (quantity % 1 != 0 || quantity < 0) {
                alert("Quantity is not valid.\nReturning to main page.")
                app.data.quantity = "";
            } else {
                // Adds food to plate table
                axios.post("../add_food", { food_name: food_name, quantity: quantity }).then(function(response) {
                    const newEntry = {
                        ...response.data.plate_rows[0], // Assuming the API response returns a single entry
                        food_name: food_name,
                        quantity: quantity, // Update the quantity for the new entry
                        calories: String((Number(quantity))*(Number(calories))),// Assign the calories value
                        proteins: proteins,
                        lipid_fat: lipid_fat,
                        carbs: carbs,
                        sugars: sugars,
                        fiber: fiber,
                        calcium: calcium,
                        iron: iron,
                        sodium: sodium
                    };
                    app.data.plate = [...app.data.plate, newEntry];
                    localStorage.setItem('plateData', JSON.stringify(app.data.plate));

                    console.log("DATA HERE: ", JSON.stringify(app.data.plate));
                    // Updates totals table
                    axios.get("../update_total").then(function(response) {
                        var dict = { "quantity": response.data.quantity, "calories": response.data.calories };
                        app.data.total = dict;
                    });
                });

            }
            // Redirects to the main page
            app.methods.main_page_button();
        },
        
        get_nutritional_info: function(food_name){
            //complete
        },
    
        searchFoods: function() {
            if (app.data.food_name === "") {
                app.data.searchResults = []; // Clear search results if search bar is empty
            } else {
                // Filter foods based on the description matching the search query
                app.data.searchResults = app.data.all_foods.SurveyFoods.filter(function(food) {
                    return food.description.toLowerCase().includes(app.data.food_name.toLowerCase());
                });
            }
        },

        selectFood: function(food) {
            console.log(food.description);
            app.data.food_name = food.description;
            app.data.calories = food.foodNutrients[3].amount;
            //console.log(food.foodNutrients[3].amount, food.foodNutrients[3].nutrient.unitName);
        },
    };

    // This creates the Vue instance.
    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods
    });

    // And this initializes it.
    app.init = () => {
        // Check if data exists in localStorage
        if (localStorage.getItem('plateData')) {
          app.vue.plate = JSON.parse(localStorage.getItem('plateData'));
        } else {
          // Fetch plate data from the server
          axios.get('../get_plate').then(function(response) {
            app.vue.plate = response.data.rows;
          });
        }
      
        // Fetch all foods data from the server
        axios.get('../get_food_data').then(function(response) {
          app.data.all_foods = response.data;
        });
      
        // Updates totals table
        axios.get("../update_total").then(function(response) {
          var dict = { "quantity": response.data.quantity, "calories": response.data.calories };
          app.data.total = dict;
        });
      };
      

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code in it. 
init(app);