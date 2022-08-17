//asdf
class Group {
    constructor(name, size, members, unseated){
        this.name = name;
        this.size = size;
        this.members = members;
        this.unseated = true;
    }
}

class table{
    constructor(num_seats, seats_left, incl_groups){
        this.num_seats = num_seats;
        this.seats_left = seats_left;
        this.incl_groups = incl_groups;
    }
}
var all_groups = [];
var groups_dict = {};
var total_groups = 0;

function submitGroup() {
    console.log("submit group");
    //var groupname = document.getElementById("groupname").value;

    var num_group = document.getElementById("num_group").value;
    var groupname = document.getElementById("groupname").value;
    var members = document.getElementById("members").value;
    members = members.split(",");

    //validate that all fields are filled before saving to 
    //be sure to check that members array is same length as num_group
    // ^^ if they are the same length, then add to the overall array of groups

    if(num_group != "" && groupname != "" && members != ""){
        if(members.length == num_group){
            //do something
            //console.log(members.length)
            new_group = new Group(groupname, num_group, members, true);
            all_groups.push(new_group);
            console.log(new_group)
            var this_result = "Group added!";
            total_groups+=1;

            if(num_group in groups_dict){
                groups_dict[num_group].push(new_group);
                console.log(groups_dict);
                console.log("added to preexisting");
            }
            else{
                groups_dict[num_group] = [new_group];
                console.log(groups_dict);
                console.log("added new");
            }
            
        }
        else{
            //send an error message
            var this_result = "You specified an incorrect number of group members."
        }
        
    }

    document.getElementById("result").innerHTML = this_result;
  }

function toggler1() {
    var x = document.getElementById("result");
    if (x.style.display === "none"){
      x.style.display = "block";
    }
  }

function toggler2(){
    var x = document.getElementById("result");
    x.style.display = "none";
}

function function_controller(){
    var this_method = document.getElementById("methods").value;
    var tables_box = document.getElementById("tables_input").value;
    var chairs_box = document.getElementById("chairs_input").value;
    // console.log(this_method)
    if (this_method == "alone"){
        big_alone();
    }
    else if(this_method == "given_tables" && tables_box != ""){
        var num_tables = document.getElementById("tables_input").value
        giventables(num_tables);
    }
    else if(this_method == "given_chairs" && chairs_box != ""){
        var num_chairs = document.getElementById("chairs_input").value
        givenchairs(num_chairs);
    }
    else{
        automatic_seating();
    }
}

function view_controller(){
    //none
    var this_method = document.getElementById("methods").value;
    var prompt1 = document.getElementById("prompt1");
    var chairs_box = document.getElementById("chairs_input");
    var prompt2 = document.getElementById("prompt2");
    var tables_box = document.getElementById("tables_input");
    // console.log(this_method)
    if(this_method == "given_tables"){
        prompt1.hidden = true;
        chairs_box.hidden = true;
        prompt2.hidden = false;
        tables_box.hidden = false;
    }
    else if(this_method == "given_chairs"){
        console.log("got here")
        prompt2.hidden = true;
        tables_box.hidden = true;
        prompt1.hidden = false;
        chairs_box.hidden = false;

    }

    else{
        prompt1.hidden = true;
        chairs_box.hidden = true;
        prompt2.hidden = true;
        tables_box.hidden = true;
    }
}
function compare( a, b ) {
    if ( a.size > b.size ){
      return -1;
    }
    if ( a.size < b.size){
      return 1;
    }
    return 0;
  }
function automatic_seating(){
    console.log("got to automatic seating")
    //get average group size and make that the number of chairs, then call givenchairs
    // if any are larger, add them to a vector and say they get their own table
    var total = 0;
    var tables = [];
    var groups_list = all_groups;
    var max_size = 0;
    groups_list.sort(compare);

    for (let i = 0; i < all_groups.length; i++) {
        var temp = parseInt(all_groups[i].size);
        total += temp;
        if(temp > max_size){
            max_size = temp;
        }
    }

    //avg_size = total / all_groups.length;
    per_table = max_size;
    var groups_seated = 0;
    while(groups_seated < total_groups){
        curr_table = new table(per_table,per_table,[]);
        for (let i = 0; i < groups_list.length; i++){
            if(groups_list[i].size <= curr_table.seats_left && groups_list[i].unseated == true){
                console.log("inside if")
                console.log(groups_list[i]);
                console.log(curr_table.seats_left);
                curr_table.seats_left = curr_table.seats_left - groups_list[i].size;
                curr_table.incl_groups.push(groups_list[i]);
                groups_list[i].unseated = false;
                groups_seated = groups_seated + 1;
            }
            //groups_seated = groups_seated + 1;
        }
        tables.push(curr_table);
    }
    console.log(tables);
    sessionStorage.setItem("res_tables", JSON.stringify(tables));
}

