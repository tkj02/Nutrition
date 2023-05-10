# Nutrition

<strong>Description</strong>
<br>This app will allow users to visualize how nutritious their meals are. There will be options to choose common foods such as eggs, broccoli, and oranges, and users can view their nutritional information for set servings. As items are chosen, the user can specify how much they would like to add to their table and see their running total in terms of carbohydrates, sugars, proteins, and other such values across all selections. This app will highlight where users are getting too much or too little of a category. It will be useful for people who want to visualize their intake and get a better idea of their health goals.

<strong>Main Pages</strong>
<br>There will be three pages to this project: the main page where the user can see a table that contains all foods on their plate as well as a smaller table at the bottom that summarizes their nutrition, another page that resembles a form to select foods to add to the table, and another page view each food’s nutritional information. We will implement this app in JavaScript.
<br>![IMG_0561](https://user-images.githubusercontent.com/95245871/236995197-16462293-755f-4aeb-85bd-a4378ae6d460.PNG)
<br>![Untitled 79](https://user-images.githubusercontent.com/95245871/236995155-e9d457ed-951d-4f64-bb2e-a16a3a20fdc3.png)
<br>![IMG_0562](https://user-images.githubusercontent.com/95245871/236995215-a319707e-6c80-4771-92d7-e02fae64608e.PNG)

<strong>Data Organization</strong>
<br>As seen with the images above, there are three database tables that will be used although they are all very similar. Each of our database tables will consist of a foods nutrional information (carbs, calories, sugars, etc.) along with the amount of servings. For the main table there will also be a name column for each different food. This will be the only table that can be edited by addiing, deleting, and editing entries. The only part of the entry that may be edited will be the name and number of servings of each food. The other table on the main page will simply show the added totals of the nutrional facts for the foods input by the user in the table mentioned above. The last data table will be another table similar to these but it will display the nutrional facts of only the food that is selected. As for the nutrional data itself we will gather the information from https://fdc.nal.usda.gov/download-datasets.html which holds a bunch of data reported by the US Department of Agriculture. 
