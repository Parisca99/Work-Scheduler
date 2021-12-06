// my javascript for bobo

var day_array = [];

function pageInit()
{
    console.log("running pageInit");
}


function pageReady()
{
    console.log("running pageReady");

    day_array = [ 
                     //["hour","note","edit"],
                     ["9am" ,"",""],
                     ["10am" ,"",""],
                     ["11am" ,"",""],
                     ["12pm" ,"",""],
                     ["1pm" ,"",""],
                     ["2pm","",""],
                     ["3pm" ,"",""],
                     ["4pm" ,"",""],
                     ["5pm" ,"",""],
                     ["6pm" ,"",""]
                  ]

    loadData();

    var TableGenerator = document.querySelector("#TableGenerator");
    var day_table = makeTable($(TableGenerator),day_array);
                    makeTableEventListerners (day_array);
                    updateTable();
}

function makeTable(container, data) {
    var table = $("<table/>").addClass('CSSTableGenerator');
    $.each(data, function(rowIndex, r) {
        var row = $("<tr/>");
        var rowid    = "none";
        var buttonid = "none";
        $.each(r, function(colIndex, c) { 
            //console.log("maketable() " + rowIndex +" "+ colIndex);
            var classid="TableGeneratorCol";
            if (colIndex == 0) { 
                var classid = "hour";
                row.append($("<td class="+ classid +"/>").text(c));
                rowid = c;
            }
            if (colIndex == 1) { 
                var classid   = "past";
                var entryid   = "entry" + rowid;
                var tdentryid = "tdentry" + rowid;
                //row.append($("<td id=" + entryid + " class="+ classid +"/>").text(c));
                row.append("<td id=" + tdentryid + " class=" + classid + ">" + "<textarea id=" + entryid +  " class=textentry>" + c + "</textarea>" + "</td>");
            }
            if (colIndex == 2) { 
                var classid = "button";
                var buttonid = "btn" + rowid;
                row.append("<td class="+ classid +">" + "<button id=" + buttonid + " class=saveBtn>" + c + "</button>" + "</td>");
            }
            
        });
        table.append(row);

  
    });

    return container.append(table);
}


function updateTable()
{
    var date = new Date();

    console.log("updateTable() at " + date.toLocaleString()); 

    $.each(day_array, function(rowIndex, r) {
        var rowid    = "none";
        $.each(r, function(colIndex, c) { 
            if (colIndex == 0) {  rowid = c; }
        });
        var tdentryid = "tdentry" + rowid;
        var tdentry   = document.getElementById(tdentryid);
        tdentry.classList.remove("past", "present", "future");

        var now_hours = date.getHours();
        var row_hours = rowid.replace(" ","");
        if ( rowid.includes("am")) { rowid.replace("am",""); row_hours = parseInt(rowid);}
        if ( rowid.includes("pm")) { rowid.replace("pm",""); row_hours = parseInt(rowid) + 12; }
        if ( row_hours <  1  ) { row_hours = 1;}
        if ( row_hours >= 24 ) { row_hours = row_hours - 12;}

        if (row_hours <  now_hours) { tdentry.classList.add("past");  }
        if (row_hours == now_hours) { tdentry.classList.add("present");  }
        if (row_hours >  now_hours) { tdentry.classList.add("future");  }
 
        //console.log("   row = " + rowIndex + " rowid= " + rowid + " now = " + now_hours + " row hours = " + row_hours);
        
    });

}

function makeTableEventListerners (data)
{
    $.each(data, function(rowIndex, r) {
        var rowid    = "none";
        $.each(r, function(colIndex, c) { 
            if (colIndex == 0) {  rowid = c; }
        });
        var buttonid = "btn" + rowid;
        var button = document.getElementById(buttonid);
        //console.log("buttonid=" + buttonid + "  doc=" + typeof button);
        button.addEventListener("click", saveEntry.bind(null,rowIndex,rowid) );
    });
}





function saveEntry(rowIndex, rowid)
{
    
    var entryid = "entry" + rowid;
    var textarea = document.getElementById(entryid);
    var entry    = textarea.value;

    day_array[rowIndex][1] = entry;
    console.log("running saveEntry (" + rowIndex + " , " + rowid + ") = " + entry);

    saveData();
    loadData();
}


function saveData ()
{
   console.log("running saveData");
   localStorage.setItem("__day_array", JSON.stringify(day_array));
}

function loadData ()
{
   var json_data = localStorage.getItem("__day_array");
   if (json_data != null ) {
    console.log("running loadData");
     //console.log("json=" + json_data);
     day_array = JSON.parse(json_data);
   }
}


function clock() {
    var date = new Date();
    var clockElement = document.getElementById('clock');

    // Replace '400px' below with where you want the format to change.
    if (window.matchMedia('(max-width: 400px)').matches) {
        // Use this format for windows with a width up to the value above.
        clockElement.textContent = date.toLocaleString();
    } else {
        // While this format will be used for larger windows.
        clockElement.textContent = date.toString();
    }
}



window.onload = pageInit;
jQuery(document).ready(pageReady);
setInterval(clock, 1000);
setInterval(updateTable, 60000);
