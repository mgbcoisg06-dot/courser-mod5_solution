(function (global) {

var dc = {};

// Embedded HTML templates (work offline without file:// CORS issues)
var homeHtml = '<div class="container-fluid"><div class="row"><div class="col-md-4 col-sm-6 col-xs-12"><a href="#" onclick="$dc.loadMenuCategories(); return false;"><div class="category-tile"><span>Menu</span></div></a></div><div class="col-md-4 col-sm-6 col-xs-12"><a href="#" onclick="$dc.loadMenuItems({{randomCategoryShortName}}); return false;"><div class="category-tile"><span>Specials</span></div></a></div><div class="col-md-4 col-sm-6 col-xs-12"><a href="#"><div class="category-tile"><span>Map</span></div></a></div></div></div>';

var categoriesTitleHtml = '<h2 class="text-center">Menu Categories</h2>';
var categoryHtml = '<div class="col-md-3 col-sm-4 col-xs-6 col-xxs-12"><a href="#" onclick="$dc.loadMenuItems(\'{{short_name}}\'); return false;"><div class="category-tile text-center"><span>{{name}}</span></div></a></div>';

var menuItemsTitleHtml = '<h2 class="text-center">Menu Items</h2><p class="text-center">{{special_instructions}}</p>';
var menuItemHtml = '<div class="col-xs-12"><div class="menu-item-tile"><h3>{{name}}</h3><p>{{description}}</p></div></div>';

// Sample categories data (embedded - works offline)
var sampleCategories = [
  {"id": 1, "short_name": "L", "name": "Lunch", "special_instructions": "Enjoy our lunch specials"},
  {"id": 2, "short_name": "D", "name": "Dinner", "special_instructions": "Dinner menu available after 4pm"},
  {"id": 3, "short_name": "S", "name": "Sushi", "special_instructions": "Fresh sushi daily"},
  {"id": 4, "short_name": "SP", "name": "Soup", "special_instructions": "Homemade soups"},
  {"id": 5, "short_name": "A", "name": "Appetizer", "special_instructions": "Start your meal right"},
  {"id": 6, "short_name": "DS", "name": "Dessert", "special_instructions": "Sweet treats"}
];

// Sample menu items data (embedded - works offline)
var sampleMenuItems = {
  "L": {
    "category": {"id": 1, "short_name": "L", "name": "Lunch", "special_instructions": "Enjoy our lunch specials"},
    "menu_items": [
      {"id": 1, "short_name": "L1", "name": "Kung Pao Chicken", "description": "Spicy chicken with peanuts", "price_small": 8.95},
      {"id": 2, "short_name": "L2", "name": "Beef Lo Mein", "description": "Noodles with beef and vegetables", "price_small": 9.50},
      {"id": 3, "short_name": "L3", "name": "Sweet and Sour Pork", "description": "Crispy pork in tangy sauce", "price_small": 9.25}
    ]
  },
  "D": {
    "category": {"id": 2, "short_name": "D", "name": "Dinner", "special_instructions": "Dinner menu available after 4pm"},
    "menu_items": [
      {"id": 4, "short_name": "D1", "name": "Peking Duck", "description": "Traditional roasted duck", "price_small": 18.95},
      {"id": 5, "short_name": "D2", "name": "General Tso's Chicken", "description": "Spicy chicken dish", "price_small": 12.50},
      {"id": 6, "short_name": "D3", "name": "Mongolian Beef", "description": "Tender beef with scallions", "price_small": 14.75}
    ]
  },
  "S": {
    "category": {"id": 3, "short_name": "S", "name": "Sushi", "special_instructions": "Fresh sushi daily"},
    "menu_items": [
      {"id": 7, "short_name": "S1", "name": "California Roll", "description": "Crab, avocado, cucumber", "price_small": 5.95},
      {"id": 8, "short_name": "S2", "name": "Dragon Roll", "description": "Eel and cucumber", "price_small": 8.95},
      {"id": 9, "short_name": "S3", "name": "Salmon Sashimi", "description": "Fresh salmon slices", "price_small": 10.50}
    ]
  },
  "SP": {
    "category": {"id": 4, "short_name": "SP", "name": "Soup", "special_instructions": "Homemade soups"},
    "menu_items": [
      {"id": 10, "short_name": "SP1", "name": "Hot and Sour Soup", "description": "Spicy and tangy", "price_small": 4.50},
      {"id": 11, "short_name": "SP2", "name": "Wonton Soup", "description": "Dumplings in clear broth", "price_small": 4.95}
    ]
  },
  "A": {
    "category": {"id": 5, "short_name": "A", "name": "Appetizer", "special_instructions": "Start your meal right"},
    "menu_items": [
      {"id": 12, "short_name": "A1", "name": "Spring Rolls", "description": "Crispy vegetable rolls", "price_small": 5.50},
      {"id": 13, "short_name": "A2", "name": "Crab Rangoon", "description": "Creamy crab wontons", "price_small": 6.95}
    ]
  },
  "DS": {
    "category": {"id": 6, "short_name": "DS", "name": "Dessert", "special_instructions": "Sweet treats"},
    "menu_items": [
      {"id": 14, "short_name": "DS1", "name": "Mango Pudding", "description": "Refreshing mango dessert", "price_small": 4.95},
      {"id": 15, "short_name": "DS2", "name": "Fried Banana", "description": "Sweet fried bananas", "price_small": 5.50}
    ]
  }
};

// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<p>Loading...</p></div>";
  insertHtml(selector, html);
};

// Return substitute of '{{propName}}' with propValue in given 'template'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string
    .replace(new RegExp(propToReplace, "g"), propValue);
  return string;
};

