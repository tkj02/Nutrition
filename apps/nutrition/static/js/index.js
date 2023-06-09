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
        search_plates_mode: false,
        food_name: "",
        quantity: "",
        proteins: "",
        lipid_fat: "",
        carbs: "",
        calories: "",
        sugars: "",
        fiber: "",
        calcium: "",
        iron: "",
        sodium: "",
        edit_id: "",
        searchResults: [],
        all_foods: [],
        privacy_status: axios.get('../check_privacy').then(function(response) {
            if (!response.data.status){
                app.data.privacy_status = false;
            }
            else{
                app.data.privacy_status = true;
            }
        }),
        plates_search_bar: [],
        all_public_plates: [],
        plate_search_results: [],
        public_plate: [],
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
            app.data.search_plates_mode = false;
            
            app.data.plates_search_bar = [];
            app.data.plate_search_results = [];
        },
        
        add_entry_button: function(){
            app.data.main_page_mode = false;
            app.data.add_food_mode = true;
            app.data.edit_food_mode = false;
            app.data.view_nutrition_mode = false;
            app.data.search_plates_mode = false;
        },
        
        edit_entry_button: function(entry_id){
            app.data.main_page_mode = false;
            app.data.add_food_mode = false;
            app.data.edit_food_mode = true;
            app.data.view_nutrition_mode = false;
            app.data.search_plates_mode = false;
            
            app.data.edit_id = entry_id;
        },
        
        view_info_button: function(){
            app.data.main_page_mode = false;
            app.data.add_food_mode = false;
            app.data.edit_food_mode = false;
            app.data.view_nutrition_mode = true;
            app.data.search_plates_mode = false;
        },
        
        search_plates_button: function(){
            app.data.main_page_mode = false;
            app.data.add_food_mode = false;
            app.data.edit_food_mode = false;
            app.data.view_nutrition_mode = false;
            app.data.search_plates_mode = true;
        },
        
        remove_entry: function(index) {
            const entry = app.data.plate[index];
            const entry_id = entry.id;
        
            axios.post("../remove_food", { entry_id: entry_id })
                .then(function(response) {
                // Updates totals table
                axios.post("../update_total", { plate: app.data.plate }).then(function (response) {
                    const dict = {
                        quantity: response.data.quantity,
                        calories: (response.data.calories).toFixed(2),
                        proteins: (response.data.proteins).toFixed(2),
                        lipid_fat: (response.data.lipid_fat).toFixed(2),
                        carbs: (response.data.carbs).toFixed(2),
                        sugars: (response.data.sugars).toFixed(2),
                        fiber: (response.data.fiber).toFixed(2),
                        calcium: (response.data.calcium).toFixed(2),
                        iron: (response.data.iron).toFixed(2),
                        sodium: (response.data.sodium).toFixed(2),
                    };
                    app.data.total = dict;
                });
                location.reload();
            }).catch(function(error) {
                console.log("Error deleting entry:", error);
            });
            
        },
        
        add_entry: function(food_name, quantity, calories, proteins, lipid_fat, carbs, sugars, fiber, calcium, iron, sodium) {
            // Validates quantity input
            if (quantity < 0) {
                alert("Quantity is not valid.\nReturning to main page.")
                app.data.quantity = "";
            } else {
                // Adds food to plate table
                axios
                    .post("../add_food", {
                        food_name: food_name,
                        quantity: quantity,
                        calories: calories,
                        proteins: proteins,
                        lipid_fat: lipid_fat,
                        carbs: carbs,
                        sugars: sugars,
                        fiber: fiber,
                        calcium: calcium,
                        iron: iron,
                        sodium: sodium
                    })
                    .then(function(response) {
                        app.data.plate = response.data.plate_rows;
                        // Updates totals table
                        axios.post("../update_total", { plate: app.data.plate }).then(function (response) {
                            const dict = {
                                quantity: response.data.quantity,
                                calories: (response.data.calories).toFixed(2),
                                proteins: (response.data.proteins).toFixed(2),
                                lipid_fat: (response.data.lipid_fat).toFixed(2),
                                carbs: (response.data.carbs).toFixed(2),
                                sugars: (response.data.sugars).toFixed(2),
                                fiber: (response.data.fiber).toFixed(2),
                                calcium: (response.data.calcium).toFixed(2),
                                iron: (response.data.iron).toFixed(2),
                                sodium: (response.data.sodium).toFixed(2),
                            };
                            app.data.total = dict;
                        });
                    });
            }
            // Redirects to the main page
            app.methods.main_page_button();
        },

        updateQuantity: function(index, item, newQuantity) {
            // Validate the new quantity input
            if (newQuantity <= 0) {
                if (newQuantity < 0) {
                    alert("Quantity is not valid.\n");
                }
                else {
                    alert("Use delete function to remove items.\n");
                }
                const entry = app.data.plate[index];
                if (entry) {
                    // If originalQuantity doesn't exist, use newQuantity as fallback
                    entry.quantity = entry.originalQuantity ;
                }
                return;
            }
        
            // Check if the index is within the range of the plate array
            if (index < 0 || index >= app.data.plate.length) {
                alert("Invalid index.\nReturning to the main page.");
                return;
            }
        
            axios.post('../get_user_item_id', {user_item_id: item.id}).then(function(response) {
                var originalQuantity = Number(response.data.user_rows[0]['quantity']);
                const ratio = newQuantity / originalQuantity;
                
                axios.post('../update_edit', {user_item_id: item.id,
                                              quantity: newQuantity,
                                              calories: (app.data.plate[index].calories*ratio).toFixed(2),
                                              proteins: (app.data.plate[index].proteins*ratio).toFixed(2),
                                              lipid_fat: (app.data.plate[index].lipid_fat*ratio).toFixed(2),
                                              carbs: (app.data.plate[index].carbs*ratio).toFixed(2),
                                              sugars: (app.data.plate[index].sugars*ratio).toFixed(2),
                                              fiber: (app.data.plate[index].fiber*ratio).toFixed(2),
                                              calcium: (app.data.plate[index].calcium*ratio).toFixed(2),
                                              iron: (app.data.plate[index].iron*ratio).toFixed(2),
                                              sodium: (app.data.plate[index].sodium*ratio).toFixed(2)}
                          ).then(function(response) {
                                axios.get('../get_plate').then(function(response) {
                                    app.vue.plate = response.data.rows;
                                    // Update totals table
                                    axios.post("../update_total", { plate: app.data.plate }).then(function (response) {
                                        const dict = {
                                            quantity: response.data.quantity,
                                            calories: (response.data.calories).toFixed(2),
                                            proteins: (response.data.proteins).toFixed(2),
                                            lipid_fat: (response.data.lipid_fat).toFixed(2),
                                            carbs: (response.data.carbs).toFixed(2),
                                            sugars: (response.data.sugars).toFixed(2),
                                            fiber: (response.data.fiber).toFixed(2),
                                            calcium: (response.data.calcium).toFixed(2),
                                            iron: (response.data.iron).toFixed(2),
                                            sodium: (response.data.sodium).toFixed(2),
                                        };
                                        app.data.total = dict;
                                    });
                                });
                        });
            });    
        },                    
        
        change_privacy: function(){
            app.data.privacy_status = !app.data.privacy_status;
            
            // Set to true -- plate is private
            if (app.data.privacy_status){
                axios.get('../make_plate_private').then(function(response) {
                    axios.get('../get_public_users').then(function(response) {
                      app.data.all_public_plates = response.data.usernames;
                    });
                });
            }
            // Set to false -- plate is public
            else{
                axios.get('../make_plate_public').then(function(response) {
                    axios.get('../get_public_users').then(function(response) {
                      app.data.all_public_plates = response.data.usernames;
                    });
                });
            }
        },
        
        filter_plate_search: function(){
            app.vue.plate_search_results = [];
            for (i in app.data.all_public_plates){
                if (app.data.all_public_plates[i][0]['username'].startsWith(app.data.plates_search_bar)){
                    app.vue.plate_search_results.push(app.data.all_public_plates[i][0].username);
                }
            }
        },
        
        display_public_table: function(username) {
            axios.post("../get_public_plate", { username: username })
              .then(function(response) {
                app.data.public_plate = response.data.plate;
              })
              .catch(function(error) {
              });
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
            app.data.food_name = food.description;
            
            app.data.proteins = food.foodNutrients[0].amount; // grams
            app.data.lipid_fat = food.foodNutrients[1].amount; // grams
            app.data.carbs = food.foodNutrients[2].amount; // grams
            app.data.calories = food.foodNutrients[3].amount;
            app.data.sugars = food.foodNutrients[8].amount; // grams
            app.data.fiber = food.foodNutrients[9].amount; // grams
            app.data.calcium = food.foodNutrients[10].amount; // mg
            app.data.iron = food.foodNutrients[11].amount; // mg
            app.data.sodium = food.foodNutrients[15].amount; // mg         

            app.data.searchResults = [];
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
        // Show loading message
        app.vue.isLoading = true;
    
        // Fetch plate data from the server
        axios.get('../get_plate').then(function(response) {
            app.vue.plate = response.data.rows;
        });
    
        // Fetch all foods data from the server
        axios.get('../get_food_data').then(function(response) {
            app.data.all_foods = response.data;
            app.vue.isLoading = false;
            
            if(app.data.add_food_mode == true){
                // Hide loading message after the data is loaded
                app.methods.main_page_button();
                app.methods.add_entry_button();
            }
            else if(app.data.view_nutrition_mode == true){
                // Hide loading message after the data is loaded
                app.methods.main_page_button();
                app.methods.view_info_button();
            }
        });
    
        // Updates totals table
        axios.post("../update_total", { plate: app.data.plate }).then(function (response) {
            const dict = {
                quantity: response.data.quantity,
                calories: (response.data.calories).toFixed(2),
                proteins: (response.data.proteins).toFixed(2),
                lipid_fat: (response.data.lipid_fat).toFixed(2),
                carbs: (response.data.carbs).toFixed(2),
                sugars: (response.data.sugars).toFixed(2),
                fiber: (response.data.fiber).toFixed(2),
                calcium: (response.data.calcium).toFixed(2),
                iron: (response.data.iron).toFixed(2),
                sodium: (response.data.sodium).toFixed(2),
            };
            app.data.total = dict;
        });
    
        axios.get('../get_public_users').then(function(response) {
            app.data.all_public_plates = response.data.usernames;
        });
    };    

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code in it. 
init(app);
