    
function addTodo(dayId) {
    //get the objects for todos inputs and time inputs
    var inputId = "#todo-input-" + dayId;
    var timeFrameId = "#timeframe-input-" + dayId;
    var listId = "#todo-list-" + dayId;
    var todoText = $(inputId).val(); // get exact input of text
    var timeText = $(timeFrameId).val();

    if (todoText && timeText) { //if todoText and timeText are not empty
        insertSorted(listId, todoText, timeText); //call function that inserts todo in the right order based off it's time.
        $(inputId).val(""); // Clear the input field
        $(timeFrameId).val(""); // Clear the time field
        saveTodos(dayId); // Save updated list
    } else {
        alert("Please enter both a to-do and a time.");
    }
}

//--------------------------------------------
function insertSorted(listId, text, time) {
    var newItem = $("<li>").text(text + " (" + time + ")"); //creates a new list item with the textual form of the todo and time. 
    var added = false;
    var newItemTimeValue = getTimeValue(time); //gets the value of the time in terms of minutes past midnight

    // Check if the time value is valid before proceeding
    if (newItemTimeValue === null) {
        console.error("Invalid time format:", time);
        alert("Invalid time format. Please enter time as hh:mm-hh:mm.");
        return; // Stop the function if the time is invalid
    }

    // Find the correct position based on time
    $(listId + " li").each(function() {
        //now check each list item and see if the time is before current time. 
        var currentItemTime = $(this).text().match(/\(([^)]+)\)/)[1];
        //get the text of current list item being looped through, match time value between the parenthesis, 
        var currentItemTimeValue = getTimeValue(currentItemTime);
        //getTimevalue of each element in the list. 
        if (currentItemTimeValue !== null && newItemTimeValue < currentItemTimeValue) {
            // if the newItem's time is less than the curentItemTime in the list we are loopoing through, insert the newItem before the currentItem.
            $(this).before(newItem);
            added = true;
            return false; // break the loop
        }
    });

    // In the case that there is nothing yet added to the list, append at the todo to the end of the list. 
    if (!added) {
        $(listId).append(newItem);
    }
}

function getTimeValue(time) {
    //gets the time value in minutes after midnight
    var match = time.match(/^(\d{1,2}):(\d{2})/);
    //Checks if match is valid for the beginning time  ex. 5:30, firm starting point. not firm ending point; no $ sign
    //parenthesis around the \d{1,2} and \d{2}, to get exact matches for match[1] and match[2] match[0]=entire match (1:00), match[1] hours: 1, match[2] minutes: 2
    
    if (match) { //if match is valid get hours and minutes and get the time since midnight
        var hours = parseInt(match[1],10);
        var minutes = parseInt(match[2],10);
        var time = hours*60+minutes;
        return time;
    } else {
    return null; // Return null if the time format is incorrect
    }
}

//----------------------
//making a function to save todos to local storage
function saveTodos(dayId) {
  var todos = [];
  $("#todo-list-" + dayId + " li").each(function() {
    var fullText = $(this).text();
    var match = fullText.match(/^(.+) \(([^)]+)\)$/); // Regex to extract text and time
    if (match) {
      todos.push({text: match[1], time: match[2]});
        //add to array text and time corresponding to the match
        //object literal contains keys within the object
        //we stay in object literal format to get into JSON format later. 
    } else {
      console.log('No match for:', fullText);
    }
  });
  console.log('Saving todos:', todos);
  localStorage.setItem("todos-" + dayId, JSON.stringify(todos));
    //command to save todos to local storage 
    //localStorage.setItem(key, value)
    //value doesn't need to be in the form of a JSON-formatted string
}

//making the todos appear when the page loads. ??
$(document).ready(function(){
  loadTodos("monday"); //for monday, do the others later, calls a function that loads the todos saved in the localstorage
  removeTodos("monday");
  loadTodos("tuesday");
  removeTodos("tuesday");
  loadTodos("wednesday");
  removeTodos("wednesday");
  loadTodos("thursday");
  removeTodos("thursday");
  loadTodos("friday");
  removeTodos("friday");
  loadTodos("saturday");
  removeTodos("saturday");
  loadTodos("sunday");
  removeTodos("sunday");
})

function removeTodos(dayId){
    $("#todo-list-" + dayId).on("click","li",function(){
        $(this).remove();
        saveTodos(dayId);
    })
}

function loadTodos(dayId) {
  var todos = JSON.parse(localStorage.getItem("todos-" + dayId));
    //JSON.parse to get the javascript data structure back from its JSON string stored in the local storage. 
  console.log('Loaded todos:', todos);
  if (todos) {
    todos.forEach(function(todo) {
        //for each todo in todos array, we list the todo and its corres. time
      if (todo.text && todo.time) {
        var todoItem = $("<li>").text(todo.text + " (" + todo.time + ")");
        $("#todo-list-" + dayId).append(todoItem);
      } else {
        alert('Invalid todo found:', todo);
      }
    });
  }
}

//the saveTodos and loadTodos were both reformed to work. 

function clearTodos(dayId){
    $("#todo-list-"+dayId).empty();
    alert("Todos erased on "+ dayId+".");
    localStorage.removeItem("todos-"+dayId);
}
function UpdateTime(){
    var date = new Date(); 
    let Hour=date.getHours();
    let minute =date.getMinutes();
    let seconds = date.getSeconds();
    let day =date.getDay();
    if(day===1){
        day="Monday";
    } else if(day===2){
        day="Tuesday";
    } else if (day===3){
        day="Wednesday";
    } else if (day===4){
        day="Thursday";
    } else if (day===5){
        day="Friday";
    } else if (day===6){
        day="Saturday";
    } else if (day===7){
        day="Sunday";
    }
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let dayofMonth = date.getDate();
    // let period = "AM";
    if(minute<10){
        minute="0"+minute;
    }
    if(seconds<10){
        seconds="0"+seconds;
    }
    if(Hour>12){
        // Hour=Hour%12;
        // period="PM";
        $("h3").css({
            "color": "red",
            "font-weight":"bold"});
    }
    //minute symbol needs to encompass for numbers below 10. 
    $("#currentDateTime").text(day+ ", "+month+"/"+dayofMonth+"/"+year+", "+Hour+ ":"+minute+":"+seconds);
}
//run the above function every second
setInterval(UpdateTime, 100);

highlightDay();

function highlightDay(){
    date=new Date();
    if(date.getDay()===1){
        $("#monday").css({
            "background-color":"lightblue",
        })
    }else if(date.getDay()===2){
        $("#tuesday").css({
            "background-color":"lightblue",
        });
    }else if (date.getDay()===3){
            $("#wednesday").css({
                "background-color":"lightblue",
            })
    }else if(date.getDay()===4){
        $("#thursday").css({
            "background-color":"lightblue",
        })
    }else if(date.getDay()===5){
        $("#friday").css({
            "background-color":"lightblue",
        })
    }else if(date.getDay()===6){
        $("#saturday").css({
            "background-color":"lightblue",
        })
    }else if(date.getDay()===7){
        $("#sunday").css({
            "background-color":"lightblue",
        })
    }
}


// $("#"+dayId).css({
//     "background-color":"blue"
//     ,})
//or we could do $(dayId).css("background-color","blue")




// $("#monday").on("click", ()=>  showTextbox()
// );

// function showTextbox(){
//   $("#test1").toggle()
//   // var x =document.getElementById("test")
//   //   if (x.style.display === "none") {
//   //     x.style.display = "block";
//   //     } else {
//   //       x.style.display = "none";
//   //     }
//   }

// //make the above jquery toggle for other days with a for loop.