// Remove the class 'active' from home and switch to Menu button
var switchMenuToActive = function () {
  // Remove 'active' from home button
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  // Add 'active' to menu button
  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

// Function to show home page HTML
var showHomeHtml = function (categories) {
  // Ensure we have categories
  if (!categories || categories.length === 0) {
    console.error("No categories available to display");
    return;
  }
  
  // Use embedded template (works offline without file:// CORS issues)
  var homeHtmlSnippet = homeHtml;
  
  // Select a random category from the categories array
  var chosenCategory = chooseRandomCategory(categories);
  
  // Ensure we got a valid category
  if (!chosenCategory || !chosenCategory.short_name) {
    console.error("Failed to select a valid random category");
    return;
  }
  
  var chosenCategoryShortName = chosenCategory.short_name;
  
  // Replace the placeholder with the random category short_name
  // Note: We wrap it in quotes since it will be inside an onclick attribute
  var homeHtmlToInsert = insertProperty(homeHtmlSnippet, "randomCategoryShortName", "'" + chosenCategoryShortName + "'");
  
  // Insert the processed HTML into the main content area
  insertHtml("#main-content", homeHtmlToInsert);
};

// Given array of category objects, returns a random category object.
var chooseRandomCategory = function (categories) {
  // Ensure we have categories to choose from
  if (!categories || categories.length === 0) {
    return null;
  }
  
  // Choose a random index into the array (from 0 inclusively until array length (exclusively))
  var randomArrayIndex = Math.floor(Math.random() * categories.length);

  // return category object with that randomArrayIndex
  return categories[randomArrayIndex];
};

// Function to switch navigation active state to home
var switchHomeToActive = function () {
  // Remove 'active' from menu button
  var classes = document.querySelector("#navMenuButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navMenuButton").className = classes;

  // Add 'active' to home button
  classes = document.querySelector("#navHomeButton").className;
  if (classes.indexOf("active") === -1) {
    classes += " active";
    document.querySelector("#navHomeButton").className = classes;
  }
};

// Public method to load home page (called when clicking home button or logo)
dc.showHomePage = function () {
  // Switch active state to home
  switchHomeToActive();
  
  // Use embedded sample data (works offline)
  showHomeHtml(sampleCategories);
};

// Load the menu categories view
dc.loadMenuCategories = function () {
  // Switch CSS class active to menu button
  switchMenuToActive();
  
  // Use embedded sample data (works offline)
  buildAndShowCategoriesHTML(sampleCategories);
};


// Load the menu items view
// 'categoryShort' is a short_name for a category: "L", "D", etc.
dc.loadMenuItems = function (categoryShort) {
  // Validate categoryShort
  if (!categoryShort) {
    console.error("No category specified");
    return;
  }
  
  // Remove quotes if present (from onclick attribute)
  categoryShort = categoryShort.replace(/['"]/g, '');
  
  // Use embedded sample data (works offline)
  if (sampleMenuItems[categoryShort]) {
    buildAndShowMenuItemsHTML(sampleMenuItems[categoryShort]);
  } else {
    console.error("Category not found: " + categoryShort);
    insertHtml("#main-content", "<p>Category not found: " + categoryShort + "</p>");
  }
};


// Builds HTML for the categories page based on the data
function buildAndShowCategoriesHTML (categories) {
  // Switch CSS class active to menu button
  switchMenuToActive();
  
  // Use embedded template (works offline)
  var categoriesViewHtml = buildCategoriesViewHtml(categories, categoriesTitleHtml);
  insertHtml("#main-content", categoriesViewHtml);
}


// Using categories data and snippets we received from the server,
// build categories view HTML to be inserted into page
function buildCategoriesViewHtml(categories,
                                 categoriesTitleHtml) {

  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over categories
  for (var i = 0; i < categories.length; i++) {
    // Insert category values
    var html = categoryHtml;
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html = insertProperty(html, "name", name);
    html = insertProperty(html, "short_name", short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}



// Builds HTML for the single category page based on the data
function buildAndShowMenuItemsHTML (categoryMenuItems) {
  // Switch CSS class active to menu button
  switchMenuToActive();
  
  // Use embedded template (works offline)
  var menuItemsViewHtml = buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml);
  insertHtml("#main-content", menuItemsViewHtml);
}


// Using category and menu items data and snippets we received from the server,
// build menu items view HTML to be inserted into page
function buildMenuItemsViewHtml(categoryMenuItems,
                                 menuItemsTitleHtml) {

  menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,
                                       "name",
                                       categoryMenuItems.category.name);
  menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,
                                       "special_instructions",
                                       categoryMenuItems.category.special_instructions);

  var finalHtml = menuItemsTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over menu items
  var menuItems = categoryMenuItems.menu_items;
  var catShortName = categoryMenuItems.category.short_name;
  for (var i = 0; i < menuItems.length; i++) {
    // Insert menu item values
    var html = menuItemHtml;
    html = insertProperty(html, "short_name", catShortName);
    html = insertProperty(html, "name", menuItems[i].name);
    html = insertProperty(html, "description", menuItems[i].description);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}


// Expose $dc to global scope BEFORE setting up event listeners
global.$dc = dc;

// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {
  // Set up navigation event listeners - $dc is now available globally
  var homeLink = document.getElementById('home-link');
  var homeNavLink = document.getElementById('home-nav-link');
  var menuNavLink = document.getElementById('menu-nav-link');
  
  if (homeLink) {
    homeLink.addEventListener('click', function(e) {
      e.preventDefault();
      if ($dc && $dc.showHomePage) {
        $dc.showHomePage();
      }
    });
  }
  
  if (homeNavLink) {
    homeNavLink.addEventListener('click', function(e) {
      e.preventDefault();
      if ($dc && $dc.showHomePage) {
        $dc.showHomePage();
      }
    });
  }
  
  if (menuNavLink) {
    menuNavLink.addEventListener('click', function(e) {
      e.preventDefault();
      if ($dc && $dc.loadMenuCategories) {
        $dc.loadMenuCategories();
      }
    });
  }
  
  // STEP 0 & 1: Show the home page using embedded sample data (works offline)
  showHomeHtml(sampleCategories);
});

})(window);
