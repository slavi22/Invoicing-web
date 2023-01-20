/*https://www.w3schools.com/howto/howto_js_tabs.asp*/
/*TAB CONTROL AND AUTOHEIGHT*/
function tabControl(evt, loadTab) {
    let i, tabControlButton, tab;

    //hide everything, could be used on load
    tabControlButton = document.getElementsByClassName("tab")
    for (i = 0; i < tabControlButton.length; i++) {
        tabControlButton[i].style.display = "none";
    }

    //hide the "active"(current) window
    tab = document.getElementsByClassName("tab");
    for (i = 0; i < tab.length; i++) {
        tab[i].className = tab[i].className.replace(" active", "");
    }

    //show the tab i clicked on and make it "active"
    document.getElementById(loadTab).style.display = "grid";
    evt.currentTarget.className += " active";
}

function setAutoHeight(childToBeAdjusted) {
    let parentDivHeight = document.querySelector(".newInvoice").clientHeight;
    let adjust = document.querySelector(`.${childToBeAdjusted}`).clientHeight; //dumbass js....
    if (adjust < parentDivHeight) {
        document.querySelector(`.${childToBeAdjusted}`).style.height = `${parentDivHeight}px`;
    }

}

/*END TAB CONTROL AND AUTOHEIGHT*/
/*START OF INVOICES TAB*/

//EVENTS
//disable double clicking
document.addEventListener("mousedown", function (e) {
    if (e.detail > 1) {
        e.preventDefault();
    }
})

//add a selected class on the new invoice tab's datagrid's cells
$(document).ready(function () {
    $('.addedProducts td').click(function () {
        $('.selected').each(function () {
            $(this).removeClass('selected')
        });
        $(this).addClass('selected');
    });
});

document.addEventListener("DOMContentLoaded", function (e) {
    e.target.addEventListener("click", colorCells)
    e.target.addEventListener("click", InvoicesGridAddSelectedClass)
    e.target.addEventListener("click", colorRow)
})

//FUNCTIONS
function colorCells() {
    let table = document.querySelector(".addedProducts")
    let td = table.getElementsByTagName("td");
    for (let i = 0; i < td.length; i++) {
        if (!td[i].classList.contains("selected")) {
            // console.log("no selected class");
            td[i].style.backgroundColor = "";
            td[i].style.color = "black";
        }
        else {
            // console.log("there is a selected class")
            td[i].style.backgroundColor = "rgb(0, 120, 215)"
            td[i].style.color = "white";

        }
    }
}


function InvoicesGridAddSelectedClass() {
    $('.invoicesInDB tr').click(function () {
        $('.selectedRow').each(function () {
            $(this).removeClass('selectedRow')
        });
        $(this).addClass('selectedRow');
    });
}

function colorRow() {
    let table = document.querySelector(".invoicesInDB");
    let tr = table.getElementsByTagName("tr");
    for (let i = 0; i < tr.length; i++) {
        if (!tr[i].classList.contains("selectedRow")) {
            tr[i].style.backgroundColor = "";
            tr[i].style.color = "black";
        }
        else {
            tr[i].style.backgroundColor = "rgb(0, 120, 215)";
            tr[i].style.color = "white";
        }
    }

}

function loadInvoicesFromDB() {
    $.ajax({
        url: 'phpScript.php',
        type: "GET",
        data: { function: 'InvoicesDBOnLoad' },
        success: function (result) {
            $(".invoicesInDB tbody").append(result);
        }
    });
}
let number = 0;
function tdClick() {
    let id = number;
    $.ajax({
        url: 'phpScript.php',
        type: "POST",
        data: { id: id },
        success: function (res) {
            //alert(res)
            $(".selectedCellInfo>tr").remove();
            $(".selectedCellInfo").append(res);
            $(".selectedCellInfo td:eq(1)").width("25%")

        }
    })
}

function clickedRowNumber() {
    let table = document.querySelector(".invoicesDataGridShowInvoices")
    let tr = table.getElementsByTagName("tr");
    for (let i = 1; i < tr.length; i++) {
        if (tr[i].classList.contains("selectedRow")) {
            number = tr[i].children[0].innerText;
        }
    }
}

/*END OF INVOICES TAB*/

/*START OF NEW INVOICE TAB*/

//FUNCTIONS
function NewInvoicesTabOnLoad(isDisabled){
   let groupBoxes = document.querySelectorAll(".groupBox fieldset");
   for(let items of groupBoxes){
        items.disabled = isDisabled; 
   }
    let buttons = document.querySelectorAll(".newInvoice button, input[type=checkbox]");
    for(let items of buttons){
        items.disabled = isDisabled;
    }
    document.querySelector("#btnNewInvoice").disabled = false;
    document.querySelector("#btnEditInvoice").disabled = false;
    document.querySelector("#btnDelInvoice").disabled = false;
    document.querySelector("#btnPrintPreview").disabled = false;
    document.querySelector("#btnPrint").disabled = false;
    document.querySelector("#btnDialog").disabled = false;
    document.querySelector("#btnSavePDF").disabled = false;
    document.querySelector("#btnExit").disabled = false;
    document.querySelector("#invNumber").disabled=true;
    let firstRowButtons = document.querySelectorAll(".firstRowButtons button");
    for(let items of firstRowButtons){
        items.disabled = false;
    }
    let secondRowButtons = document.querySelectorAll(".secondRowButtons button, input[type=text]");
    for(let items of secondRowButtons){
        items.disabled = false;
    }
    document.querySelector("#invNumber").disabled=true;
}

function NewInvoiceButtonOnClick(){
    count++;
    if(count==1){
        //unlock controls
        NewInvoicesTabOnLoad(false);
    }
    else if(count==2){
        //add new invoice to db
    }
    else if(count>2){
        count=2;
    }
}

function CancelButtonOnClick(){
    count=0;
    NewInvoicesTabOnLoad(true)
}

function NextInvoiceNumber(){
    $.ajax({
        url: 'phpScript.php',
        type: "GET",
        data: { function: 'NextInvoiceNumber' },
        success: function (result) {
            result = Number(result)+1;
            //alert(result);
            $("#invNumber").val(result);
        }
    });
}






//EVENTS
let count = 0;
document.addEventListener("DOMContentLoaded", function(){
    NewInvoicesTabOnLoad(true);
    NextInvoiceNumber();
    document.getElementById("btnNewInvoice").addEventListener("click", function(){
        NewInvoiceButtonOnClick();
    })
    document.getElementById("btnCancel").addEventListener("click", function(){
        CancelButtonOnClick();
    })
})