function big_alone(){
    console.log("got to groups alone")
    //get average group size and ones larger than average get their own table
    var total = 0;
    var tables = [];
    var groups_list = all_groups;
    var max_size = 0;
    console.log(all_groups);
    groups_list.sort(compare);
    console.log(groups_list);

    for (let i = 0; i < all_groups.length; i++) {
        var temp = parseInt(all_groups[i].size);
        total += temp;
        if(temp > max_size){
            max_size = temp;
        }
    }

    num_seats = max_size;
    avg_size = total / all_groups.length;

    // number of seats is the size of the largest group
    // ^^ not the same thing as the average

    var groups_seated = 0;
        // 1. go through list and see if it is bigger than average
        // 2. if bigger than average, seat at its own table and push to the list of tables
        // 3. once all of the groups that are larger than average are seated on their own, go through
        //  like normal
    for (let i = 0; i < groups_list.length; i++){
        curr_table = new table(num_seats,num_seats,[]);
        if(groups_list[i].unseated == true && groups_list[i].size > avg_size){
            curr_table.seats_left = curr_table.seats_left - groups_list[i].size;
            curr_table.incl_groups.push(groups_list[i]);
            groups_list[i].unseated = false;
            groups_seated = groups_seated + 1;
            tables.push(curr_table);
        }//if unseated and larger than average
    }

    while(groups_seated < total_groups){
        curr_table = new table(num_seats,num_seats,[]);
        for (let i = 0; i < groups_list.length; i++){
            if(groups_list[i].size <= curr_table.seats_left && groups_list[i].unseated == true){
                console.log("inside if")
                console.log(groups_list[i]);
                console.log(curr_table.seats_left);
                curr_table.seats_left = curr_table.seats_left - groups_list[i].size;
                curr_table.incl_groups.push(groups_list[i]);
                groups_list[i].unseated = false;
                groups_seated = groups_seated + 1;
            }//if there is space and the group is unseated
        }//for loop going through all groups in the list
        tables.push(curr_table);
    }
    console.log(tables);
    localStorage.setItem("res_tables", tables);
    sessionStorage.setItem("res_tables", JSON.stringify(tables));
}

function givenchairs(num_chairs){

    var total = 0;
    var tables = [];
    var groups_list = all_groups;
    var max_size = 0;
    groups_list.sort(compare);
    console.log(groups_list);
    console.log("got to givenchairs")


    for (let i = 0; i < all_groups.length; i++) {
        var temp = parseInt(all_groups[i].size);
        total += temp;
        if(temp > max_size){
            max_size = temp;
        }
    }

    per_table = num_chairs;
    if(per_table < max_size){
        per_table = max_size;
    }

    var groups_seated = 0;
    while(groups_seated < total_groups){
        curr_table = new table(per_table,per_table,[]);
        for (let i = 0; i < groups_list.length; i++){
            if(groups_list[i].size <= curr_table.seats_left && groups_list[i].unseated == true){
                console.log("inside if")
                console.log(groups_list[i]);
                console.log(curr_table.seats_left);
                curr_table.seats_left = curr_table.seats_left - groups_list[i].size;
                curr_table.incl_groups.push(groups_list[i]);
                groups_list[i].unseated = false;
                groups_seated = groups_seated + 1;
            }
            //groups_seated = groups_seated + 1;
        }
        tables.push(curr_table);
    }
    console.log(tables);
    sessionStorage.setItem("res_tables", JSON.stringify(tables));
}

function giventables(num_tables){
    console.log("got to giventables")
    console.log(all_groups);

    var total = 0;
    var tables = [];
    var groups_list = all_groups;
    var max_size = 0;
    groups_list.sort(compare);
    console.log(groups_list);

    for (let i = 0; i < all_groups.length; i++) {
        var temp = parseInt(all_groups[i].size);
        total += temp;
        if(temp > max_size){
            max_size = temp;
        }
    }
    // console.log(total);

    per_table = Math.ceil(total / num_tables);
    if(per_table < max_size){
        per_table = max_size;
    }
    // console.log(per_table);
    var groups_seated = 0;
    while(groups_seated < total_groups){
        curr_table = new table(per_table,per_table,[]);
        for (let i = 0; i < groups_list.length; i++){
            if(groups_list[i].size <= curr_table.seats_left && groups_list[i].unseated == true){
                console.log("inside if")
                console.log(groups_list[i]);
                console.log(curr_table.seats_left);
                curr_table.seats_left = curr_table.seats_left - groups_list[i].size;
                curr_table.incl_groups.push(groups_list[i]);
                groups_list[i].unseated = false;
                groups_seated = groups_seated + 1;
            }
            //groups_seated = groups_seated + 1;
        }
        tables.push(curr_table);
    }
    console.log(tables);
    sessionStorage.setItem("res_tables", JSON.stringify(tables));



    //results(tables);
}


function results(){
    var res_tables = JSON.parse(sessionStorage.getItem("res_tables"));
    console.log("got to results");
    console.log(res_tables);
    var container = document.querySelector('div');
    var idx = 1;

    // for(let table in tables){
     //   var container = document.querySelector('div');
    //     var guests = `
    //     $//{function_controller()}
    //     `
    // }
    for(let table of res_tables){
        var html = `
            <div>
                <h3 class = "res_table">Table ${idx}</h3>
                    <ol id = "${idx}"></ol>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
        for(let gr of table.incl_groups){
            var container2 = document.getElementById(idx);
            var guests = `<ul class = "res_ul" id = "${gr.name}">${gr.name}</ul>`;
            container2.insertAdjacentHTML('beforeend', guests);
            for(let this_name in gr.members){
                console.log(gr.members);
                var container3 = document.getElementById(gr.name);
                var ind_name = `<li>${gr.members[this_name]}</li>`;
                container3.insertAdjacentHTML('beforeend', ind_name);
            }
        }
        idx +=1;
    }

    sessionStorage.clear();
}

