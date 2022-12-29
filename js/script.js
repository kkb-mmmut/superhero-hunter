// Public key c414e95de8cbdd023b2911343539521b 
// Private Key 29a8689eb212adbfc5b93291b86acfa4329a2734
// let ts = new Date().getTime();
// let hash =MD5(ts + PRIVATE_KEY + PUBLIC_KEY).toString(); 
// hash md5(hash) =  5631013c3bfa9215f60e03b599c843a5  
//  Selecting from DOM  
let searchBar = document.getElementById("search-bar");
let searchResults = document.getElementById("search-results"); 
// Adding eventListener to search bar
searchBar.addEventListener("input", () => searchHeros(searchBar.value)); 
// function for API call
async function searchHeros(textSearched) {  
     if (textSearched.length == 0) {
          searchResults.innerHTML = ``;
          return;
     } 
     await fetch(`https://gateway.marvel.com/v1/public/characters?nameStartsWith=${textSearched}&apikey=c414e95de8cbdd023b2911343539521b&hash=5631013c3bfa9215f60e03b599c843a5&ts=1`)
          .then(res => res.json()) 
          .then(data => showSearchedResults(data.data.results)) 
} 
// Function for displaying the searched results in DOM 
// SearchedHero is the array of objects which matches the string entered in the searched bar
function showSearchedResults(searchedHero) { 
     let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
     if(favouritesCharacterIDs == null){ 
          favouritesCharacterIDs = new Map();
     }
     else if(favouritesCharacterIDs != null){ 
          favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
     } 
     searchResults.innerHTML = ``; 
     let count = 1; 
     for (const key in searchedHero) {
          // if count <= 5 then only we display &other results are discarded
          if (count <= 5) { 
               let hero = searchedHero[key]; 
               searchResults.innerHTML +=
                    `
               <li class="flex-row single-search-result">
                    <div class="flex-row img-info">
                         <img class="search-hero-icon" src="${hero.thumbnail.path+'/portrait_medium.' + hero.thumbnail.extension}" alt="">
                         <div class="hero-info">
                              <a class="character-info" href="./more-info.html">
                                   <span class="hero-name">${hero.name}</span>
                              </a>
                         </div>
                    </div>
                    <div class="flex-col buttons">
                         <!-- <button class="btn"><i class="fa-solid fa-circle-info"></i> &nbsp; More Info</button> -->
                         <button class="btn add-to-fav-btn">${favouritesCharacterIDs.has(`${hero.id}`) ? "<i class=\"fa-solid fa-heart-circle-minus\"></i> &nbsp; Remove from Favourites" :"<i class=\"fa-solid fa-heart fav-icon\"></i> &nbsp; Add to Favourites</button>"}
                    </div>
                    <div style="display:none;">
                         <span>${hero.name}</span>
                         <span>${hero.description}</span>
                         <span>${hero.comics.available}</span>
                         <span>${hero.series.available}</span>
                         <span>${hero.stories.available}</span>
                         <span>${hero.thumbnail.path+'/portrait_uncanny.' + hero.thumbnail.extension}</span>
                         <span>${hero.id}</span>
                         <span>${hero.thumbnail.path+'/landscape_incredible.' + hero.thumbnail.extension}</span>
                         <span>${hero.thumbnail.path+'/standard_fantastic.' + hero.thumbnail.extension}</span>
                    </div>
               </li>
               `
          }
          count++;
     } 
     events();
} 
// Function for attacthing eventListener to buttons
function events() {
     let favouriteButton = document.querySelectorAll(".add-to-fav-btn");
     favouriteButton.forEach((btn) => btn.addEventListener("click", addToFavourites));

     let characterInfo = document.querySelectorAll(".character-info");
     characterInfo.forEach((character) => character.addEventListener("click", addInfoInLocalStorage))
} 
// Function invoked when "Add to Favourites" button or "Remvove from favourites" button is click appropriate action is taken accoring to the button clicked
function addToFavourites() { 
     if (this.innerHTML == '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites') { 
          let heroInfo = {
               name: this.parentElement.parentElement.children[2].children[0].innerHTML,
               description: this.parentElement.parentElement.children[2].children[1].innerHTML,
               comics: this.parentElement.parentElement.children[2].children[2].innerHTML,
               series: this.parentElement.parentElement.children[2].children[3].innerHTML,
               stories: this.parentElement.parentElement.children[2].children[4].innerHTML,
               portraitImage: this.parentElement.parentElement.children[2].children[5].innerHTML,
               id: this.parentElement.parentElement.children[2].children[6].innerHTML,
               landscapeImage: this.parentElement.parentElement.children[2].children[7].innerHTML,
               squareImage: this.parentElement.parentElement.children[2].children[8].innerHTML
          } 
          let favouritesArray = localStorage.getItem("favouriteCharacters");

          // If favouritesArray is null (for the first time favourites array is null)
          if (favouritesArray == null) { 
               favouritesArray = [];
          } else { 
               favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
          } 
          let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");

          
          if (favouritesCharacterIDs == null) { 
               favouritesCharacterIDs = new Map();
          } else { 
               favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs"))); 
          } 
          favouritesCharacterIDs.set(heroInfo.id, true);  
          favouritesArray.push(heroInfo); 
          localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs])); 
          localStorage.setItem("favouriteCharacters", JSON.stringify(favouritesArray)); 
          this.innerHTML = '<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites'; 
          document.querySelector(".fav-toast").setAttribute("data-visiblity","show"); 
          setTimeout(function(){
               document.querySelector(".fav-toast").setAttribute("data-visiblity","hide");
          },1000);
     }
     // For removing the heros form favourites
     else{
          
          // storing the id of character in a variable 
          let idOfCharacterToBeRemoveFromFavourites = this.parentElement.parentElement.children[2].children[6].innerHTML; 
          let favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters")); 
          let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs"))); 
          let newFavouritesArray = []; 
          favouritesCharacterIDs.delete(`${idOfCharacterToBeRemoveFromFavourites}`); 
          favouritesArray.forEach((favourite) => { 
               if(idOfCharacterToBeRemoveFromFavourites != favourite.id){
                    newFavouritesArray.push(favourite);
               }
          }); 
          // Updating the new array in localStorage
          localStorage.setItem("favouriteCharacters",JSON.stringify(newFavouritesArray));
          localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs])); 
          // Convering the "Remove from Favourites" button to "Add to Favourites" 
          this.innerHTML = '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites'; 
          document.querySelector(".remove-toast").setAttribute("data-visiblity","show"); 
          setTimeout(function(){
               document.querySelector(".remove-toast").setAttribute("data-visiblity","hide");
          },1000); 
     }     
}

