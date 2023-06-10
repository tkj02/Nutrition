# Nutrition

<strong>Description</strong>
<br>This app will allow users to visualize how nutritious their meals are. There will be options to choose common foods such as eggs, broccoli, and oranges, and users can view their nutritional information for set servings. As items are chosen, the user can specify how much they would like to add to their table and see their running total in terms of carbohydrates, sugars, proteins, and other such values across all selections. This app will highlight where users are getting too much or too little of a category. It will be useful for people who want to visualize their intake and get a better idea of their health goals.

<strong>Main Pages</strong>
<br>Originally, we imagined three pages to this project using Vue.js: the main page where the user can see a table that contains all foods on their plate as well as a smaller table at the bottom that summarizes their nutrition, another page that resembles a form to select foods to add to the table, and another page view each food’s nutritional information. In the end, we created a fourth page where users can lookup other users' plates if they are set publicly. Our sketches can be seen below.
<br>![IMG_0561](https://user-images.githubusercontent.com/95245871/236995197-16462293-755f-4aeb-85bd-a4378ae6d460.PNG)
<br>![Untitled 79](https://user-images.githubusercontent.com/95245871/236995155-e9d457ed-951d-4f64-bb2e-a16a3a20fdc3.png)
<br>![IMG_0562](https://user-images.githubusercontent.com/95245871/236995215-a319707e-6c80-4771-92d7-e02fae64608e.PNG)

<strong>Data Organization</strong>
<br>We will use three databases. One database consists of nutrional information (carbohydrates, calories, sugars, etc.) along with a number of servings. Another keeps track of the users who made their plates public. Our third databse tracks all users and their account information. For the main plate table, there will be a name column for each different food. This will be the only table that can be edited by addiing, deleting, and editing entries. The only part of the entry that will be edited is the number of servings of each food. The other table on the main page will simply show the added totals of the nutrional facts for the foods input by the user in the table mentioned above. The last data table will be another table similar to these but it will display the nutrional facts of only the food that is selected. As for the nutrional data itself we will gather the information from https://fdc.nal.usda.gov/download-datasets.html which holds data reported by the US Department of Agriculture. 

<strong>User Stories</strong>
<br>The nutrition tracking app we are building will allow users to create an account, select common foods, and view their nutritional information for set servings. The app will provide a summary of the user's nutritional intake across all selections at the bottom. Users can edit their plate by adding, deleting, or editing entries and modifying the name and number of servings of each food to fit their dietary needs.
<br><img width="1440" alt="Screen Shot 2023-06-09 at 9 51 33 PM" src="https://github.com/tkj02/Nutrition/assets/95245871/ee1010a9-8fd3-432b-b4e5-8355ba705662">
<br>Users can add selected foods to a table that displays all the foods on their plate and their nutritional information, and specify the amount of each food to see the running total of their nutritional values.
<br><img width="1440" alt="Screen Shot 2023-06-09 at 9 51 49 PM" src="https://github.com/tkj02/Nutrition/assets/95245871/6e2e5600-27ae-4dac-bd2c-a67bfca6d32d">
<br>Additionally, users can view the nutritional details of each food item by searching for it on the "View Nutrition" page.
<br><img width="1440" alt="Screen Shot 2023-06-09 at 9 52 09 PM" src="https://github.com/tkj02/Nutrition/assets/95245871/9c2412d9-9807-45d4-930c-48459e6c82a5">
<br>Users can also look up plates created by other users who chose to make their data public.
<br><img width="1440" alt="Screen Shot 2023-06-09 at 9 52 44 PM" src="https://github.com/tkj02/Nutrition/assets/95245871/b1670678-2c1e-4405-885f-88fa525cfd26">

<strong>Implementation Plan</strong>
<br>Our team of three plans to divide the work based on each member's strengths and expertise. During the first two-week period, we will focus on setting up the database and building the form page for selecting and adding foods to the table. In the second period, we will work on building the main page with the table that displays all added foods and their nutritional information, as well as the table that summarizes the nutritional content. Finally, in the third period, we will focus on building the food details page that displays the nutritional information for a selected food, fine-tuning the app, and testing for bugs and errors. We plan to hold regular check-ins to ensure that everyone is on track and has the support they need, while also remaining flexible to help each other out as needed.