// Function which stores the info object of character for which user want to see the info 
function addInfoInLocalStorage() { 
     let heroInfo = {
          name: this.parentElement.parentElement.parentElement.children[2].children[0].innerHTML,
          description: this.parentElement.parentElement.parentElement.children[2].children[1].innerHTML,
          comics: this.parentElement.parentElement.parentElement.children[2].children[2].innerHTML,
          series: this.parentElement.parentElement.parentElement.children[2].children[3].innerHTML,
          stories: this.parentElement.parentElement.parentElement.children[2].children[4].innerHTML,
          portraitImage: this.parentElement.parentElement.parentElement.children[2].children[5].innerHTML,
          id: this.parentElement.parentElement.parentElement.children[2].children[6].innerHTML,
          landscapeImage: this.parentElement.parentElement.parentElement.children[2].children[7].innerHTML,
          squareImage: this.parentElement.parentElement.parentElement.children[2].children[8].innerHTML
     }

     localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}
// Selection of theme button
let themeButton = document.getElementById("theme-btn");

themeButton.addEventListener("click",themeChanger);

// IIFE fuction which checks the localStorage and applies the presviously set theme
(function (){
     let currentTheme = localStorage.getItem("theme");
     if(currentTheme == null){
          root.setAttribute("color-scheme","light");
          themeButton.innerHTML = `<i class="fa-solid fa-moon"></i>`;
          themeButton.style.backgroundColor="#043357";
          localStorage.setItem("theme","light");
          return;
     }

     switch(currentTheme){
          case "light":
               root.setAttribute("color-scheme","light");
               themeButton.innerHTML = `<i class="fa-solid fa-moon"></i>`;
               themeButton.style.backgroundColor="#043357 ";
               break;
          case "dark":
               root.setAttribute("color-scheme","dark");
               themeButton.innerHTML = `<i class="fa-solid fa-sun"></i>`;
               themeButton.style.backgroundColor="#de0707";
               themeButton.childNodes[0].style.color = "black";
               break;
     }
})();

// function for handeling button changes
function themeChanger(){
     let root = document.getElementById("root"); 
     if(root.getAttribute("color-scheme") == "light"){
          root.setAttribute("color-scheme","dark");
          themeButton.innerHTML = `<i class="fa-solid fa-sun"></i>`;
          themeButton.style.backgroundColor="#de0707";
          themeButton.childNodes[0].style.color = "black";
          localStorage.setItem("theme","dark");
     }
     else if(root.getAttribute("color-scheme") == "dark"){
          root.setAttribute("color-scheme","light");
          themeButton.innerHTML = `<i class="fa-solid fa-moon"></i>`;
          themeButton.style.backgroundColor="#043357";
          themeButton.childNodes[0].style.color = "white";
          localStorage.setItem("theme","light");
     }
}